export class Conf {

    static getConfig(): Config {
        const fs = require('fs');
        const rawdata = fs.readFileSync('./conf.json');
        const conf = JSON.parse(rawdata);
        return conf;
    }
}

export interface Config {
    client_id: string,
    client_secret: string,
    access_token: string,
    redirect_uri: string,
}