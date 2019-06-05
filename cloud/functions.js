


var _request = require('request');
var _ = require('underscore');
var moment = require('moment');

var async = require("async");

// API
var eventLib  = require("./api/EventLib");
var gigLib    = require("./api/GigLib");
var dataGenerator = require("./api/DataGenerator");



Parse.Cloud.define("generateDummyData", dataGenerator.startGenerator)


// Oldenburg
var P = {
  latitude: 53.17118,
  longitude: 8.18467
}
var R = 5000 // meters
var google_api_key = "AIzaSyA2YVdSP3b0a9vd9peuFV5ZbECZjwbY0qs";


// Classes
var Market = Parse.Object.extend("Market");

/*
curl -X POST \
-H "X-Parse-Application-Id: konzertbegleitung" \
-H "X-Parse-REST-API-Key: restkey" \
-H "Content-Type: application/json" \
-d '{}' \
https://konzertbegleitung.herokuapp.com/parse/functions/hello-test
*/


Parse.Cloud.define('hello-test', async (request) => {
  var p = new Genre();
  await p.save(null, {useMasterKey:true});

  return "Yolo Hello Test"
});





Parse.Cloud.define("getLocationsForMap", async (request) => {

  // Get Gigs inside the specified timeframe (1 Week)
  // Get locations for this Gigs
  // if more than  1 location match each other, combine them
  //
  //
  //


  ////const query = new Parse.Query(Event);
  //query.include("location");
  //query.i
  //query.equalTo("playerName", "Dan Stemkoski");

  //TODO
  // Query an Zeit anpassen - Default eine Woche ausgehend von heute
  //



  // Query inside a Rectangle
  /*var southwestOfSF = new Parse.GeoPoint(53.124165, 8.170567);
  var northeastOfSF = new Parse.GeoPoint(53.163961, 8.249359);
  var query = new Parse.Query(Location);
  query.withinGeoBox("geo", southwestOfSF, northeastOfSF);
  const pizzaPlacesInSF = await query.find();*/


  // User's location
  const gPoint = new Parse.GeoPoint(53.124165, 8.170567);
  // Create a query for places
  const query = new Parse.Query(Location);
  // Interested in locations near user.
  query.near("geo", gPoint);
  // Limit what could be a lot of points.
  //query.limit(10);
  // Final list of objects
  const placesObjects = await query.find();


  return placesObjects;



  /*  const results = await query.find().then((_results) => {

  // Preconsctruct Object to return
  var resultsFiltered = {
  "eventlocations" : [
  {
  timespan_start : new Date(),
  timespan_end : new Date(),
  location : {
  geo : {
  lat : "4344",
  lon : "4324234"
}
},
events : [
{
"__type": "Pointer",
"className": "Event",
"objectId": "XXXXXXX"
},
{
"__type": "Pointer",
"className": "Event",
"objectId": "XXXXXXX"
},
{
"__type": "Pointer",
"className": "Event",
"objectId": "XXXXXXX"
}
]
} // Location end




]
};

_.each(_results, function(d){
var json = d.toJSON();
console.log( "Object Id: " + json.location.objectId + " ::: " +  json.location.title );

// Create new Array for this Location
if( resultsFiltered[json.location.objectId] == null){
//resultsFiltered[json.location.objectId] = [];
}

//resultsFiltered[json.location.objectId].push(json);
});

//console.log("Results: ", resultsFiltered);

//console.log("Found Events: " + _results.length);
return(resultsFiltered);
});*/



});




























var marketMap = {
  "team_search_trainer" : {
    keys : [
      {
        key : "date_start",
        modifer : "date"
      },
      {
        key : "gender",
        modifer : null
      },
      {
        key : "city",
        modifer : "location"
      },
      {
        key : "leagues",
        modifer : "leagues"
      }
    ]
  }
};

