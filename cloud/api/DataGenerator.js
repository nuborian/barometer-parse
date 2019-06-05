var _ = require('underscore');


// Using CommonJS modules
var randomLocation = require('random-location')
var eventLib  = require("./EventLib");
var gigLib    = require("./GigLib");
var moment    = require("moment");
const momentRandom = require('moment-random');



const Band = Parse.Object.extend("Band");
const Genre = Parse.Object.extend("Genre");
const EventType = Parse.Object.extend("EventType");
const Event = Parse.Object.extend("Event");
const Location = Parse.Object.extend("Location");
const GigType = Parse.Object.extend("GigType");



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

var bands = [
  "Linkin Park",
  "Fettes Brot",
  "Die Toten Hosen",
  "Die Ärzte",
  "Foo Fighters",
  "Trailerparkt",
  "Sabaton",
  "Iron Maiden",
  "Cro",
  "K.I.Z.",
  "Slipknot"
];

var R = 5000 // meters
var dummy_citys = [
  {
    title : "Oldenburg",
    latitude: 53.17118,
    longitude: 8.18467,
    key : "oldenburg"
  },
  {
    title : "Hamburg",
    latitude: 53.551086,
    longitude: 9.993682,
    key : "hamburg"
  },
  {
    title : "Bremen",
    latitude: 53.079296,
    longitude: 8.801694,
    key : "bremen"
  },
  {
    title : "Berlin",
    latitude: 52.520008,
    longitude: 13.404954,
    key : "berlin"
  },{
    title : "München",
    latitude: 48.135124,
    longitude: 11.581981,
    key : "munich"
  },{
    title : "Köln",
    latitude: 50.937531,
    longitude: 6.960279,
    key : "cologne"
  }
];

var gigTypes = [
  {
    key : "support"
  },
  {
    key : "headliner"
  }
];

var eventTypes = [
  {
    key : "tour"
  },
  {
    key : "festival"
  },
  {
    key : "single"
  }
];






/**
* Generates Genres and write them to the database "Genre"
*
* @param {number} first The First Number
* @param {number} second The Second Number
* @returns {number}
*/
async function startGenerator(){

  // Generate Bands
  //await g_genres();
  console.log("GENERATOR :::::::: Genres generated success");


  //await g_bands();
  console.log("GENERATOR :::::::: Bands generated success");


  //await g_gigTypes();
  console.log("GENERATOR :::::::: GigTypes generated success");

  //await g_eventTypes();
  console.log("GENERATOR :::::::: EventTypes generated success");


  //await g_locations();
  console.log("GENERATOR :::::::: Locations generated success");


  await g_tour();

}


exports.startGenerator = startGenerator;


/**
* Generates Genres and write them to the database "Genre"
*
* @param {number} first The First Number
* @param {number} second The Second Number
* @returns {number}
*/
async function g_genres(params){
  for( var i = 0; i<genres_dummy.length; i++){
    var g = genres_dummy[i];
    var _genre = new Genre({
      key : g,
      searchKey : g.toLowerCase()
    });
    await _genre.save(null, {useMasterKey:true});
  };
  //return "Generated Genres";
}



/**
* Generates Genres and write them to the database "Genre"
*
* @param {number} first The First Number
* @param {number} second The Second Number
* @returns {number}
*/
async function g_bands(params){
  var q_genres = new Parse.Query(Genre);
  const results_genres = await q_genres.find({useMasterKey:true});

  for( var j = 0; j<bands.length; j++){
    // Band
    var _band = new Band({
      title : bands[j]
    });

    // Add 3 random Genres as Relation
    var relation = _band.relation("genres");
    for( var i = 0; i < 3; i++){
      relation.add( results_genres[Math.floor(Math.random()*results_genres.length)] );
    }

    // Save Band
    await _band.save(null, {useMasterKey:true});
  };
}



/**
* Generates GigTypes
*
* @param {number} first The First Number
* @param {number} second The Second Number
* @returns {number}
*/
async function g_gigTypes(params){
  for( var i = 0; i<gigTypes.length; i++){
    var _gigType = new GigType({
      "key" : gigTypes[i].key
    });

    await _gigType.save(null, {useMasterKey:true});
  }
}



/**
* Generates Genres and write them to the database "Genre"
*
* @param {number} first The First Number
* @param {number} second The Second Number
* @returns {number}
*/
async function g_eventTypes(params){

  for( var i = 0; i<eventTypes.length; i++){
    var _eventType = new EventType({
      "key" : eventTypes[i].key
    });

    await _eventType.save(null, {useMasterKey:true});
  }
}



/**
* Generates Location
*
* @param {number} first The First Number
* @param {number} second The Second Number
* @returns {number}
*/
async function g_locations(params){
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
        title : "Veranstaltungsort " + l.title + "  " + j,
        city : l.title,
        key : l.key
      });

      await _location.save(null, {useMasterKey:true});
    }
  };
}


