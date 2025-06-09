// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ShardVoting.sol";
import "./MainAggregator.sol";

//updated

contract RegionDeployment {
    address public owner;
    ShardVoting[] public shards;
    MainAggregator public aggregator;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(string[][] memory regionCandidates) {
        owner = msg.sender;  // Set the deployer as the owner
        address[] memory shardAddresses = new address[](regionCandidates.length);

        for (uint i = 0; i < regionCandidates.length; i++) {
            // Create shard with the deployer as owner
            ShardVoting shard = new ShardVoting(regionCandidates[i], msg.sender);
            shards.push(shard);
            shardAddresses[i] = address(shard);
        }

        // Create MainAggregator with the deployer as owner
        aggregator = new MainAggregator(shardAddresses, msg.sender);
    }

    // Function to add a new shard (only owner can call)
    function addShard(address shardAddress) public onlyOwner {
        shards.push(ShardVoting(shardAddress));
    }

    // Function to get number of shards
    function getShardCount() public view returns (uint) {
        return shards.length;
    }
}
