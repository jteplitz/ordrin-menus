(function(){
  "use strict";
  var api, main;

  var menuHtml = function(rid, cb){
    api.restaurant.getDetails(rid, function(err, data){
      if (err){
        return cb(err);
      }

      console.log("got details for", rid, data);
      cb(false, data);
    });
  }

  main = function(ordrinApi){
    console.log("making object");
  //  api = ordrinApi;
    console.log("made");
    console.log("returning", menuHtml);
    return menuHtml;
  }


  module.exports = main;
})();
