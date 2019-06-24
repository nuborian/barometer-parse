


var _request = require('request');
var _ = require('underscore');
var moment = require('moment');
var async = require("async");

// API
//var eventLib  = require("./api/EventLib");




// API
//var eventLib  = require("./api/EventLib");
//var gigLib    = require("./api/GigLib");
//var dataGenerator = require("./api/DataGenerator");



const User = Parse.Object.extend("_User");
const Company = Parse.Object.extend("Company");
const Favorite = Parse.Object.extend("Favorite");
const Location = Parse.Object.extend("Location");

Parse.Cloud.define('checkFavorite', async (request) => {

  if( request.params.userObjectId == null || request.params.locationObjectId == null){
      return {
        isFavorite : false,
        msg : "userObjectId or locationObjectId is missing"
      }
  }else{
    var userPointer = {
      __type: 'Pointer',
      className: '_User',
      objectId: request.params.userObjectId
    }
    var locationPointer = {
      __type: 'Pointer',
      className: 'Location',
      objectId: request.params.locationObjectId
    }

    const query = new Parse.Query(Favorite);
    query.equalTo("user", userPointer);
    query.equalTo("location", locationPointer);
    const results = await query.find(null, {useMasterKey:true});
    //console.log(results[0].toJSON().objectId );
    if(results[0] == null){
      return {
        isFavorite : false,
        //msg : "userObjectId or locationObjectId is missing"
      }
    }else{
      return {
        isFavorite : true,
        //msg : "userObjectId or locationObjectId is missing"
      }
    }
  }




});














function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
  Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
  Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}




//
