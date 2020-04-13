# FetchStravaData
Fetch my strava data 


# How To 
## Edit Conf.json
* Add `client_id` & `client_secret` to `conf.js`

## Get the token 
* run `npm install`
* run `node node getAccessToken.js`
* You should see the retrieved oauth access_token in `conf.json`

## Fetch the activities 
* run the script `npm run start:dev`
* activities are stored in `activities.json` 
