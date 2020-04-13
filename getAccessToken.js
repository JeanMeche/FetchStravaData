/* global require */
var opn = require('opn');

async function main() {
    const authCode = await getAuthorizationCode();
    const result = await getAccessToken(authCode);
    console.log('Access Token ' + result.accessToken);
    updateConfFile(result.accessToken);
}

async function closeExistingLoginTabs() {
    const {
        execSync
    } = require('child_process');
    execSync('osascript closeTab.scpt "http://localhost/?"')
}

async function getAuthorizationCode() {
    closeExistingLoginTabs();
    let authorizationCode;
    let hasOpenBrowser = false;
    do {
        const {
            execSync
        } = require('child_process');
        const urls = execSync('osascript getOpenTabs.scpt').toString();
        const regex = /localhost\/?.*code=(.*)&.*/;
        const matches = urls.match(regex);
        if (matches && matches[1]) {
            authorizationCode = matches[1];
        }
        if (!hasOpenBrowser) {
            const authUrl = 'https://www.strava.com/oauth/authorize\?client_id\=17419\&scope\=activity:read_all,profile:read_all,read_all\&redirect_uri\=http://localhost\&response_type\=code\&approval_prompt\=auto';
            opn(authUrl);
            hasOpenBrowser = true;
        }
        await sleep(1000);
    } while (!authorizationCode)
    console.log('Got AuthCode : ' + authorizationCode);
    closeExistingLoginTabs();
    return authorizationCode;
}

async function getAccessToken(authCode) {
    const axios = require('axios');
    const conf = require('./conf.json');
    const baseUrl = 'https://www.strava.com/oauth/token?';
    const data = {
        ...conf,
        code: authCode,
        grant_type: 'authorization_code'
    };
    try {
        const querystring = require('querystring');
        const response = await axios.post(baseUrl, querystring.stringify(data));
        return {
            accessToken: response.data.access_token
        }
    } catch (error) {
        console.log(error.response.data);
        console.log(error.response.status);
    }
}

function updateConfFile(accessToken) {
    const fs = require('fs');
    let rawdata = fs.readFileSync('./conf.json');
    let conf = JSON.parse(rawdata);
    conf.access_token = accessToken;
    let json = JSON.stringify(conf, null, 2);
    fs.writeFileSync('./conf.json', json);
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

main();