var eventTypeObjectId = "1QBiNx6UKk"; //"k17fQ6FYHq"; // Must be updated
/**
* Generates an Event (Tour) for a specific band
*
* @param {number} first The First Number
* @param {number} second The Second Number
* @returns {number}
*/
async function g_tour(params){

  // Fetch GigType
  var q_gigTypes  = new Parse.Query(GigType);
  var _gigTypes    = await q_gigTypes.find({useMasterKey:true});

  // Fetch Locations
  var q_locations  = new Parse.Query(Location);
  var _locations    = await q_locations.find({useMasterKey:true});




  //
  // Fetch Bands to select each one
  //
  var q_bands = new Parse.Query(Band);
  var _bands = await q_bands.find({useMasterKey:true});

  // Create Headliner and 2 Supports for each one
  //for( var i = 0; i<_bands.length; i++){
  for( var i = 0; i<1; i++){
    var _bandHeadliner = _bands[i];

    var _supportActs = [];
    var _bandsclone = _bands.slice(0);
    _bandsclone = _.without(_bandsclone, _.findWhere(_bandsclone, {
      id: _bandHeadliner.id
    }));
    for( var j = 0; j<2; j++){
      _supportActs.push(
        _bandsclone[Math.floor(Math.random()*_bandsclone.length)]
      );
    }



    var d_start = generateRandomDate();
    //console.log( d_start.iso );
    //var _location = _locations[Math.floor(Math.random()*_locations.length)];

    //
    //TODO Pick 1 Location from each City and a random Count of Citys overall
    //
    // Loop that iterates for each city
    // Pick 1 Location from each city
    //
    //
    //
    var tourLocations = [];
    for( var c = 0; c<dummy_citys.length; c++){
      // Key
      var l = _locations.filter(x => x.get('key') === dummy_citys[c].key);
      var randomLocation = l[Math.floor(Math.random()*l.length)];
      tourLocations.push(randomLocation)
      //console.log(randomLocation.get('title'));
    }
    //console.log("............");


    console.log("Tour Locations created: " + tourLocations.length);

    // Create an Event for each City
    for( var k = 0; k < tourLocations.length; k++){

    //for( var k = 0; k < 2; k++){
      var _loc = tourLocations[k];
      console.log( _loc.get('title') );

      //
      // Create Event "Tour"
      //
      var _event = await eventLib.CREATE_EVENT({
        title : "Tour Name "  + _bandHeadliner.get('title'),
        type : "tour",
        date_start : d_start.add(1, "days"),
        locationObjectId : _loc.id,
        eventTypeObjectId : eventTypeObjectId
      });

      // Headliner
      var _headliner = await gigLib.CREATE_GIG({
        gigTypeObjectId : _gigTypes.find(x => x.get('key') === 'headliner').id,
        bandObjectId : _bandHeadliner.id,
        locationObjectId : _loc.id,
        eventObjectId : _event.id,
        date_start : {
          "__type" : "Date",
          "iso" : d_start.clone().hours(21).toISOString()

        }
      });

      // Create Relation for gigs of this event
      var _gigs = _event.relation("gigs");
      _gigs.add(_headliner)
      await _event.save(null, {useMasterKey:true});


      //
      // Construct searchName
      //

      var searchName = "";
      searchName += _loc.get('city') + " : ";        // location
      searchName += _event.get('title') + " : ";    // Title of the tour
      searchName += _bandHeadliner.get('title') + " : ";       // title of the band

      await _event.save({
        "searchName" : searchName.toLowerCase()
      }, {useMasterKey:true});


    }














    /*
    // Create Headliner Gig
    gigLib.CREATE_GIG({
      gigTypeObjectId : _gigTypes.find(x => x.get('key') === 'headliner').id,
      bandObjectId : _bandHeadliner.id,
      locationObjectId : _location.id,
      date_start : {
        "__type" : "Date",
        "iso" : d_start.clone().hours(21).toISOString()
      }
    });

    // Create Support Gig 1
    gigLib.CREATE_GIG({
      gigTypeObjectId : _gigTypes.find(x => x.get('key') === 'support').id,
      bandObjectId : _supportActs[0].id,
      locationObjectId : _location.id,
      date_start : {
        "__type" : "Date",
        "iso" : d_start.toISOString()
      }
    });

    // Create Support Gig 2
    gigLib.CREATE_GIG({
      gigTypeObjectId : _gigTypes.find(x => x.get('key') === 'support').id,
      bandObjectId : _supportActs[1].id,
      locationObjectId : _location.id,
      date_start : {
        "__type" : "Date",
        "iso" : d_start.clone().hours(20).toISOString()
      }
    });
    */
  }

}


/*
{
"__type": "Date",
"iso": "2019-05-06T23:00:00.780Z"
}
*/


// 19 - 20, support1
// 20 - 21, support2
// 21 - 23, headliner

var a = moment('01.06.2019', "DD.MM.YYYY");
var b = moment('28.08.2019', "DD.MM.YYYY");

function generateRandomDate(){

  return momentRandom(b, a).hours(19).minutes(0);//.format("DD.MM.YYYY -- HH:mm");

  //for( var i = 0; i<20; i++){
  //  console.log( momentRandom(b, a).hours(19).minutes(0).format("DD.MM.YYYY -- HH:mm") )
  //}
}




//
