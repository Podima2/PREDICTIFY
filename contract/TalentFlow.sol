// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserRegistry {
    // Enum to define user roles
    enum UserRole {
        None,
        Athlete,
        Scout
    }

    // Structs to store user profile data
    struct AthleteProfile {
        string avatar;
        string name;
        uint256 age;
        string sport;
        string position;
        string bio;
        // Add more athlete-specific fields as needed
    }

    struct ScoutProfile {
        string avatar; 
        string name;
        string organization;
        string position;
        // Add more scout-specific fields as needed
    }

    // Simplified Highlight struct - only stores IPFS hash
    struct Highlight {
        string metadataIpfsHash;   // IPFS hash of the complete highlight metadata JSON
        bool isActive;             // Whether the highlight is active/visible
        address athleteAddress;    // Address of the athlete who uploaded
    }

    // Mappings to store user roles and profiles
    mapping(address => UserRole) public userRoles;
    mapping(address => AthleteProfile) public athleteProfiles;
    mapping(address => ScoutProfile) public scoutProfiles;

    // Highlight tracking
    mapping(uint256 => Highlight) public highlights;
    mapping(address => uint256[]) public athleteHighlights; // Athlete address => array of highlight IDs
    uint256 public nextHighlightId = 1;

    // Events to log user registration
    event AthleteRegistered(address indexed userAddress, string name, string sport);
    event ScoutRegistered(address indexed userAddress, string name, string organization);
    
    // Events for highlight management
    event HighlightUploaded(
        uint256 indexed highlightId,
        address indexed athleteAddress,
        string metadataIpfsHash,
        uint256 uploadedAt
    );
    event HighlightUpdated(uint256 indexed highlightId, string metadataIpfsHash);
    event HighlightDeactivated(uint256 indexed highlightId);
    event HighlightViewed(uint256 indexed highlightId, address indexed viewer);
    event HighlightLiked(uint256 indexed highlightId, address indexed liker);
    event HighlightSaved(uint256 indexed highlightId, address indexed saver);

    // Modifier to ensure an address is not already registered
    modifier notRegistered() {
        require(userRoles[msg.sender] == UserRole.None, "User already registered");
        _;
    }

    // Modifier to ensure only athletes can upload highlights
    modifier onlyAthlete() {
        require(userRoles[msg.sender] == UserRole.Athlete, "Only athletes can upload highlights");
        _;
    }

    // Modifier to ensure highlight exists and is active
    modifier highlightExists(uint256 _highlightId) {
        require(_highlightId > 0 && _highlightId < nextHighlightId, "Highlight does not exist");
        require(highlights[_highlightId].isActive, "Highlight is not active");
        _;
    }

    /**
     * @dev Registers the calling address as an Athlete.
     * @param _name The athlete's name.
     * @param _age The athlete's age.
     * @param _sport The athlete's primary sport.
     * @param _position The athlete's position.
     * @param _bio A short biography of the athlete.
     */
    function registerAthlete(
        string memory _avatar,
        string memory _name,
        uint256 _age,
        string memory _sport,
        string memory _position,
        string memory _bio
    ) external notRegistered {
        userRoles[msg.sender] = UserRole.Athlete;
        athleteProfiles[msg.sender] = AthleteProfile({
            avatar: _avatar,
            name: _name,
            age: _age,
            sport: _sport,
            position: _position,
            bio: _bio
        });
        emit AthleteRegistered(msg.sender, _name, _sport);
    }

    /**
     * @dev Registers the calling address as a Scout.
     * @param _name The scout's name.
     * @param _organization The scout's organization.
     * @param _position The scout's position within the organization.
     */
    function registerScout(
        string memory _avatar,
        string memory _name,
        string memory _organization,
        string memory _position
    ) external notRegistered {
        userRoles[msg.sender] = UserRole.Scout;
        scoutProfiles[msg.sender] = ScoutProfile({
            avatar: _avatar,
            name: _name,
            organization: _organization,
            position: _position
        });
        emit ScoutRegistered(msg.sender, _name, _organization);
    }

    /**
     * @dev Uploads a new highlight with metadata stored on IPFS
     * @param _metadataIpfsHash IPFS hash of the complete highlight metadata JSON
     */
    function uploadHighlight(string memory _metadataIpfsHash) external onlyAthlete {
        uint256 highlightId = nextHighlightId;
        
        highlights[highlightId] = Highlight({
            metadataIpfsHash: _metadataIpfsHash,
            isActive: true,
            athleteAddress: msg.sender
        });

        athleteHighlights[msg.sender].push(highlightId);
        nextHighlightId++;

        emit HighlightUploaded(
            highlightId,
            msg.sender,
            _metadataIpfsHash,
            block.timestamp
        );
    }

    /**
     * @dev Updates highlight metadata (only by the athlete who uploaded it)
     * @param _highlightId ID of the highlight to update
     * @param _newMetadataIpfsHash New IPFS hash of the updated metadata
     */
    function updateHighlight(
        uint256 _highlightId,
        string memory _newMetadataIpfsHash
    ) external highlightExists(_highlightId) {
        require(highlights[_highlightId].athleteAddress == msg.sender, "Only the uploader can update");
        
        highlights[_highlightId].metadataIpfsHash = _newMetadataIpfsHash;

        emit HighlightUpdated(_highlightId, _newMetadataIpfsHash);
    }

    /**
     * @dev Deactivates a highlight (only by the athlete who uploaded it)
     * @param _highlightId ID of the highlight to deactivate
     */
    function deactivateHighlight(uint256 _highlightId) external highlightExists(_highlightId) {
        require(highlights[_highlightId].athleteAddress == msg.sender, "Only the uploader can deactivate");
        
        highlights[_highlightId].isActive = false;
        emit HighlightDeactivated(_highlightId);
    }

    /**
     * @dev Records a view of a highlight
     * @param _highlightId ID of the highlight being viewed
     */
    function recordView(uint256 _highlightId) external highlightExists(_highlightId) {
        emit HighlightViewed(_highlightId, msg.sender);
    }

    /**
     * @dev Records a like on a highlight
     * @param _highlightId ID of the highlight being liked
     */
    function likeHighlight(uint256 _highlightId) external highlightExists(_highlightId) {
        emit HighlightLiked(_highlightId, msg.sender);
    }

    /**
     * @dev Records a save of a highlight
     * @param _highlightId ID of the highlight being saved
     */
    function saveHighlight(uint256 _highlightId) external highlightExists(_highlightId) {
        emit HighlightSaved(_highlightId, msg.sender);
    }

    /**
     * @dev Returns the role of a given address.
     * @param _user The address to query.
     * @return The UserRole enum value (0 for None, 1 for Athlete, 2 for Scout).
     */
    function getUserRole(address _user) external view returns (UserRole) {
        return userRoles[_user];
    }

    /**
     * @dev Returns the AthleteProfile for a given address.
     * @param _athlete The address of the athlete.
     * @return The AthleteProfile struct.
     */
    function getAthleteProfile(address _athlete) external view returns (AthleteProfile memory) {
        require(userRoles[_athlete] == UserRole.Athlete, "Address is not an Athlete");
        return athleteProfiles[_athlete];
    }

    /**
     * @dev Returns the ScoutProfile for a given address.
     * @param _scout The address of the scout.
     * @return The ScoutProfile struct.
     */
    function getScoutProfile(address _scout) external view returns (ScoutProfile memory) {
        require(userRoles[_scout] == UserRole.Scout, "Address is not a Scout");
        return scoutProfiles[_scout];
    }

    /**
     * @dev Returns a specific highlight by ID
     * @param _highlightId ID of the highlight
     * @return The Highlight struct
     */
    function getHighlight(uint256 _highlightId) external view returns (Highlight memory) {
        require(_highlightId > 0 && _highlightId < nextHighlightId, "Highlight does not exist");
        return highlights[_highlightId];
    }

    /**
     * @dev Returns all highlight IDs for a specific athlete
     * @param _athleteAddress Address of the athlete
     * @return Array of highlight IDs
     */
    function getAthleteHighlightIds(address _athleteAddress) external view returns (uint256[] memory) {
        return athleteHighlights[_athleteAddress];
    }

    /**
     * @dev Returns highlights for a specific athlete with pagination
     * @param _athleteAddress Address of the athlete
     * @param _offset Starting index
     * @param _limit Number of highlights to return
     * @return Array of Highlight structs
     */
    function getAthleteHighlights(
        address _athleteAddress,
        uint256 _offset,
        uint256 _limit
    ) external view returns (Highlight[] memory) {
        uint256[] memory highlightIds = athleteHighlights[_athleteAddress];
        uint256 totalHighlights = highlightIds.length;
        
        if (_offset >= totalHighlights) {
            return new Highlight[](0);
        }
        
        uint256 endIndex = _offset + _limit;
        if (endIndex > totalHighlights) {
            endIndex = totalHighlights;
        }
        
        uint256 resultCount = endIndex - _offset;
        Highlight[] memory result = new Highlight[](resultCount);
        
        for (uint256 i = 0; i < resultCount; i++) {
            uint256 highlightId = highlightIds[_offset + i];
            result[i] = highlights[highlightId];
        }
        
        return result;
    }

    /**
     * @dev Returns recent highlights with pagination
     * @param _offset Starting index
     * @param _limit Number of highlights to return
     * @return Array of Highlight structs
     */
    function getRecentHighlights(
        uint256 _offset,
        uint256 _limit
    ) external view returns (Highlight[] memory) {
        uint256 totalHighlights = nextHighlightId - 1;
        
        if (_offset >= totalHighlights) {
            return new Highlight[](0);
        }
        
        uint256 endIndex = _offset + _limit;
        if (endIndex > totalHighlights) {
            endIndex = totalHighlights;
        }
        
        uint256 resultCount = endIndex - _offset;
        Highlight[] memory result = new Highlight[](resultCount);
        
        for (uint256 i = 0; i < resultCount; i++) {
            uint256 highlightId = totalHighlights - _offset - i;
            if (highlights[highlightId].isActive) {
                result[i] = highlights[highlightId];
            }
        }
        
        return result;
    }
}

