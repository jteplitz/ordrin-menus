var ordrin = ordrin instanceof Object ? ordrin : {};

(function(){
  "use strict";

  var elements = {}; // variable to store elements so we don't have to continually DOM them

  var Option = function(id, name){
    this.id = id
    this.name = name
  }

  // ordrin api classes
  var TrayItem = function(itemId, quantity, options, itemName){
    this.itemId   = itemId;
    this.itemName = itemName;
    this.quantity = quantity;
    this.options  = options;

    this.buildItemString = function(){
      var string = this.itemId + "/" + this.quantity;

      for (var i = 0; i< this.options.length; i++){
        string += "," + this.options[i].id;
      }
      return string;
    }
  }

  var Tray = function(items){
    this.items = items;

    this.addItem = function(item){
      if (!(item instanceof TrayItem)){
        throw new Error("Item must be an object of the Tray Item class");
      } else {
        this.items.push(item);
      }
    }

    this.buildTrayString = function(){
      var string = "";
      for (var i = 0; i < this.items.length; i++){
        string += "+" + this.items[i].buildItemString();
      }
      return string.substring(1); // remove that first plus
    };
  };

  ordrin.tray = new Tray([])
  
  function listen(evnt, elem, func) {
    if (elem.addEventListener)  // W3C DOM
      elem.addEventListener(evnt,func,false);
    else if (elem.attachEvent) { // IE DOM
      var r = elem.attachEvent("on"+evnt, func);
      return r;
    }
  }

  function goUntilParent(node, targetClass){
    console.log(node);
    var re = new RegExp("\\b"+targetClass+"\\b")
    if (node.className.match(re) === null){
      while(node.parentNode !== document){
        node = node.parentNode;
        if (node.className.match(re) === null){
          continue;
        }else{
          break;
        }
      }
      return node;
    } else {
      return node;
    }
  }

  listen("DOMContentLoaded", window, function(){
    getElements();
    listen("click", document, clicked);
  });

  function clicked(event){
    if (typeof event.srcElement == "undefined"){
      event.srcElement = event.target;
    }
    // call the appropiate function based on what element was actually clicked
    var routes = {  
      menuItem    : createDialogBox,
      closeDialog : hideDialogBox,
      addToTray: addTrayItem
    }

    var name = event.srcElement.getAttribute("data-listener");

    if (typeof routes[name] != "undefined"){
      routes[name](event.srcElement);
    }
  }

  function createDialogBox(node){
    // get the correct node, if it's not the current one
    node = goUntilParent(node, "mi");

    console.log(node.getElementsByClassName("name"));
    // put the name and description in the option box
    var title   = node.getElementsByClassName("name")[0].innerHTML;
    var price   = node.getElementsByClassName("price")[0].innerHTML;
    var descrip = node.getElementsByClassName("menuItemDescription")[0].innerHTML;
    var id      = node.getAttribute("data-miid");
    var category = goUntilParent(node, "menuCategory").getElementsByClassName("itemListName")[0].innerHTML;
    elements.dialog.getElementsByClassName("dialogDescription")[0].innerHTML = descrip;
    elements.dialog.getElementsByClassName("itemTitle")[0].innerHTML = title;
    elements.dialog.getElementsByClassName("itemPrice")[0].innerHTML = price;
    elements.dialog.setAttribute("data-miid", id);
    elements.dialog.setAttribute("data-title", title);
    elements.dialog.setAttribute("data-category", category);

    // clone the options
    node = node.getElementsByClassName("optionCategoryList")[0].cloneNode(true);
    
    // unhide them
    node.className = node.className.replace("hidden", "");

    // put them in the dialog option container
    elements.dialog.getElementsByClassName("optionContainer")[0].appendChild(node);

    showDialogBox();
  }

  function showDialogBox(){
    // show background
    elements.dialogBg.className = elements.dialogBg.className.replace("hidden", "");

    // show the dialog
    elements.dialog.className = elements.dialog.className.replace("hidden", "");
  }

  // checks if dialog is closable, and closes it if so
  function closeOptionsDialog(){
    hideDialogBox();
  }

  function hideDialogBox(){
    if (elements.dialog.className.indexOf("hidden") == -1){
      // hide the background and dialog box
      elements.dialogBg.className   += " hidden";
      elements.dialog.className     += " hidden";
      // remove elements in option container
      var optionContainer = elements.dialog.getElementsByClassName("optionContainer")[0];
      optionContainer.removeChild(optionContainer.getElementsByClassName("optionCategoryList")[0]);
      var checkBoxes = elements.dialog.getElementsByClassName("optionCheckbox");
      for(var i=0; i<checkBoxes.length; i++){
        checkBoxes[i].checked = false;
      }

      // reset quantity
      elements.dialog.getElementsByClassName("itemQuantity")[0].value = 1;
    }
  }

  function addTrayItem(){
    var id = elements.dialog.getAttribute("data-miid");
    var quantity = elements.dialog.getElementsByClassName("itemQuantity")[0].value;
    var checkBoxes = elements.dialog.getElementsByClassName("optionCheckbox");
    var options = [];
    for(var i=0; i<checkBoxes.length; i++){
      if(checkBoxes[i].checked){
        var listItem = goUntilParent(checkBoxes[i], "option")
        var optionId = listItem.getAttribute("data-moid");
        var optionName = listItem.getElementsByClassName("optionName")[0].textContent
        var option = new Option(optionId, optionName)
        options.push(option);
      }
    }
    var itemName = elements.dialog.getElementsByClassName("itemTitle")[0].textContent
    var trayItem = new TrayItem(id, quantity, options, itemName);
    ordrin.tray.addItem(trayItem);
    hideDialogBox();
  }

  // UTILITY FUNCTIONS
  function getElements(){
    var menu          = document.getElementById("ordrinMenu");
    elements.dialog   = menu.getElementsByClassName("optionsDialog")[0];
    elements.dialogBg = menu.getElementsByClassName("dialogBg")[0];
  }
})();
