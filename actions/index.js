const core = require("@actions/core");
const github = require("@actions/github");
const axios = require('axios');

try {
    const payload = github.context.payload;
    console.log(payload.repository.full_name);
    var repoName = payload.repository.full_name.replace("/", "_");
    console.log(repoName);
    payload.commits.forEach((commit) => {
        var username = commit.committer.username;
        var points = 10;
        axios.default.post('https://reward-keeper.herokuapp.com/rewards/', {
            "username" : username,
            "points" : points,
            "repoName": repoName
        }).then((res) => {
            console.log(`${username} rewarded with ${points} points`);
        })
    })
} catch (e) {
    core.setFailed(e.message);
}