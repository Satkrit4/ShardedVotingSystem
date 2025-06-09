// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//updated
contract ShardVoting {
    struct Candidate {
        uint256 id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
    }

    address public owner;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    bool public electionActive = false;
    bool public electionEnded = false;

    event VoteCasted(address indexed voter, uint256 candidateId);
    event VoterRegistered(address indexed voter);
    event ElectionStarted();
    event ElectionEnded();
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(string[] memory candidateNames, address _owner) {
        owner = _owner;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(i, candidateNames[i], 0));
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier electionNotStarted() {
        require(!electionActive, "Election has already started");
        _;
    }

    modifier electionIsActive() {
        require(electionActive, "Election is not active");
        require(!electionEnded, "Election has ended");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function registerVoter(address _voter) public onlyOwner electionNotStarted {
        require(!voters[_voter].isRegistered, "Voter already registered");
        voters[_voter].isRegistered = true;
        voters[_voter].hasVoted = false;
        emit VoterRegistered(_voter);
    }

    function startElection() public onlyOwner electionNotStarted {
        electionActive = true;
        emit ElectionStarted();
    }

    function endElection() public onlyOwner electionIsActive {
        electionActive = false;
        electionEnded = true;
        emit ElectionEnded();
    }

    function vote(uint256 candidateId) public electionIsActive {
        require(voters[msg.sender].isRegistered, "Not registered to vote");
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(candidateId < candidates.length, "Invalid candidate");

        voters[msg.sender].hasVoted = true;
        candidates[candidateId].voteCount++;

        emit VoteCasted(msg.sender, candidateId);
    }

    function getResults() public view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            results[i] = candidates[i].voteCount;
        }
        return results;
    }
}