Parse.Cloud.beforeSave("Market", (request) => {
  //console.log("---- BEFORE SAVE ----");
  //console.log("Foo: " + request.object.get('title'));
  console.log("EXIST: " + request.object.isNew() )
  if( request.object.isNew() ){
    return Parse.Cloud.httpRequest({
      method: "GET",
      url: "https://maps.googleapis.com/maps/api/geocode/json?address=Oldenburg,26131&key=" + google_api_key
    }).then((contents) => {
      var loc = contents.data.results[0].geometry.location;

      // GEO
      var p = new Parse.GeoPoint({latitude: loc.lat, longitude: loc.lng});
      request.object.set('location', p);

      // Fetch Leagues Relations for this
      //var leagueQuery = new Parse.Query(Market);
      //leagueQuery.equalTo("playerName", "Dan Stemkoski");

      // Construct Preview description
      request.object.set('description_preview', constructPreviewString(request.object, "team_search_trainer"));
    })
    .catch(function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    });
  }else{

  }
});



// Search Test
const SearchTest = Parse.Object.extend("SearchTest");

Parse.Cloud.define("executeSearch", async (request) => {

  var _term = request.params.term.toLowerCase();

  /*var query = new Parse.Query(Event);
  query.include("location");
  query.fullText("searchName", _term );
  var results = await query.find({useMasterKey:true});

  var res = [];
  for( var i=0; i<results.length; i++){
  var json = results[i].toJSON();
  console.log( results[i].toJSON() );
  console.log(":::::::::");

  // Date Parsing
  var dateday = json.date_start


  res.push( {
  eventName : "EventName",
  city : json.location.city,
  bandName : "BandName",
  start_date : "24.05.2019 : 19:00"
  //title : results[i].toJSON().searchName
});
}



return res;*/



/*
# Finds strings that contains "Daddy"
curl -X GET \
-H "X-Parse-Application-Id: konzertbegleitung" \
-H "X-Parse-REST-API-Key: restkey" \
-G \
--data-urlencode 'where={"searchName":{"$text":{"$search":{"$term":"lin"}}}}' \
http://localhost:1337/parse/classes/Event
*/

/*
curl -X GET \
-H "X-Parse-Application-Id: konzertbegleitung" \
-H "X-Parse-REST-API-Key: restkey" \
-G \
--data-urlencode 'where={"searchName":{"$text":{"$search":"lin"}}}' \
http://localhost:1337/parse/classes/Event
*/




/*Parse.Cloud.httpRequest({
url: 'http://localhost:1337/parse/classes/Event',
headers: {
'Content-Type': 'application/json;charset=utf-8',
"X-Parse-REST-API-Key" : "restkey",
"X-Parse-Application-Id" : "konzertbegleitung"
},
params: 'where={"searchName":{"$text":{"$search":{"$term":"'+_term+'"}}}}'
}).then(function(httpResponse) {
// success
//console.log(httpResponse.text);
//var results = JSON.parse(httpResponse.data);
console.log(httpResponse.data.results.length );

return httpResponse.data.results;

},function(httpResponse) {
// error
console.error('Request failed with response code ' + httpResponse.status);
});*/

var q = {
  "searchName": {
    "$text": {
      "$search": {
        "$term": _term
      }
    }
  }
}

/*
var q = {
  "searchName": {
    "$text": {
      "$search": _term
    }
  }
}*/

//var q = { $text: "{oldenburg}" } }



var q = JSON.stringify(q);
console.log(q);
console.log("::::::");


var contents = await Parse.Cloud.httpRequest({
  //url: 'http://localhost:1337/parse/classes/Event',
  url: 'https://konzertbegleitung.herokuapp.com/parse/classes/Event',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    "X-Parse-REST-API-Key" : "restkey",
    "X-Parse-Application-Id" : "konzertbegleitung"
  },
  params: {
    "include" : "location",
    "order" : "$score",
    "key" : "$score",
    "where" : q
  }
});


var res = [];
for( var i = 0; i<contents.data.results.length; i++){

  var json = contents.data.results[i];

  console.log("..----..");
  console.log(json);
  console.log("..----..");
  var m = moment(json.date_start.iso );
  //console.log(m.format("DD.MM.YYYY"));

  res.push({
    eventName : "EventName",
    city : json.location.city,
    bandName : "BandName",
  //  bandObjectId : json.band.objectId,


    datemonth : m.format("MMM"),
    dateday : m.format('D')


    //start_date : "24.05.2019 : 19:00"
  });

}


return res;



});







