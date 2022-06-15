
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

const randomAddresses = [
    {index: 1, address: "12343 NE Holladay Pl Portland, Oregon(OR), 97230"},
    {index: 2, address: "15564 SE Morrison St Portland, Oregon(OR), 97233"},
    {index: 3, address: "3125 SW 82nd Ave Portland, Oregon(OR), 97225"},
    {index: 4, address: "3125 SW 82nd Ave Portland, Oregon(OR), 97225"},
    {index: 5, address: "222 SW Columbia St Portland, Oregon(OR), 97201"},
    {index: 6, address: "2020 SW Broadway Dr #APT 7 Portland, Oregon(OR), 97201"},
    {index: 7, address: "1849 SE Ankeny St Portland, Oregon(OR), 97214"},
    {index: 8, address: "3417 N Michigan Ave Portland, Oregon(OR), 97227"},
    {index: 9, address: "1969 NW Johnson St #APT 302 Portland, Oregon(OR), 97209"},
    {index: 10, address: "7128 SW Burlingame Ave Portland, Oregon(OR), 97219"},
    {index: 11, address: "10339 NE Prescott St #306 Portland, Oregon(OR), 97220"},
    {index: 12, address: "10677 NW Lost Park Dr Portland, Oregon(OR), 97229"},
    {index: 13, address: "10145 SW Highland Dr Portland, Oregon(OR), 97224"},
    {index: 14, address: "15768 SE Powell Blvd #9 Portland, Oregon(OR), 97236"},
    {index: 15, address: "16035 SW King Charles Ave Portland, Oregon(OR), 97224"},
    {index: 16, address: "15920 NE Fremont St Portland, Oregon(OR), 97230"},
    {index: 17, address: "2536 SE Harrison St #9 Portland, Oregon(OR), 97222"},
    {index: 18, address: "236 SE 74th Ave Portland, Oregon(OR), 97215"},
    {index: 19, address: "12030 SW 97th Pl Portland, Oregon(OR), 97223"},
    {index: 20, address: "12614 E Burnside St Portland, Oregon(OR), 97233"},
    {index: 21, address: "200 SW Market St #1770 Portland, Oregon(OR), 97201"},
    {index: 22, address: "4926 SW 19th Ave Portland, Oregon(OR), 97201"},
    {index: 23, address: "5038 SE 30th Ave #32 Portland, Oregon(OR), 97202"}
]

// app.get('/api/getAddresses', async(req, res) => {
//     res.send(["addresses :", randomAddresses])
// })    

//from there, get lat and lon for each address

let newAddressArray = [];
function massageAddressArray(array) {
  app.get('/api/test', async ( req, res ) => {
      for (let i=0; i < array.length; i++) {
        let result = await geocoder.geocode(array[i]);
        console.log("result 1!! ", result[0]) //ok the index dosent come through here so we'll need to push it in separately
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

// class MasterAddress {
//   constructor(address) {
//     this.formattedAddress = address.formattedAddress,
//     this.latitude = address.latitude,
//     this.longitude = address.longitude
//   }
// }

//1. find the 2 points that have the closest points clustered around them

let startArray = [];
let subArray = [];
let haversineDistance= [];
let finalHaversineArr = [];
let sum = 0;
let sumOfSection = 0;

function findFarthestPoint(array) {

  for (let i=0; i < array.length; i++) {
     let start = {
       latitude: array[i].latitude,
       longitude: array[i].longitude
     }

    startArray.push(start)
    console.log('startArray :', startArray)
  }

    for (let j=0; j < startArray.length; j++) {
      //const subArray = startArray.slice(1, (startArray.length + 1));
      subArray = startArray.slice(0,(startArray.length + 1))
      //console.log('subArray', subArray)
      sumOfSection = sum / startArray.length;
      finalHaversineArr.push(sumOfSection);
      sum = 0;
      sumOfSection = 0;
        for (let k=0; k < subArray.length ; k++) {

          haversineDistance = haversine(startArray[j], subArray[k], {unit: 'mile'})
          //console.log(haversineDistance)
          sum += haversineDistance
          
          //finalHaversineArr.push(haversineDistance)
        }
      
      //console.log('new point :', sum / startArray.length)
      
    }
    
    sumOfSection = sum / startArray.length;
    //console.log('sumofsection', sumOfSection)
    finalHaversineArr.push(sumOfSection);
    const newFinalHaversineArr = finalHaversineArr.splice(1,(startArray.length + 1))
    //console.log('newFinalHaversineArr :', newFinalHaversineArr)
    
    const sortedArr = newFinalHaversineArr.sort(function(a, b){return a - b}) ///this returns the array sorted numerically in ascending order 
    const primaryMean = newFinalHaversineArr[0]
    const secondaryMean = newFinalHaversineArr[1]
    console.log('primary :', primaryMean)
    console.log('secondary :', secondaryMean) //we can use a loop to iterate based on # of drivers available

 } //need to addd an index to the original arrray which gets passed in, then referneced when doing the math. this way, the final array can reference which points the math was for 
 
//3. based on the number of means, group the remainder of the points around those. (need a way to link these means back to the original lat & lon )


//create a way to plot these addresses on a map in the browser , showing the regions per driver


//then, find a way to generate random addresses on a map upon refresh or something

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'))
  });