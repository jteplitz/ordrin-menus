(function(){
  "use strict";

  var ordrin = require("ordrin-api");
  var html   = require("./html.js");

  var main   = function(options){
    this.ordrin = ordrin.init(options);

    this.getMenuHtml = new html(this.ordrin);
  }

  module.exports = main;
})();
