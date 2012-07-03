(function(){
  "use strict";
  
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
    if (node.className.indexOf(targetClass) === -1){
      while(node.parentNode !== document){
        node = node.parentNode;
        if (node.className.indexOf(targetClass) === -1){
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
      deleteItem: deleteItem,
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
    var title   = node.getElementsByClassName("name")[0].innerHTML + " (" + node.getElementsByClassName("price")[0].innerHTML + ")";
    var descrip = node.getElementsByClassName("menuItemDescription")[0].innerHTML;
    var id      = node.getAttribute("data-miid");
    var category = goUntilParent(node, "menuCategory").getElementsByClassName("itemListName")[0].innerHTML;
    document.getElementById("dialogDescription").innerHTML = descrip;
    document.getElementById("optionsTitle").innerHTML = title;
    var dialog = document.getElementById("optionsDialog");
    dialog.setAttribute("data-miid", id);
    dialog.setAttribute("data-title", title);
    dialog.setAttribute("data-category", category);

    // clone the options
    node = node.getElementsByClassName("optionCategoryList")[0].cloneNode(true);
    
    // unhide them
    node.className = node.className.replace("hidden", "");

    // put them in the dialog option container
    document.getElementById("optionContainer").appendChild(node);

    showDialogBox();
  }

  function showDialogBox(name){
    if (typeof name === "undefined"){
      name = "optionsDialog";
    }
    // gray out background
    var background = document.getElementById("dialogBg");
    // show background
    background.className = background.className.replace("hidden", "");

    // show the dialog
    var dialog = document.getElementById(name);
    dialog.className = dialog.className.replace("hidden", "");
  }

  // checks if dialog is closable, and closes it if so
  function closeOptionsDialog(){
    var textarea = document.getElementsByClassName("editBox")[0];
    var id       = document.getElementById("optionsDialog").getAttribute('data-miid');
    if (textarea.value === "" || textarea.value === "Does anything need to be changed?"
        || textarea.value == menuEdits[category][id]){
      hideDialogBox();
    }else{
      textarea.className += " redBorder";
      var editError = goUntilParent(textarea, "editBoxContainer").getElementsByClassName("editError")[0];
      editError.className = editError.className.replace("hidden", "");
    }
  }

  function hideDialogBox(){
    var background     = document.getElementById("dialogBg");
    var dialog         = document.getElementById("optionsDialog");
    
    if (dialog.className.indexOf("hidden") == -1){
      // hide the background and dialog box
      background.className += " hidden";
      dialog.className     += " hidden";
      // remove elements in option container
      var optionContainer = document.getElementById("optionContainer");
      optionContainer.removeChild(optionContainer.getElementsByClassName("optionCategoryList")[0]);
      // reset edit box
      var editBox   = dialog.getElementsByClassName("editBox")[0];
      editBox.value = "Does anything need to be changed?";
      editBox.removeAttribute("disabled");

      // remove red border if there
      var editError = dialog.getElementsByClassName("editError")[0];
      if (editError.className.indexOf("hidden") == -1){
        editError.className += " hidden";
      }
      editBox.className = editBox.className.replace("redBorder", "");

      document.getElementById("deleteItem").checked = false;
    }
  }

  function addTrayItem(){
    var dialog = document.getElementById("ordrinMenu").getElementsByClass("optionsDialog")[0]
    var id = dialog.getAttribute("data-miid")
    var item = dialog.getElementsByClass("optionsTitle")[0].innerHTML
    var category = dialog.getAttribute("data-category")

    check_boxes = dialog.getElementsByClassName("optionCheckbox")
    for(var i=0; i<check_boxes.length; i++){
      
    }
  }
})();