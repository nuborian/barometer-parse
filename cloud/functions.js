


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
const Voucher = Parse.Object.extend("Voucher");
const VoucherHistory = Parse.Object.extend("VoucherHistory");
const Tag = Parse.Object.extend("Tag");


Parse.Cloud.define('checkFavorite', async (request) => {
  console.log("SERVER ::::: checkFavorite")

  var params = request.params;


  try{
    if( params.userObjectId == null || params.locationObjectId == null){
      return {
        isFavorite : false,
        msg : "userObjectId or locationObjectId is missing"
      }
    }else{
      var userPointer = {
        __type: 'Pointer',
        className: '_User',
        objectId: params.userObjectId
      }
      var locationPointer = {
        __type: 'Pointer',
        className: 'Location',
        objectId: params.locationObjectId
      }

      var usr = new User({
        objectId : params.userObjectId
      });
      var relation = usr.relation("favorites");

      var q_favorites = relation.query();
      q_favorites.equalTo("objectId", params.locationObjectId);

      //q_favorites.fir
      const _result = await q_favorites.first(null, {useMasterKey:true});
      console.log("Results", _result);
      if(_result == null){
        return {
          isFavorite : false,
        }
      }else{
        return {
          isFavorite : true,
        }
      }
    }

  }catch(error){
    console.error(error);
  }


});



/**

**/
Parse.Cloud.define('addFavorite', async (request) => {
  var params = request.params;

  if( params.locationObjectId == null  || params.userObjectId == null){
    return {
      success : false,
      msg : "locationObjectId or userObjectId is missing"
    }
  }

  var usr = new User({
    objectId : params.userObjectId
  });
  var _location = new Location({
    objectId : params.locationObjectId
  });

  var relation = usr.relation("favorites");
  relation.add(_location);
  usr.save(null, {useMasterKey:true});
});

/**
Add Favorite
**/
Parse.Cloud.define('removeFavorite', async (request) => {
  var params = request.params;

  if( params.locationObjectId == null  || params.userObjectId == null){
    return {
      success : false,
      msg : "locationObjectId or userObjectId is missing"
    }
  }

  var usr = new User({
    objectId : params.userObjectId
  });
  var _location = new Location({
    objectId : params.locationObjectId
  });

  var relation = usr.relation("favorites");
  relation.remove(_location);
  usr.save(null, {useMasterKey:true});
});







//
// Vouchers
//
Parse.Cloud.define('checkCompanyPin', async (request) => {

  var params = request.params;

  // Check Params
  if( params.pin == null || params.locationObjectId == null){
    return {
      success : false,
      msg : "code or locationObjectId is missing"
    }
  }


  // Location
  var q_location = new Parse.Query(Location);
  q_location.equalTo('objectId', params.locationObjectId);
  q_location.select("pin");
  q_location.first().then(function(response){
    var result = response.toJSON();

    // Verify Code
    if( results.pin === params.pin ){
      return true;
    }else{
      return false;
    }
  });


});



Parse.Cloud.define("getVoucherForCompany", async (request) => {
  var params = request.params;


  // Create a new instance of that class.
  var _company = new Company();
  _company.id = params.companyObjectId

  var q_voucher = new Parse.Query(Voucher);
  q_voucher.equalTo('company', _company);
  const results = await q_voucher.find()

  return results;
});

















//
// Redeem Voucher
// voucher objectId 8QoyKFjtBc
// User ObjectId
//
Parse.Cloud.define('redeemVoucher', async (request) => {
  var params = request.params;

  // Check Params
  if( params.voucherObjectId == null || params.userObjectId == null){
    return {
      success : false,
      msg : "voucherObjectId or userObjectId is missing"
    }
  }


  // fetch User
  var q_user = new Parse.Query(User);
  q_user.equalTo("objectId", params.userObjectId);
  q_user.select("points");
  const _usr = await q_user.first(null, {useMasterKey:true});

  var q_voucher = new Parse.Query(Voucher);
  q_voucher.equalTo("objectId", params.voucherObjectId);
  const _voucher = await q_voucher.first(null, {useMasterKey:true});

  var usrPoints     =  _usr.get("points");
  var voucherCosts  =  _voucher.get("cost");

  // Check Voucher
  if( voucherCosts <= usrPoints ){
    console.log("Voucher lässt sich einlösen");


    // Distract Costs from user Points
    // Create VoucherHistory ObjectId



    return {
      success : true,
    }
  }else{
    return {
      success : false,
      msg : "voucherObjectId or userObjectId is missing"
    }
  }
});









//
//
// Search
//
//
Parse.Cloud.define('fetchLocations', async (request) => {

  var params = request.params;


  if(params.searchparams){

  }





//  console.log(_results);


  /*let query = new Parse.Query('Locations');
  query.find().then(function(results) {
     var result = results[0];
     result.relation('tags').query().each(function(tags) {
        console.log(tags);
     });
  });*/




  //var tags = ["FVqUQeiuWI", "J3QanKBQCA"];
  //for( var i = 0; i<tags.length; i++){
    //var _qtag = new Tag({
    //  objectId : tags[i]
  //  });


    //q_locations.equalTo("tags", _qtag);
    //var fewWins = new Parse.Query("Location");
    //fewWins.lessThan("wins", 5);

  //}


//  q_locations.containsAll("tags", ["FVqUQeiuWI", "J3QanKBQCA"]);

  var q_locations = new Parse.Query(Location);
  var _results = await q_locations.find();



//
  //console.log(_results[0])
  //var res = await _results[0].relation("tags").query().each(function(tags) {
  //   console.log(tags);
  //});
  //console.log(res);

  return _results;



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
