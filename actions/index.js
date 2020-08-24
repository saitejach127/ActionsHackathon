const core = require("@actions/core");
const github = require("@actions/github");
const axios = require('axios');

try {
    const payload = github.context.payload;
    console.log(payload);
    payload.commits.forEach((commit) => {
        var username = commit.commiter.username;
        axios.default.post('https://reward-keeper.herokuapp.com/rewards/',{
            username : username,
            points : 10
        }).then((res) => {
            console.log(`${username} rewarded with 10 points`);
        })
    })
} catch (e) {
    core.setFailed(e.message);
}