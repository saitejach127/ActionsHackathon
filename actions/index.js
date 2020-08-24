const core = require("@actions/core");
const github = require("@actions/github");
const axios = require('axios');

try {
    const payload = github.context.payload;
    payload.commits.forEach((commit) => {
        var username = commit.committer.username;
        var points = 10;
        axios.default.post('https://reward-keeper.herokuapp.com/rewards/', {
            "username" : username,
            "points" : points
        }).then((res) => {
            console.log(`${username} rewarded with ${points} points`);
        })
    })
} catch (e) {
    core.setFailed(e.message);
}