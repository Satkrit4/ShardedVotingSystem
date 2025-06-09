// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//updated
interface IShardVoting {
    function getResults() external view returns (uint256[] memory);
}

contract MainAggregator {
    address public owner;
    address[] public shards;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address[] memory shardAddresses, address _owner) {
        owner = _owner;
        shards = shardAddresses;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function addShard(address shardAddress) public onlyOwner {
        shards.push(shardAddress);
    }

    function aggregateResults() public view returns (uint256[] memory) {
        require(shards.length > 0, "No shards available");
        uint256 numCandidates = IShardVoting(shards[0]).getResults().length;
        uint256[] memory aggregatedResults = new uint256[](numCandidates);

        for (uint i = 0; i < shards.length; i++) {
            uint256[] memory shardResults = IShardVoting(shards[i])
                .getResults();
            for (uint j = 0; j < shardResults.length; j++) {
                aggregatedResults[j] += shardResults[j];
            }
        }
        return aggregatedResults;
    }
}