// Search Test

Parse.Cloud.define("testSearch", async (request) => {

  /*var _term = request.params.term;
  var query = new Parse.Query(SearchTest);
  query.equalTo("searchArray", _term);
  for( var i = 0; i<_term.length; i++){

    _term = _term.substring(0, _term.length - 1);
    console.log( _term );
  }


  var _results = await query.find({useMasterKey:true});
  console.log(_results);*/

  //var q = { $text: "{oldenburg}" } }
  var q = {
    "searchName": {
      "$text": {
        "$search": {
          "$text": "{oldenburg}"
        }
      }
    }
  };

  var q = JSON.stringify(q);
  console.log(q);
  console.log("::::::");


  var contents = await Parse.Cloud.httpRequest({
    //url: 'http://localhost:1337/parse/classes/Event',
    url: 'https://konzertbegleitung.herokuapp.com/parse/classes/Event',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      "X-Parse-REST-API-Key" : "restkey",
      "X-Parse-Application-Id" : "konzertbegleitung"
    },
    params: {
      "include" : "location",
      //"order" : "date_start",
      //"select" : "$score",
      "where" : q
    }
  });


  return contents;

});

/*
██████   █████  ████████  █████       ██████  ███████ ███    ██ ███████ ██████   █████  ████████ ██  ██████  ███    ██
██   ██ ██   ██    ██    ██   ██     ██       ██      ████   ██ ██      ██   ██ ██   ██    ██    ██ ██    ██ ████   ██
██   ██ ███████    ██    ███████     ██   ███ █████   ██ ██  ██ █████   ██████  ███████    ██    ██ ██    ██ ██ ██  ██
██   ██ ██   ██    ██    ██   ██     ██    ██ ██      ██  ██ ██ ██      ██   ██ ██   ██    ██    ██ ██    ██ ██  ██ ██
██████  ██   ██    ██    ██   ██      ██████  ███████ ██   ████ ███████ ██   ██ ██   ██    ██    ██  ██████  ██   ████
*/

var genres_dummy = [
  "Afrikanische Musik",
  "Alternative",
  "Ambient",
  "Asiatische Musik",
  "Metal",
  "Rock",
  "Indie",
  "Hip Hop",
  "Rap",
  "Pop",
  "Klassik",
  "EDM",
  "Schlager",
  "Party Schlager",
  "Chanson",
  "Charts",	"Rock",
  "Indie",
  "Hip Hop",
  "Rap",
  "Pop",
  "Klassik",
  "EDM",
  "Schlager",
  "Party Schlager",
  "Chanson",
  "Charts",
  "Chillout",
  "Christliche Musik",
  "Classic Rock",
  "Country"
];




var dummy_citys = [
  {
    title : "Oldenburg",
    latitude: 53.17118,
    longitude: 8.18467
  },
  {
    title : "Hamburg",
    latitude: 53.551086,
    longitude: 9.993682
  },
  {
    title : "Bremen",
    latitude: 53.079296,
    longitude: 8.801694
  },
  {
    title : "Berlin",
    latitude: 52.520008,
    longitude: 13.404954
  },{
    title : "München",
    latitude: 48.135124,
    longitude: 11.581981
  },{
    title : "Köln",
    latitude: 50.937531,
    longitude: 6.960279
  }
];

var eventTypes_dummys = [
  "single",
  "festival",
  "tour"
];





// Classes
const Band = Parse.Object.extend("Band");
const Genre = Parse.Object.extend("Genre");
const EventType = Parse.Object.extend("EventType");
const Event = Parse.Object.extend("Event");
const Gig = Parse.Object.extend("Gig");
const GigType = Parse.Object.extend("GigType");
const Location = Parse.Object.extend("Location");




