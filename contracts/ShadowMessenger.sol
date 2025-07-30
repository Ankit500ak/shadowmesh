// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ShadowMessenger {
    struct Message {
        bytes32 contentHash;        // IPFS hash of encrypted content
        bytes32 metadataHash;       // Hash of sender+receiver+timestamp (for verification)
        uint256 timestamp;
        uint256 expiresAt;          // Message expiration timestamp
        bool isActive;              // Message validity
    }

    struct ReadReceipt {
        bytes32 messageHash;
        uint256 readAt;
        bool isRead;
    }

    // Private mappings - no direct access to sender/receiver relationships
    mapping(bytes32 => Message) private messages;
    mapping(address => bytes32[]) private userInbox;
    mapping(address => bytes32[]) private userSent;
    mapping(bytes32 => ReadReceipt) private readReceipts;
    mapping(address => uint256) public userMessageCount;
    
    // Public statistics (privacy-preserving)
    uint256 public totalMessages;
    uint256 public activeMessages;
    
    // Events (no sender/receiver info exposed)
    event MessageSent(bytes32 indexed messageId, uint256 timestamp, uint256 expiresAt);
    event MessageRead(bytes32 indexed messageId, uint256 timestamp);
    event MessageExpired(bytes32 indexed messageId);

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        require(_addr != msg.sender, "Cannot send to yourself");
        _;
    }

    modifier messageExists(bytes32 _messageId) {
        require(messages[_messageId].isActive, "Message does not exist or expired");
        _;
    }

    // Enhanced message sending with privacy and expiration
    function sendMessage(
        bytes32 _contentHash,
        address _to,
        uint256 _expirationHours
    ) external validAddress(_to) returns (bytes32) {
        require(_contentHash != bytes32(0), "Content hash cannot be empty");
        require(_expirationHours > 0 && _expirationHours <= 8760, "Invalid expiration (1-8760 hours)");

        // Generate unique message ID using keccak256
        bytes32 messageId = keccak256(
            abi.encodePacked(
                msg.sender,
                _to,
                _contentHash,
                block.timestamp,
                block.difficulty
            )
        );

        // Create metadata hash for verification (sender+receiver+timestamp)
        bytes32 metadataHash = keccak256(
            abi.encodePacked(msg.sender, _to, block.timestamp)
        );

        uint256 expiresAt = block.timestamp + (_expirationHours * 1 hours);

        // Store message
        messages[messageId] = Message({
            contentHash: _contentHash,
            metadataHash: metadataHash,
            timestamp: block.timestamp,
            expiresAt: expiresAt,
            isActive: true
        });

        // Update user mappings
        userInbox[_to].push(messageId);
        userSent[msg.sender].push(messageId);
        userMessageCount[_to]++;

        // Update statistics
        totalMessages++;
        activeMessages++;

        emit MessageSent(messageId, block.timestamp, expiresAt);
        return messageId;
    }

    // Get messages for current user (privacy-preserving)
    function getMyMessages() external view returns (
        bytes32[] memory messageIds,
        bytes32[] memory contentHashes,
        uint256[] memory timestamps,
        uint256[] memory expirations,
        bool[] memory readStatus
    ) {
        bytes32[] memory inbox = userInbox[msg.sender];
        uint256 activeCount = 0;

        // Count active messages
        for (uint i = 0; i < inbox.length; i++) {
            if (messages[inbox[i]].isActive && block.timestamp < messages[inbox[i]].expiresAt) {
                activeCount++;
            }
        }

        // Prepare return arrays
        messageIds = new bytes32[](activeCount);
        contentHashes = new bytes32[](activeCount);
        timestamps = new uint256[](activeCount);
        expirations = new uint256[](activeCount);
        readStatus = new bool[](activeCount);

        uint256 index = 0;
        for (uint i = 0; i < inbox.length; i++) {
            bytes32 msgId = inbox[i];
            Message memory msg = messages[msgId];
            
            if (msg.isActive && block.timestamp < msg.expiresAt) {
                messageIds[index] = msgId;
                contentHashes[index] = msg.contentHash;
                timestamps[index] = msg.timestamp;
                expirations[index] = msg.expiresAt;
                readStatus[index] = readReceipts[msgId].isRead;
                index++;
            }
        }
    }

    // Get sent messages for current user
    function getMySentMessages() external view returns (
        bytes32[] memory messageIds,
        bytes32[] memory contentHashes,
        uint256[] memory timestamps,
        bool[] memory readStatus
    ) {
        bytes32[] memory sent = userSent[msg.sender];
        uint256 activeCount = 0;

        // Count active messages
        for (uint i = 0; i < sent.length; i++) {
            if (messages[sent[i]].isActive && block.timestamp < messages[sent[i]].expiresAt) {
                activeCount++;
            }
        }

        // Prepare return arrays
        messageIds = new bytes32[](activeCount);
        contentHashes = new bytes32[](activeCount);
        timestamps = new uint256[](activeCount);
        readStatus = new bool[](activeCount);

        uint256 index = 0;
        for (uint i = 0; i < sent.length; i++) {
            bytes32 msgId = sent[i];
            Message memory msg = messages[msgId];
            
            if (msg.isActive && block.timestamp < msg.expiresAt) {
                messageIds[index] = msgId;
                contentHashes[index] = msg.contentHash;
                timestamps[index] = msg.timestamp;
                readStatus[index] = readReceipts[msgId].isRead;
                index++;
            }
        }
    }

    // Mark message as read (zero-knowledge simulation)
    function markAsRead(bytes32 _messageId) external messageExists(_messageId) {
        // Verify user has access to this message
        bool hasAccess = false;
        bytes32[] memory inbox = userInbox[msg.sender];
        
        for (uint i = 0; i < inbox.length; i++) {
            if (inbox[i] == _messageId) {
                hasAccess = true;
                break;
            }
        }
        
        require(hasAccess, "No access to this message");
        require(!readReceipts[_messageId].isRead, "Message already read");

        readReceipts[_messageId] = ReadReceipt({
            messageHash: _messageId,
            readAt: block.timestamp,
            isRead: true
        });

        emit MessageRead(_messageId, block.timestamp);
    }

    // Clean up expired messages (anyone can call)
    function cleanupExpiredMessages(bytes32[] calldata _messageIds) external {
        for (uint i = 0; i < _messageIds.length; i++) {
            bytes32 msgId = _messageIds[i];
            Message storage msg = messages[msgId];
            
            if (msg.isActive && block.timestamp >= msg.expiresAt) {
                msg.isActive = false;
                activeMessages--;
                emit MessageExpired(msgId);
            }
        }
    }

    // Get message details (only content hash, no sender/receiver info)
    function getMessageDetails(bytes32 _messageId) external view messageExists(_messageId) 
        returns (bytes32 contentHash, uint256 timestamp, uint256 expiresAt, bool isRead) {
        Message memory msg = messages[_messageId];
        return (
            msg.contentHash,
            msg.timestamp,
            msg.expiresAt,
            readReceipts[_messageId].isRead
        );
    }

    // Privacy-preserving statistics
    function getPlatformStats() external view returns (
        uint256 total,
        uint256 active,
        uint256 userReceived,
        uint256 userSent
    ) {
        return (
            totalMessages,
            activeMessages,
            userInbox[msg.sender].length,
            userSent[msg.sender].length
        );
    }

    // Verify message authenticity (zero-knowledge proof simulation)
    function verifyMessage(
        bytes32 _messageId,
        address _sender,
        address _receiver,
        uint256 _timestamp
    ) external view returns (bool) {
        Message memory msg = messages[_messageId];
        bytes32 expectedHash = keccak256(abi.encodePacked(_sender, _receiver, _timestamp));
        return msg.metadataHash == expectedHash && msg.timestamp == _timestamp;
    }
}
