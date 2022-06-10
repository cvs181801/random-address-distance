
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
const haversine = require('haversine')


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
    {address: "12343 NE Holladay Pl Portland, Oregon(OR), 97230"},
    {address: "15564 SE Morrison St Portland, Oregon(OR), 97233"},
    {address: "3125 SW 82nd Ave Portland, Oregon(OR), 97225"},
    {address: "222 SW Columbia St Portland, Oregon(OR), 97201"},
    {address: "2020 SW Broadway Dr #APT 7 Portland, Oregon(OR), 97201"},
    {address: "1849 SE Ankeny St Portland, Oregon(OR), 97214"},
    {address: "3417 N Michigan Ave Portland, Oregon(OR), 97227"},
    {address: "1969 NW Johnson St #APT 302 Portland, Oregon(OR), 97209"},
    {address: "7128 SW Burlingame Ave Portland, Oregon(OR), 97219"},
    {address: "10339 NE Prescott St #306 Portland, Oregon(OR), 97220"},
    {address: "10677 NW Lost Park Dr Portland, Oregon(OR), 97229"},
    {address: "10145 SW Highland Dr Portland, Oregon(OR), 97224"},
    {address: "15768 SE Powell Blvd #9 Portland, Oregon(OR), 97236"},
    {address: "16035 SW King Charles Ave Portland, Oregon(OR), 97224"},
    {address: "15920 NE Fremont St Portland, Oregon(OR), 97230"},
    {address: "2536 SE Harrison St #9 Portland, Oregon(OR), 97222"},
    {address: "236 SE 74th Ave Portland, Oregon(OR), 97215"},
    {address: "12030 SW 97th Pl Portland, Oregon(OR), 97223"},
    {address: "12614 E Burnside St Portland, Oregon(OR), 97233"},
    {address: "200 SW Market St #1770 Portland, Oregon(OR), 97201"},
    {address: "4926 SW 19th Ave Portland, Oregon(OR), 97201"},
    {address: "5038 SE 30th Ave #32 Portland, Oregon(OR), 97202"}
]

app.get('/api/getAddresses', async(req, res) => {
    res.send(["addresses :", randomAddresses])
})    

//from there, get lat and lon for each address

// function getAllByContent() {
//   app.get('/api/searchdata', async (req, res) => {
//       const {search} = req.query;
//       const response1 = await axios.get(`https://api.twitter.com/2/tweets/search/recent?query=${search}&tweet.fields=created_at,public_metrics&expansions=attachments.media_keys,author_id&media.fields=media_key,type,preview_image_url,url,alt_text`, {headers}) 
//       const response2 = await axios.get(`https://api.twitter.com/2/users?ids=${response1.data.data[0].author_id},${response1.data.data[1].author_id},${response1.data.data[2].author_id},${response1.data.data[3].author_id},${response1.data.data[4].author_id},${response1.data.data[5].author_id},${response1.data.data[6].author_id},${response1.data.data[7].author_id},${response1.data.data[8].author_id},${response1.data.data[9].author_id}&expansions=pinned_tweet_id&user.fields=profile_image_url,verified`, {headers}) 
//       res.send(massageTwitterData(response1.data.data, response1.data.includes.media, response2.data.data))
//       return response1, response2
//   })
// }


let newAddressArray = [];
function massageAddressArray(array) {
  app.get('/api/test', async ( req, res ) => {
      for (let i=0; i < array.length; i++) {
        let result = await geocoder.geocode(array[i]);
        newAddressArray.push({formattedAddress: result[0].formattedAddress, latitude: result[0].latitude, longitude: result[0].longitude})
      }
      //console.log(newAddressArray)
      findFarthestPoint(newAddressArray)
      res.send(newAddressArray)
  })
}

massageAddressArray(randomAddresses);
//I struggled with getting the res.send() from express.js to send from within a array.forEach method.  I ended up having to use a for loop to loop through each address and get the geolocation data.

// const newestAddressArray = masterAddressList.map(addressObj=> {
//   return new MasterAddress(addressObj) 
// })

class MasterAddress {
  constructor(address) {
    this.formattedAddress = address.formattedAddress,
    this.latitude = address.latitude,
    this.longitude = address.longitude
  }
}

  //create algorithm using the divide and conquer algorithm to find the x amount of farthest points (based on # of drivers available ) and then 
//find the closest distance between those other points to each cluster center

//1. find the 2 points farthest apart

// const start = {
//   latitude: 30.849635,
//   longitude: -83.24559
// }

// const end = {
//   latitude: 27.950575,
//   longitude: -82.457178
// }

// console.log('haversine :', haversine(start, end, {unit: 'mile'}))
function findFarthestPoint(array) {

  for (let i=0; i < array.length; i++) {
     let start = {
       latitude: array[i].latitude,
       longitude: array[i].longitude
     }
 
     console.log('start is here! ', start)
     
   }
 
 }
 
//findFarthestPoint(massageAddressArray)
//ultimately I think we will need to map over the initial function result in order to get the array into a usable container . ?


//   [{
//   formattedAddress: '200 SW Market St # 1770, Portland, OR 97201, USA',
//   latitude: 45.51159759999999,
//   longitude: -122.6786514
// },
// {
//   formattedAddress: '12030 SW 97th Pl, Tigard, OR 97223, USA',
//   latitude: 45.433523,
//   longitude: -122.7757947
// },
// {
//   formattedAddress: '12614 E Burnside St, Portland, OR 97233, USA',
//   latitude: 45.5222491,
//   longitude: -122.5331974
// }
// ]
//)

//2. if more than 2 drivers available, find the other driver's points in between 2 farthest points.
//3. for the remainder of the points, use formula to identify which marker point they're closest to

//loop through each point, getting the distance from it and all other points. return the greatest distance.
//once you found the point farthest away from each point, look through all those results and find the greatest distance.
//no you have your two starting points.



//create a way to plot these addresses on a map in the browser , showing the regions per driver


//then, find a way to generate random addresses on a map upon refresh or something

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'))
  });