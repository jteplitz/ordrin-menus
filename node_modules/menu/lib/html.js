(function(){
  "use strict";
  var async      = require("async"),
      handlebars = require("handlebars"),
      fs         = require("fs");

  var api, main, menuTemplate;

  var menuHtml = function(rid, cb){
    // data object to be passed through async functions. I feel like there's a better way to do this.
    var data = {};
    async.series([
      function(cb){ getMenu(rid, data, cb); },
      function(cb){ generateHtml(data, cb); }
    ], function(err, data){
      cb(err, data[1]);
    });

  }

  // turn JSON into html
  function generateHtml(data, cb){
    // send the data to the template
    console.log(data)
    var html = menuTemplate({menu: JSON.stringify(data.menu)});
    cb(false, html);
  }

  // get menu JSON from ordr.in
  function getMenu(rid, data, cb){
    api.restaurant.getDetails(rid, function(err, details){
      if (err){
        console.log(err)
        return cb(err);
      }

      data.menu = details.menu;
      console.log(data.menu[1].children[0].children[0]);
      cb(false);
    });
  }

  // set the api and then return the menuHtml creation function for later
  main = function(ordrinApi){
    api = ordrinApi;
    // get the template from the file.
    // do it here so we can access it later without recompiling.
    fs.readFile(__dirname + "/../templates/menu.hbs", function(err, data){
      if (err){
        console.log("error reading file");
        throw(new Error()); // this is the wrong way to do this.
      }

      menuTemplate = handlebars.compile(String(data));
    });
    return menuHtml;
  }


  module.exports = main;
})();
