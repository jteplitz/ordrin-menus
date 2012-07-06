var ordrin = ordrin instanceof Object ? ordrin : {};

(function(){
  "use strict";

  var elements = {}; // variable to store elements so we don't have to continually DOM them

  var Option = function(id, name, price){
    this.id = id;
    this.name = name;
    this.price = price;
  }

  var nextId = 0;
  
  // ordrin api classes
  var TrayItem = function(itemId, quantity, options, itemName, price, menuItem){
    this.trayItemId = nextId++;
    this.itemId   = itemId;
    this.itemName = itemName;
    this.quantity = quantity;
    this.options  = options;
    this.price = price;
    this.menuItem = menuItem;

    this.buildItemString = function(){
      var string = this.itemId + "/" + this.quantity;

      for (var i = 0; i< this.options.length; i++){
        string += "," + this.options[i].id;
      }
      return string;
    }

    this.renderTrayHtml = function(){
      var item = document.createElement("li");
      item.className = "trayItem";
      item.setAttribute("data-listener", "editTrayItem");
      item.setAttribute("data-miid", item.itemId);
      var itemRemove = document.createElement("div");
      itemRemove.className = "trayItemRemove";
      itemRemove.appendChild(document.createTextNode("X"))
      itemRemove.setAttribute("data-listener", "removeTrayItem");
      item.appendChild(itemRemove)
      var itemName = document.createElement("span");
      itemName.className = "trayItemName";
      itemName.appendChild(document.createTextNode(item.itemName));
      itemName.setAttribute("data-listener", "editTrayItem");
      item.appendChild(itemName);
      var itemPrice = document.createElement("span");
      itemPrice.className = "trayItemPrice"
      itemPrice.appendChild(document.createTextNode(item.price));
      itemPrice.setAttribute("data-listener", "editTrayItem")
      item.appendChild(itemPrice)
      var itemQuantity = document.createElement("span");
      itemQuantity.className = "trayItemQuantity";
      itemQuantity.appendChild(document.createTextNode("("+item.quantity+")"));
      itemQuantity.setAttribute("data-listener", "editTrayItem");
      item.appendChild(itemQuantity);
      var options = document.createElement("ul");
      for(var i=0; i<item.options.length; i++){
        var opt = item.options[i]
        var option = document.createElement("li");
        option.className = "trayOption";
        option.setAttribute("data-listener", "editTrayItem")
        var optionName = document.createElement("span");
        optionName.className = "trayOptionName";
        optionName.appendChild(document.createTextNode(opt.name));
        optionName.setAttribute("data-listener", "editTrayItem")
        option.appendChild(optionName);
        var optionPrice = document.createElement("span");
        optionPrice.className = "trayOptionPrice";
        optionPrice.appendChild(document.createTextNode(opt.price));
        optionPrice.setAttribute("data-listener", "editTrayItem")
        option.appendChild(optionPrice);
        options.appendChild(option);
      }
      item.appendChild(options);
      this.trayItemNode = item;
      return item;
    }
  }

  var Tray = function(items){
    this.items = items;

    this.addItem = function(item){
      if (!(item instanceof TrayItem)){
        throw new Error("Item must be an object of the Tray Item class");
      } else {
        this.items.push(item);
        elements.tray.appendChild(item.renderTrayHtml());
      }
    }

    this.removeItem = function(id){
      var removed;
      var newItems = [];
      var item;
      for(var i=0; i<this.items.length; i++){
        item = this.items[i];
        if(item.id===id){
          removed = item;
        } else {
          newItems.append(item);
        }
      }
      elements.tray.removeChild(removed.trayItemNode);
      this.items = newItems;
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
  ordrin.getTrayString = function(){
    return this.tray.buildTrayString();
  }
  
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

  function emptyNode(node){
    while(node.firstChild){
      node.removeChild(node.firstChild);
    }
  }

  function extractAllItems(itemList){
    var items = {};
    var item;
    for(var i=0; i<itemList.length; i++){
      item = itemList[i];
      items[item.id] = item;
      var children = extractAllItems(item.children);
      for(var id in children){
        if(children.hasOwnProperty(id)){
          items[id] = children[id];
        }
      }
    }
  }

  allItems = {};

  listen("DOMContentLoaded", window, function(){
    getElements();
    listen("click", document, clicked);
    allItems = extractAllItems(ordrin.menu);
  });

  function clicked(event){
    if (typeof event.srcElement == "undefined"){
      event.srcElement = event.target;
    }
    // call the appropiate function based on what element was actually clicked
    var routes = {  
      menuItem    : createDialogBox,
      closeDialog : hideDialogBox,
      addToTray : addTrayItem,
      removeTrayItem : removeTrayItem,
      optionCheckbox : validateCheckbox
    }

    var name = event.srcElement.getAttribute("data-listener");

    if (typeof routes[name] != "undefined"){
      routes[name](event.srcElement);
    }
  }

  function getChildWithClass(node, className){
    for(var i=0; i<node.children.length; i++){
      if(node.children[i].className.indexOf(className)>=0){
        return node.children[i];
      }
    }
  }

  function getElementsByClassName(node, className){
    var re = new RegExp("\\b"+className+"\\b");
    nodes = [];
    for(var i=0; i<node.children.length; i++){
      child = node.children[i];
      if(re.test(child.className)){
        nodes.append(child);
      }
      nodes = nodes.concat(getElementsByClassName(child, className));
    }
    return nodes;
  }

  function createDialogBox(node){
    // get the correct node, if it's not the current one
    node = goUntilParent(node, "mi");
    var itemId = node.getAttribute("data-miid");
    var item = allItems[itemId];

    console.log(node.getElementsByClassName("name"));
    // put the name and description in the option box
    var title   = item.name;
    var price   = item.price;
    var descrip = item.descrip;
    var category = category.name;
    elements.dialog.getElementsByClassName("dialogDescription")[0].innerHTML = descrip;
    elements.dialog.getElementsByClassName("itemTitle")[0].innerHTML = title;
    elements.dialog.getElementsByClassName("itemPrice")[0].innerHTML = price;
    elements.dialog.setAttribute("data-miid", itemId);
    elements.dialog.setAttribute("data-title", title);
    elements.dialog.setAttribute("data-category", category);

    // clone the options
    node = getChildWithClass(node, "optionCategoryList").cloneNode(true);
    
    // unhide themp
    node.className = node.className.replace("hidden", "");

    // put them in the dialog option container
    var container = getChildWithClass(elements.dialog, "popup-box-container");
    getChildWithClass(container, "optionContainer").appendChild(node);

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
      var container = getChildWithClass(elements.dialog, "popup-box-container");
      var optionContainer = getChildWithClass(container, "optionContainer");
      emptyNode(optionContainer);
      var checkBoxes = elements.dialog.getElementsByClassName("optionCheckbox");
      for(var i=0; i<checkBoxes.length; i++){
        checkBoxes[i].checked = false;
      }

      // reset quantity
      getChildWithClass(container, "itemQuantity").value = 1;
    }
  }

  function removeTrayItem(node){
    var item = goUntilParent(node, "trayItem");
    var index = Array.prototype.indexOf.call(item.parentNode.children, item);
    item.parentNode.removeChild(item)
    ordrin.tray.removeItem(index)
  }

  function validateCheckbox(node){
    var category = goUntilParent(node, "optionCategory");
    validateGroup(category);
  }

  function validateGroup(groupNode){
    var group = allItems[group.getAttribute("data-mogid")];
    var min = +(allItems.min_child_select);
    var max = +(allItems.max_child_select);
    var checkBoxes = groupNode.getElementsByClassName("optionCheckbox");
    var checked = 0;
    var errorNode = getChildWithClass(groupNode, "error");
    emptyNode(errorNode);
    for(var j=0; j<checkBoxes.length; j++){
      if(checkBoxes[j].checked){
        checked++;
      }
    }
    if(checked<min){
      error = true;
      var errorText = "You must select at least "+min+" options";
      var error = document.createTextNode(errorText);
      errorNode.appendChild(error);
      return false;
    }
    if(max>0 && checked>max){
      error = true;
      var errorText = "You must select at most "+max+" options";
      var error = document.createTextNode(errorText);
      errorNode.appendChild(error);
      return false;
    }
    return true;
  }

  function addTrayItem(){
    var id = elements.dialog.getAttribute("data-miid");
    var form = document.forms["ordrin-dialog"];
    var quantity = form.elements["itemQuantity"];

    var error = false;
    var categories = elements.dialog.getElementsByClassName("optionCategory");
    for(var i=0; i<categories.length; i++){
      if(!validateGroup(categories[i])){
        error = true;
      }
    }

    if(error){
      return;
    }
    
    var checkBoxes = form.options;
    var options = [];
    for(var i=0; i<checkBoxes.length; i++){
      if(checkBoxes[i].checked){
        var listItem = goUntilParent(checkBoxes[i], "option")
        var optionId = listItem.getAttribute("data-moid");
        var optionName = allItems[optionId].name;
        var optionPrice = allItems[optionId].price;
        var option = new Option(optionId, optionName, optionPrice)
        options.push(option);
      }
    }
    var itemName = allItems[id].name;
    var itemPrice = allItems[id].price;
    var trayItem = new TrayItem(id, quantity, options, itemName, itemPrice);
    ordrin.tray.addItem(trayItem);
    hideDialogBox();
  }

  // UTILITY FUNCTIONS
  function getElements(){
    var menu          = document.getElementById("ordrinMenu");
    elements.dialog   = menu.getElementsByClassName("optionsDialog")[0];
    elements.dialogBg = menu.getElementsByClassName("dialogBg")[0];
    elements.tray     = menu.getElementsByClassName("tray")[0];
  }
})();