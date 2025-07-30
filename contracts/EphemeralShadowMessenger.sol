// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EphemeralShadowMessenger {
    enum ConnectionStatus { None, Pending, Active, Ended }
    enum RequestStatus { Pending, Accepted, Rejected, Expired }

    struct User {
        uint256 uniqueId;
        address walletAddress;
        uint256 registeredAt;
        bool isRegistered;
        string displayName; // Optional display name (max 20 chars)
    }

    struct ConnectionRequest {
        uint256 requesterId;
        uint256 targetId;
        uint256 timestamp;
        uint256 expiresAt;
        RequestStatus status;
        bytes32 requestId;
    }

    struct ChatSession {
        uint256 user1Id;
        uint256 user2Id;
        bytes32 sessionId;
        bytes32 encryptionKeyHash;
        uint256 startTime;
        uint256 lastActivity;
        bool isActive;
        uint256 messageCount;
    }

    struct EphemeralMessage {
        bytes32 sessionId;
        bytes32 encryptedContent;
        uint256 timestamp;
        uint256 expiresAt;
        bool isActive;
        uint256 senderId; // Use user ID instead of address
    }

    // User management
    mapping(address => uint256) public addressToUserId;
    mapping(uint256 => User) public users;
    mapping(uint256 => bool) public userIdExists;
    uint256 public nextUserId = 100000; // Start from 100000 for better UX
    uint256 public totalUsers;

    // Connection management (now using user IDs)
    mapping(bytes32 => ConnectionRequest) public connectionRequests;
    mapping(uint256 => bytes32[]) private userPendingRequests;
    mapping(uint256 => bytes32[]) private userIncomingRequests;
    
    // Session management (now using user IDs)
    mapping(bytes32 => ChatSession) public chatSessions;
    mapping(uint256 => bytes32[]) private userActiveSessions;
    mapping(bytes32 => bytes32[]) private sessionMessages;
    mapping(bytes32 => EphemeralMessage) public messages;

    // User status tracking (now using user IDs)
    mapping(uint256 => uint256) public lastSeen;
    mapping(uint256 => bool) public isOnline;

    // Privacy: Only connected users can see each other's IDs
    mapping(uint256 => mapping(uint256 => bool)) private canSeeUser;

    // Constants
    uint256 public constant REQUEST_EXPIRY = 24 hours;
    uint256 public constant SESSION_TIMEOUT = 30 minutes;
    uint256 public constant MESSAGE_EXPIRY = 1 hours;

    // Events (now using user IDs instead of addresses)
    event UserRegistered(uint256 indexed userId, uint256 timestamp);
    event ConnectionRequested(bytes32 indexed requestId, uint256 indexed requesterId, uint256 indexed targetId);
    event ConnectionAccepted(bytes32 indexed sessionId, uint256 indexed user1Id, uint256 indexed user2Id);
    event ConnectionRejected(bytes32 indexed requestId, uint256 indexed requesterId, uint256 indexed targetId);
    event SessionEnded(bytes32 indexed sessionId, uint256 indexed user1Id, uint256 indexed user2Id);
    event EphemeralMessageSent(bytes32 indexed sessionId, bytes32 indexed messageId, uint256 senderId);
    event UserStatusChanged(uint256 indexed userId, bool isOnline, uint256 timestamp);
    event SessionDestroyed(bytes32 indexed sessionId, uint256 messageCount);

    modifier onlyRegistered() {
        require(addressToUserId[msg.sender] != 0, "User not registered");
        _;
    }

    modifier onlyActiveSession(bytes32 _sessionId) {
        ChatSession memory session = chatSessions[_sessionId];
        uint256 myUserId = addressToUserId[msg.sender];
        require(session.isActive, "Session not active");
        require(
            session.user1Id == myUserId || session.user2Id == myUserId, 
            "Not a participant in this session"
        );
        _;
    }

    modifier updateActivity() {
        uint256 userId = addressToUserId[msg.sender];
        if (userId != 0) {
            lastSeen[userId] = block.timestamp;
            isOnline[userId] = true;
            emit UserStatusChanged(userId, true, block.timestamp);
        }
        _;
    }

    // User registration - assigns unique ID to wallet
    function registerUser(string calldata _displayName) external returns (uint256) {
        require(addressToUserId[msg.sender] == 0, "User already registered");
        require(bytes(_displayName).length <= 20, "Display name too long");
        require(bytes(_displayName).length > 0, "Display name cannot be empty");

        uint256 newUserId = _generateUniqueId();
        
        users[newUserId] = User({
            uniqueId: newUserId,
            walletAddress: msg.sender,
            registeredAt: block.timestamp,
            isRegistered: true,
            displayName: _displayName
        });

        addressToUserId[msg.sender] = newUserId;
        userIdExists[newUserId] = true;
        totalUsers++;

        // Set initial status
        lastSeen[newUserId] = block.timestamp;
        isOnline[newUserId] = true;

        emit UserRegistered(newUserId, block.timestamp);
        emit UserStatusChanged(newUserId, true, block.timestamp);
        
        return newUserId;
    }

    // Generate unique user ID
    function _generateUniqueId() internal returns (uint256) {
        uint256 randomId;
        do {
            randomId = uint256(keccak256(abi.encodePacked(
                block.timestamp,
                block.difficulty,
                msg.sender,
                nextUserId
            ))) % 900000 + 100000; // 6-digit number between 100000-999999
            nextUserId++;
        } while (userIdExists[randomId]);
        
        return randomId;
    }

    // Update display name
    function updateDisplayName(string calldata _newDisplayName) external onlyRegistered {
        require(bytes(_newDisplayName).length <= 20, "Display name too long");
        require(bytes(_newDisplayName).length > 0, "Display name cannot be empty");
        uint256 userId = addressToUserId[msg.sender];
        users[userId].displayName = _newDisplayName;
    }

    // Send connection request using user ID
    function sendConnectionRequest(uint256 _targetUserId) external onlyRegistered updateActivity returns (bytes32) {
        uint256 myUserId = addressToUserId[msg.sender];
        require(_targetUserId != myUserId, "Cannot request connection to yourself");
        require(userIdExists[_targetUserId], "Target user does not exist");

        // Check if there's already an active session or pending request
        require(!hasActiveSession(myUserId, _targetUserId), "Already have active session");
        require(!hasPendingRequest(myUserId, _targetUserId), "Request already pending");

        bytes32 requestId = keccak256(
            abi.encodePacked(myUserId, _targetUserId, block.timestamp, block.difficulty)
        );

        connectionRequests[requestId] = ConnectionRequest({
            requesterId: myUserId,
            targetId: _targetUserId,
            timestamp: block.timestamp,
            expiresAt: block.timestamp + REQUEST_EXPIRY,
            status: RequestStatus.Pending,
            requestId: requestId
        });

        userPendingRequests[myUserId].push(requestId);
        userIncomingRequests[_targetUserId].push(requestId);

        emit ConnectionRequested(requestId, myUserId, _targetUserId);
        return requestId;
    }

    // Accept connection request and create chat session
    function acceptConnectionRequest(bytes32 _requestId, bytes32 _encryptionKeyHash) 
        external onlyRegistered updateActivity returns (bytes32) {
        ConnectionRequest storage request = connectionRequests[_requestId];
        uint256 myUserId = addressToUserId[msg.sender];
        
        require(request.targetId == myUserId, "Not the target of this request");
        require(request.status == RequestStatus.Pending, "Request not pending");
        require(block.timestamp < request.expiresAt, "Request expired");
        require(_encryptionKeyHash != bytes32(0), "Invalid encryption key hash");

        // Update request status
        request.status = RequestStatus.Accepted;

        // Create chat session
        bytes32 sessionId = keccak256(
            abi.encodePacked(request.requesterId, myUserId, block.timestamp, _encryptionKeyHash)
        );

        chatSessions[sessionId] = ChatSession({
            user1Id: request.requesterId,
            user2Id: myUserId,
            sessionId: sessionId,
            encryptionKeyHash: _encryptionKeyHash,
            startTime: block.timestamp,
            lastActivity: block.timestamp,
            isActive: true,
            messageCount: 0
        });

        // Update user session mappings
        userActiveSessions[request.requesterId].push(sessionId);
        userActiveSessions[myUserId].push(sessionId);

        // Allow users to see each other's IDs during active session
        canSeeUser[request.requesterId][myUserId] = true;
        canSeeUser[myUserId][request.requesterId] = true;

        emit ConnectionAccepted(sessionId, request.requesterId, myUserId);
        return sessionId;
    }

    // Reject connection request
    function rejectConnectionRequest(bytes32 _requestId) external onlyRegistered updateActivity {
        ConnectionRequest storage request = connectionRequests[_requestId];
        uint256 myUserId = addressToUserId[msg.sender];
        
        require(request.targetId == myUserId, "Not the target of this request");
        require(request.status == RequestStatus.Pending, "Request not pending");

        request.status = RequestStatus.Rejected;
        emit ConnectionRejected(_requestId, request.requesterId, myUserId);
    }

    // Send ephemeral message in active session
    function sendEphemeralMessage(bytes32 _sessionId, bytes32 _encryptedContent) 
        external onlyRegistered onlyActiveSession(_sessionId) updateActivity returns (bytes32) {
        require(_encryptedContent != bytes32(0), "Invalid encrypted content");

        uint256 myUserId = addressToUserId[msg.sender];
        ChatSession storage session = chatSessions[_sessionId];
        session.lastActivity = block.timestamp;
        session.messageCount++;

        bytes32 messageId = keccak256(
            abi.encodePacked(_sessionId, myUserId, _encryptedContent, block.timestamp)
        );

        messages[messageId] = EphemeralMessage({
            sessionId: _sessionId,
            encryptedContent: _encryptedContent,
            timestamp: block.timestamp,
            expiresAt: block.timestamp + MESSAGE_EXPIRY,
            isActive: true,
            senderId: myUserId
        });

        sessionMessages[_sessionId].push(messageId);

        emit EphemeralMessageSent(_sessionId, messageId, myUserId);
        return messageId;
    }

    // End chat session (destroys all traces)
    function endChatSession(bytes32 _sessionId) external onlyRegistered onlyActiveSession(_sessionId) {
        _destroySession(_sessionId);
    }

    // Go offline (ends all sessions)
    function goOffline() external onlyRegistered {
        uint256 myUserId = addressToUserId[msg.sender];
        isOnline[myUserId] = false;
        lastSeen[myUserId] = block.timestamp;
        
        // End all active sessions for this user
        bytes32[] memory sessions = userActiveSessions[myUserId];
        for (uint i = 0; i < sessions.length; i++) {
            if (chatSessions[sessions[i]].isActive) {
                _destroySession(sessions[i]);
            }
        }

        emit UserStatusChanged(myUserId, false, block.timestamp);
    }

    // Internal function to destroy session and all traces
    function _destroySession(bytes32 _sessionId) internal {
        ChatSession storage session = chatSessions[_sessionId];
        require(session.isActive, "Session already ended");

        // Remove visibility permissions
        canSeeUser[session.user1Id][session.user2Id] = false;
        canSeeUser[session.user2Id][session.user1Id] = false;

        // Destroy all messages in this session
        bytes32[] memory msgIds = sessionMessages[_sessionId];
        for (uint i = 0; i < msgIds.length; i++) {
            delete messages[msgIds[i]];
        }
        delete sessionMessages[_sessionId];

        // Remove session from user mappings
        _removeSessionFromUser(session.user1Id, _sessionId);
        _removeSessionFromUser(session.user2Id, _sessionId);

        uint256 messageCount = session.messageCount;
        
        // Mark session as ended
        session.isActive = false;
        
        emit SessionEnded(_sessionId, session.user1Id, session.user2Id);
        emit SessionDestroyed(_sessionId, messageCount);
    }

    // Remove session from user's active sessions
    function _removeSessionFromUser(uint256 _userId, bytes32 _sessionId) internal {
        bytes32[] storage sessions = userActiveSessions[_userId];
        for (uint i = 0; i < sessions.length; i++) {
            if (sessions[i] == _sessionId) {
                sessions[i] = sessions[sessions.length - 1];
                sessions.pop();
                break;
            }
        }
    }

    // View functions - FIXED to handle unregistered users
    function getMyUserId() external view returns (uint256) {
        return addressToUserId[msg.sender]; // Returns 0 if not registered, doesn't revert
    }

    function isUserRegistered() external view returns (bool) {
        return addressToUserId[msg.sender] != 0;
    }

    function getMyUserInfo() external view returns (uint256 userId, string memory displayName, uint256 registeredAt, bool online) {
        uint256 myUserId = addressToUserId[msg.sender];
        require(myUserId != 0, "User not registered");
        
        User memory user = users[myUserId];
        return (user.uniqueId, user.displayName, user.registeredAt, isOnline[myUserId]);
    }

    function getUserInfo(uint256 _userId) external view returns (string memory displayName, bool online, uint256 lastSeenTime) {
        require(userIdExists[_userId], "User does not exist");
        
        uint256 myUserId = addressToUserId[msg.sender];
        require(myUserId != 0, "You are not registered");
        require(canSeeUser[myUserId][_userId] || myUserId == _userId, "Cannot view this user's info");

        User memory user = users[_userId];
        return (user.displayName, isOnline[_userId], lastSeen[_userId]);
    }

    function getMyPendingRequests() external view onlyRegistered returns (bytes32[] memory) {
        uint256 myUserId = addressToUserId[msg.sender];
        return userPendingRequests[myUserId];
    }

    function getMyIncomingRequests() external view onlyRegistered returns (bytes32[] memory) {
        uint256 myUserId = addressToUserId[msg.sender];
        return userIncomingRequests[myUserId];
    }

    function getMyActiveSessions() external view onlyRegistered returns (bytes32[] memory) {
        uint256 myUserId = addressToUserId[msg.sender];
        return userActiveSessions[myUserId];
    }

    function getSessionMessages(bytes32 _sessionId) external view onlyActiveSession(_sessionId) 
        returns (bytes32[] memory) {
        return sessionMessages[_sessionId];
    }

    function hasActiveSession(uint256 _user1Id, uint256 _user2Id) public view returns (bool) {
        bytes32[] memory sessions = userActiveSessions[_user1Id];
        for (uint i = 0; i < sessions.length; i++) {
            ChatSession memory session = chatSessions[sessions[i]];
            if (session.isActive && 
                ((session.user1Id == _user1Id && session.user2Id == _user2Id) ||
                 (session.user1Id == _user2Id && session.user2Id == _user1Id))) {
                return true;
            }
        }
        return false;
    }

    function hasPendingRequest(uint256 _requesterId, uint256 _targetId) public view returns (bool) {
        bytes32[] memory requests = userPendingRequests[_requesterId];
        for (uint i = 0; i < requests.length; i++) {
            ConnectionRequest memory request = connectionRequests[requests[i]];
            if (request.targetId == _targetId && 
                request.status == RequestStatus.Pending &&
                block.timestamp < request.expiresAt) {
                return true;
            }
        }
        return false;
    }

    // Check if user ID exists (public function for validation)
    function doesUserExist(uint256 _userId) external view returns (bool) {
        return userIdExists[_userId];
    }

    // Get platform statistics - FIXED to handle unregistered users
    function getPlatformStats() external view returns (
        uint256 totalUsersCount,
        uint256 myReceivedRequests,
        uint256 mySentRequests,
        uint256 myActiveSessions
    ) {
        uint256 myUserId = addressToUserId[msg.sender];
        if (myUserId == 0) {
            return (totalUsers, 0, 0, 0);
        }
        
        return (
            totalUsers,
            userIncomingRequests[myUserId].length,
            userPendingRequests[myUserId].length,
            userActiveSessions[myUserId].length
        );
    }

    // Emergency cleanup functions remain the same but use user IDs
    function cleanupInactiveSessions(bytes32[] calldata _sessionIds) external {
        for (uint i = 0; i < _sessionIds.length; i++) {
            bytes32 sessionId = _sessionIds[i];
            ChatSession storage session = chatSessions[sessionId];
            
            if (session.isActive && 
                (block.timestamp - session.lastActivity) > SESSION_TIMEOUT) {
                _destroySession(sessionId);
            }
        }
    }

    function cleanupExpiredMessages(bytes32[] calldata _messageIds) external {
        for (uint i = 0; i < _messageIds.length; i++) {
            bytes32 msgId = _messageIds[i];
            EphemeralMessage storage message = messages[msgId];
            
            if (message.isActive && block.timestamp >= message.expiresAt) {
                message.isActive = false;
            }
        }
    }
}
