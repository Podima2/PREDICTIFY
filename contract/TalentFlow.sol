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

    // Mappings to store user roles and profiles
    mapping(address => UserRole) public userRoles;
    mapping(address => AthleteProfile) public athleteProfiles;
    mapping(address => ScoutProfile) public scoutProfiles;

    // Events to log user registration
    event AthleteRegistered(address indexed userAddress, string name, string sport);
    event ScoutRegistered(address indexed userAddress, string name, string organization);

    // Modifier to ensure an address is not already registered
    modifier notRegistered() {
        require(userRoles[msg.sender] == UserRole.None, "User already registered");
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
}

