var _ = require('underscore');


const Band = Parse.Object.extend("Band");
const Genre = Parse.Object.extend("Genre");
const EventType = Parse.Object.extend("EventType");
const Event = Parse.Object.extend("Event");
const Location = Parse.Object.extend("Location");







/**
* Creates a new Event with the passed parameters
*
* @async
* @function CREATE_EVENT
* @param {Object} request - The employee who is responsible for the project.
* @param {string} request.name - The name of the employee.
* @param {string} request.department - The employee's department.
* @return {Object} The data from the URL.
*/
async function CREATE_EVENT(params){
  console.log(":::::::");
  console.log("::::::: Call Cloud Functions :::::: CREATE_EVENT");
  console.log(":::::::");


  if( params.title == null){
    throw "title is missing";
  }
  if( params.date_start == null){
    throw "date_start is missing";
  }
  if( params.type == null){
    throw "type is missing";
  }

  // Fetch EventType
  //var query = new Parse.Query(EventType);
  //console.log(params.eventTypeObjectId);
  //var _type = await query.get({useMasterKey:true}, params.eventTypeObjectId);

  //console.log("TYPE: " + _type.get('key'));


  /*
  switch( _type.get('key') ){
    case "tour":




    break;

    case "festival":
    break;

    case "default":
    break;

  }*/

  // Create Event
  var _event = new Event({
    title : params.title,
    "date_start" : new Date(params.date_start.toISOString() ),
    //"date_end" : new Date(params.date_end.iso),
    type : {
      __type : "Pointer",
      className : "EventType",
      objectId : params.eventTypeObjectId
    },
    location : {
      __type : "Pointer",
      className : "Location",
      objectId : params.locationObjectId
    }
  });

  await _event.save(null, {useMasterKey:true});
  return _event;
}


/*
      // Create Headliner
      var _headliner = CREATE_GIG({
        gigType : "headliner",
        date_start : new Date(request.params.date_start.iso),
        date_end : new Date(request.params.date_end.iso),
        locationObjectId : params.location.objectId,
        bandObjectId : params.band.objectId,
        eventObjectId : _event.id,
      });

      // Create Support
      var _support = CREATE_GIG({
        gigType : "support",
        date_start : new Date(request.params.date_start.iso),
        date_end : new Date(request.params.date_end.iso),
        locationObjectId : params.location.objectId,
        bandObjectId : params.band.objectId,
        eventObjectId : _event.id,
      });
      */









module.exports.CREATE_EVENT = CREATE_EVENT;

//