Parse.Cloud.define("generate_eventtypes", async (request) => {

  for( var i = 0; i<eventTypes_dummys.length; i++){

    var _eventType = new EventType({
      key : eventTypes_dummys[i]
    });

    await _eventType.save(null, {useMasterKey:true})
  }
  return "yolo";
});






Parse.Cloud.define("generate_genres", async (request) => {
  for( var i = 0; i<genres_dummy.length; i++){
    var g = genres_dummy[i];
    var _genre = new Genre({
      key : g,
      searchKey : g.toLowerCase()
    });
    await _genre.save(null, {useMasterKey:true});
  };
  return "Finish";


});






Parse.Cloud.define("generate_bands", async (request) => {
  //
  // Fetch Genres
  //
  var q_genres = new Parse.Query(Genre);
  const results_genres = await q_genres.find({useMasterKey:true});
  console.log("Fetched Genres: " + results_genres.length);

  //
  // Generate Bands
  // add 3 random Genres as Relation
  //
  //_.each( bands, function(b, i) {
  for( var j = 0; j<bands.length; j++){

    // Band
    var _band = new Band({
      title : bands[j]
    });

    // Relation
    var relation = _band.relation("genres");
    for( var i = 0; i < 3; i++){
      relation.add( results_genres[Math.floor(Math.random()*results_genres.length)] );
    }

    // save Band
    _band.save(null, {useMasterKey:true});
  };

});





//
//
//
//  Generate 5 random Location in each City
//
//

/*
Parse.Cloud.define("generate_locations", async (request) => {

// Each City
_.each( dummy_citys, function(l, i){

for( var i = 0; i < 5; i++){
var spot = randomLocation.randomCirclePoint({
latitude : l.latitude,
longitude : l.longitude
}, R);
var point = new Parse.GeoPoint({latitude: spot.latitude, longitude: spot.longitude});

// New Location
var _location = new Location({
geo : point,
title : "Veranstaltungsort " + l.title,
city : l.title
});

_location.save();
}
});


});*/

Parse.Cloud.define("generate_locations", async (request) => {

  // Each City
  for( var i = 0; i<dummy_citys.length; i++){
    var l = dummy_citys[i];

    for( var j = 0; j < 5; j++){
      var spot = randomLocation.randomCirclePoint({
        latitude : l.latitude,
        longitude : l.longitude
      }, R);
      var point = new Parse.GeoPoint({latitude: spot.latitude, longitude: spot.longitude});

      // New Location
      var _location = new Location({
        geo : point,
        title : "Veranstaltungsort " + l.title,
        city : l.title
      });

      await _location.save(null, {useMasterKey:true});
    }
  };

  return "yolO";

});













// Generate a Tour Event with a unlimitted Count of Gigs
Parse.Cloud.define("generate_event_tour", async (request) => {
  var params = request.params;

  for( var i = 0; i < params.tour_events.length; i++ ){
    await generateTour( params.tour_events[i] );
  }

  return "Created " + params.tour_events.length + " Tours";
});




async function generateTour(params){
  var gigParams = params.gigs;
  delete params["gigs"];

  // Create Event & save it
  var _event = await eventLib.CREATE_EVENT(params);

  // Relations
  var _gigs   = _event.relation("gigs");
  var _bands  = _event.relation("bands");


  // Create Gigs & save them
  for( var i = 0; i < gigParams.length; i++){
    //console.log("Band ID: " + gigParams[i].bandObjectId);

    // Create Band Reference and add it to relations
    var _band =  new Band({objectId : gigParams[i].bandObjectId});
    //console.log("Band Id:", gigParams[i] );
    //var q_band = new Parse.Query(Band);
    //  var _band = await q_band.get(gigParams[i].bandObjectId)
    _bands.add(_band);

    // manipulate gigParams
    gigParams[i].eventObjectId = _event.id;

    // Create Gig and add it to relations
    var _gig = await gigLib.CREATE_GIG( gigParams[i] );
    _gigs.add(_gig);
  };

  console.log("RelatioN: ", _event.relation("bands"))

  // Update Event with Relations
  await _event.save(null, {useMasterKey:true});

  return _event;
}
































