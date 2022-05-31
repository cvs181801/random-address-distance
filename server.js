
require("dotenv").config(); 


const express = require('express')
const app = express()
const axios = require('axios')
const path = require('path')
const http = require("http");
const res = require('express/lib/response');
const server = http.createServer(app);
const NodeGeocoder = require('node-geocoder'); 
const { Http2ServerRequest } = require('http2');

const options = {
  provider: 'google',
  //httpAdapter: 'https',
  //fetch: customFetchImplementation,
  apiKey: process.env.GEOCODER_API_KEY, 
  formatter: null
};

const geocoder = NodeGeocoder(options);

app.use(express.json())
app.use('/', express.static(path.join(__dirname, "client")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'))
  })

server.listen(process.env.PORT || 3000);

//server.listen(3000);

const randomAddresses = [
    {1: "12343 NE Holladay Pl Portland, Oregon(OR), 97230"},
    {2: "15564 SE Morrison St Portland, Oregon(OR), 97233"},
    {3: "3125 SW 82nd Ave Portland, Oregon(OR), 97225"},
    {4: "222 SW Columbia St Portland, Oregon(OR), 97201"},
    {5: "2020 SW Broadway Dr #APT 7 Portland, Oregon(OR), 97201"},
    {6: "1849 SE Ankeny St Portland, Oregon(OR), 97214"},
    {7: "3417 N Michigan Ave Portland, Oregon(OR), 97227"},
    {8: "1969 NW Johnson St #APT 302 Portland, Oregon(OR), 97209"},
    {9: "7128 SW Burlingame Ave Portland, Oregon(OR), 97219"},
    {10: "10339 NE Prescott St #306 Portland, Oregon(OR), 97220"},
    {11: "10677 NW Lost Park Dr Portland, Oregon(OR), 97229"},
    {12: "10145 SW Highland Dr Portland, Oregon(OR), 97224"},
    {13: "15768 SE Powell Blvd #9 Portland, Oregon(OR), 97236"},
    {14: "16035 SW King Charles Ave Portland, Oregon(OR), 97224"},
    {15: "15920 NE Fremont St Portland, Oregon(OR), 97230"},
    {16: "2536 SE Harrison St #9 Portland, Oregon(OR), 97222"},
    {17: "236 SE 74th Ave Portland, Oregon(OR), 97215"},
    {18: "12030 SW 97th Pl Portland, Oregon(OR), 97223"},
    {19: "12614 E Burnside St Portland, Oregon(OR), 97233"},
    {20: "200 SW Market St #1770 Portland, Oregon(OR), 97201"},
    {21: "4926 SW 19th Ave Portland, Oregon(OR), 97201"},
    {22: "5038 SE 30th Ave #32 Portland, Oregon(OR), 97202"}
]

app.get('/api/getAddresses', async(req, res) => {
    res.send(["addresses :", randomAddresses])
})    

//from there, get lat and lon for each address

geocoder.geocode("5038 SE 30th Ave #32 Portland, Oregon(OR), 97202")
  .then((res)=> {console.log(res[0])})

  //create algorith using the divide and conquer algorithm to find the x amount of farthest points (based on # of drivers available ) and then 
//find the closest distance between those other points to each cluster center


//create a way to plot these addresses on a map in the browser , showing the regions per driver


//then, find a way to generate random addresses on a map upon refresh or something

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'))
  });