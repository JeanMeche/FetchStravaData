import strava from '../node_modules/strava-v3';
import { Conf, Config } from './conf';
import moment from 'moment';

const config: Config = Conf.getConfig();
const fileName: string = 'activies.json';

main();

async function main(): Promise<void> {
    process.env.NODE_DEBUG = 'request';

    console.log('config', config);

    let page: number = 1;
    let fetchedResults: Activity[] = [];
    const results: Activity[] = [];
    do {
        fetchedResults = await getActivitiesFromDate(page);
        results.push(...fetchedResults);
        page++;
    } while (fetchedResults.length !== 0);

    saveActivitiesAsJson(results);
}

async function getActivitiesFromDate(page: number): Promise<Activity[]> {
    console.log(page);
    const startMoment: moment.Moment = moment().year(2016).startOf('year');
    const results = await strava.athlete.listActivities({
        after: startMoment.unix(),
        per_page: 200,
        page,
        access_token: config.access_token
    });
    console.log('got ', results.length);
    return results;
}

function saveActivitiesAsJson(activities: Activity[]) {
    console.log('saving');
    const fs = require('fs');
    let json = JSON.stringify(activities, null, 2);

    fs.writeFileSync('./' + fileName, json);
    console.log('saved to ', fileName);
}

interface Activity {
    id: number,
    type: Activity,
    distance: number, // meters 
    moving_time: number,
    elapsed_time: number,
    start_date: string,
}

interface ActivityType {
    Ride: 'Ride',
    Run: 'Run',
}