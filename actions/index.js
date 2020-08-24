const core = require("@actions/core");
const github = require("@actions/github");
const axios = require('axios');

try {
    const payload = github.context.payload;
    console.log(payload.commits);
} catch (e) {
    core.setFailed(e.message);
}