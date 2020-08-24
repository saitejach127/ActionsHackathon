const core = require("@actions/core");
const github = require("@actions/github");
const axios = require('axios');

try {
    const payload = github.context.payload;
    payload.commits.forEach((commit) => {
        console.log(commit.committer.username);
    })
} catch (e) {
    core.setFailed(e.message);
}