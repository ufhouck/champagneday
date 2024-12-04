// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MomentsContract {
    struct Weather {
        int256 temp;
        int256 windSpeed;
        int256 precipMm;
        string condition;
    }

    struct Moment {
        uint256 id;
        address author;
        string text;
        uint256 timestamp;
        uint256 likes;
        Weather weather;
    }

    Moment[] public moments;
    mapping(uint256 => mapping(address => bool)) public hasLiked;

    event MomentCreated(uint256 indexed id, address indexed author);
    event MomentLiked(uint256 indexed id, address indexed liker);

    function createMoment(
        string memory text,
        uint256 timestamp,
        Weather memory weather
    ) public returns (uint256) {
        uint256 id = moments.length;
        moments.push(Moment({
            id: id,
            author: msg.sender,
            text: text,
            timestamp: timestamp,
            likes: 0,
            weather: weather
        }));

        emit MomentCreated(id, msg.sender);
        return id;
    }

    function getMoments() public view returns (Moment[] memory) {
        return moments;
    }

    function likeMoment(uint256 id) public {
        require(id < moments.length, "Invalid moment ID");
        require(!hasLiked[id][msg.sender], "Already liked this moment");

        moments[id].likes += 1;
        hasLiked[id][msg.sender] = true;

        emit MomentLiked(id, msg.sender);
    }
}