const filterItems = (arr, query) => {
  return arr.filter(el => el.get('city') == query);
};














// Event objectId
// Timing Fenster

Parse.Cloud.define("fetchGigsForEvent", async (request) => {

  if(request.params.eventObjectId == null){
    throw "Missing eventObjectId in params";
  }

  // Fetch Event
  var q_events = new Parse.Query(Event);
  q_events.include("location");
  var _evt = await q_events.get(request.params.eventObjectId);

  // Fetch Gigs for this Event
  var q_gigs = _evt.relation("gigs").query();
  q_gigs.include("band,location");
  var gigsForEvent = await q_gigs.find();
  return gigsForEvent;
});


//
// Fetch all Gigs for several Events
//

Parse.Cloud.define("fetchClusteredGigs", async (request) => {

  var params = request.params;
  if(params.eventIds == null){
    throw "missing eventIds Array"
  }

  // Fetch Event
  var q_event = new Parse.Query(Event);



  //for( var i = 0; i < params.eventIds.length; i++){
  //  q_event.include("location");
  //  var _evt = await q_events.get(request.params.eventObjectId);
  //}
});












Parse.Cloud.define("fetchClusterdEvents", async (request) => {
  console.log(":::::::");
  console.log("::::::: Call Cloud Functions :::::: fetchClusterdEvents");
  console.log(":::::::");

  /*var dStart, dEnd;
  dStart = new moment("2019-05-05");
  dEnd = dStart.clone().add(1, "w");



  var q_events = new Parse.Query(Event);
  q_events.include("location");
  q_events.greaterThan( "date_start", dStart.toDate() );
  q_events.lessThan( "date_end", dEnd.toDate() );
  var r_events = await q_events.find();

  //console.log("Timespace: " + dStart.format('DD.MM.YYYY') + " - " + dEnd.format('DD.MM.YYYY'))
  console.log("Found Events in this Timespace: " + r_events.length)

  var returnResults = {};
  //_.each( r_events, function( _evt ){
  for( var i = 0; i<r_events.length; i++){
  var _evt = r_events[i];
  console.log( _evt.get('date_start') + " :::: " + _evt.get('title'));


  var q_bands = _evt.relation('bands').query();
  let r_bands = await q_bands.find();
  console.log("Results Band: " + r_bands.length)


  if( returnResults[_evt.get('location').id] == null ){

  // Create an Array to store mutiple events on this location in the given Timeframe
  returnResults[_evt.get('location').id] = {
  location : _evt.get('location'),
  events : []
};

}else{
//
}

// Push Event
returnResults[_evt.get('location').id].events.push( _evt );
};*/

var q_events = new Parse.Query(Event);
q_events.include("location");
var r_events = await q_events.find({useMasterKey:true});

console.log(r_events);

return r_events;
});







































function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

randomDate(new Date(2012, 0, 1), new Date())



/**
* [constructPreviewString description]
* @return {[type]} [description]
*/
function constructPreviewString( data, type ){
  var s = "";

  // Parse to a JSON Object
  var data = JSON.parse(JSON.stringify(data));
  //console.log( data['leagues'].objects );

  _.each(marketMap[type].keys, function(d, i){

    if(d.modifer){

      if(d.modifer == "date"){
        s += "Ab: " + moment.unix(data[d.key]).format('DD.MM.YYYY');
      }
      if(d.modifer == "location"){
        s += data.get('plz') + ", " +  data[d.key];
      }
      if(d.modifer == "leagues"){
        s += "";

        // Fetch Relations
        GameScore = Parse.Object.extend("GameScore");
        const query = new Parse.Query(GameScore);
        query.equalTo("playerName", "Dan Stemkoski");



      }
    }else{
      s += data.get([d.key]);
    }
    if( i < marketMap[type].keys.length-1 ){
      s += "//";
    }
  });
  console.log("STRING: " + s);

  return s;
}





















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
