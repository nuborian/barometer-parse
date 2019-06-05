var _ = require('underscore');




const Gig = Parse.Object.extend("Gig");
const GigType = Parse.Object.extend("GigType");







async function CREATE_GIG(data){

  var _gig = new Gig({
    gigType : {
      __type: "Pointer",
      className: "GigType",
      objectId: data.gigTypeObjectId
    },
    date_start : data.date_start,
    //date_end : data.date_end,
    location : {
      __type: "Pointer",
      className: "Location",
      objectId: data.locationObjectId
    },
    band : {
      __type: "Pointer",
      className: "Band",
      objectId: data.bandObjectId
    },
    event : {
      __type: "Pointer",
      className: "Event",
      objectId: data.eventObjectId
    }
  });
  await _gig.save(null, {useMasterKey:true});
  ///console.log(_gig.save);
  return _gig;
}




module.exports.CREATE_GIG = CREATE_GIG;
