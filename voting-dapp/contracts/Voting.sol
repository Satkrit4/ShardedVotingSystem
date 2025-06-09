// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

contract Election {
    enum State {
        NotStarted,
        InProgress,
        Ended
    }

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    address public owner;
    State public electionState;

    struct Voter {
        uint256 id;
        string name;
    }

    Candidate[] public candidates;
    mapping(address => bool) voted;

    mapping(address => bool) isVoter;

    uint256 public candidatesCount = 0;

    uint256 public votersCount = 0;

    constructor(string[] memory candidateNames) {
        owner = msg.sender;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(i, candidateNames[i], 0));
        }
    }
    event Voted(uint256 indexed _candidateId);

    function startElection() public {
        require(msg.sender == owner);
        require(electionState == State.NotStarted);
        electionState = State.InProgress;
    }

    function endElection() public {
        require(msg.sender == owner);
        require(electionState == State.InProgress);
        electionState = State.Ended;
    }

    function addCandidate(string memory _name) public {
        require(owner == msg.sender, "Only owner can add candidates");
        require(
            electionState == State.NotStarted,
            "Election has already started"
        );

        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidatesCount++;
    }

    function addVoter(address _voter) public {
        require(owner == msg.sender, "Only owner can add voter");
        require(!isVoter[_voter], "Voter already added");
        require(
            electionState == State.NotStarted,
            "Voter can't be added after election started"
        );

        isVoter[_voter] = true;
    }

    function getRole(address _current) public view returns (uint256) {
        if (owner == _current) {
            return 1;
        } else if (isVoter[_current]) {
            return 2;
        } else {
            return 3;
        }
    }

    function vote(uint256 _candidateId) public {
        require(
            electionState == State.InProgress,
            "Election is not in progress"
        );
        require(isVoter[msg.sender], "Non authorised user cannot vote");
        require(!voted[msg.sender], "You have already voted");
        require(
            _candidateId >= 0 && _candidateId < candidatesCount,
            "Invalid candidate ID"
        );

        candidates[_candidateId].voteCount++;
        voted[msg.sender] = true;

        emit Voted(_candidateId);
    }

    function getCandidateDetails(
        uint256 _candidateId
    ) public view returns (string memory, uint256) {
        require(
            _candidateId >= 0 && _candidateId < candidatesCount,
            "Invalid candidate ID"
        );
        return (
            candidates[_candidateId].name,
            candidates[_candidateId].voteCount
        );
    }
    //updated
    function getResults() public view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            results[i] = candidates[i].voteCount;
        }
        return results;
    }
}
