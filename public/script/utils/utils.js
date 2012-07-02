(function(){
  "use strict";

  exports.toggleHidden = function(node){
    console.log("unhiding", node);
    if (node.className.indexOf("hidden") != -1)
      node.className = node.className.replace("hidden", "");
    else
      node.className += " hidden";
  }

  exports.listen = function(evnt, elem, func) {
      if (elem.addEventListener)  // W3C DOM
          elem.addEventListener(evnt,func,false);
      else if (elem.attachEvent) { // IE DOM
           var r = elem.attachEvent("on"+evnt, func);
    return r;
      }
  }
  exports.fireEvent = function(element, event){
      if (document.createEventObject){
      // dispatch for IE
      var evt = document.createEventObject();
      return element.fireEvent('on'+event,evt)
      }
      else{
      // dispatch for firefox + others
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent(event, true, true ); // event type,bubbling,cancelable
      return !element.dispatchEvent(evt);
      }
  }

  exports.goUntilParent = function(node, targetClass){
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

  // photo scroller stuff, maybe put in own file. It's a little too DOMy for utils...
  exports.setupPhotoScroller = function(images, parentNode){
    var scrollerWindow = document.getElementById("thumbnailsWindow");

    // make sure scroller isn't hidden
    if (scrollerWindow.className.indexOf("hidden") !== -1){
      scrollerWindow.className = scrollerWindow.className.replace(" hidden", "");
    }

    // place the images in the scroller
    for (var i = 0; i < images.length; i++){
      this.placeImage(images[i], document.getElementById("thumbnailsContainer"));
    }

    // put a border around the first element
    var imageContainer = document.getElementById("thumbnailsContainer").getElementsByClassName("imageContainer")[0];
    imageContainer.className += " selected";


    // remove scroller arrows if less than 4 images
    if (images.length <= 4){
      // remove whole thing if there's only 1 photo
      if (images.length === 1){
        if (scrollerWindow.className.indexOf("hidden") === -1){
          scrollerWindow.className += " hidden";
        }
      }
      hideScrollerArrows(document.getElementById("picturesDialog"), scrollerWindow);
    }else{
      // otherwise make sure they're there
      showScrollerArrows(document.getElementById("picturesDialog"), scrollerWindow);
      // hide left arrow on load. They're already all the way left
      var leftArrow  = document.getElementById("picturesDialog").getElementsByClassName("thumbnailLeftArrow")[0];
      if (leftArrow.className.indexOf("hidden") === -1){
        leftArrow.className += " hidden";
      }
    }
  }

  // places image thumbnails in dialog
  exports.placeImage = function(image, container){
    var imageContainer = document.createElement("div");
    imageContainer.className = "imageContainer imageBox";

    var imageNode = document.createElement("img");

    imageNode.className = "imageThumbnail hidden";
    imageNode.setAttribute("data-listener", "imageThumbnail");
    imageNode.setAttribute("src", image.url);
    imageContainer.appendChild(imageNode);
    this.listen("load", imageNode, squareImage);

    container.appendChild(imageContainer);
  }

  // makes a thumbnail out of an image
  function squareImage(event){
    var max = 150, node;
    if (typeof event.srcElement === "undefined"){
      node = event.target;
    }else{
       node = event.srcElement;
    }

    var height = node.height;
    var width  = node.width;
    if (height >= width) {
      var proportion = height / width;
      width          = max;
      height         = max * proportion;
    } else {
      var proportion = width / height;
      height         = max;
      width          = max * proportion;
    }

    node.style.height = height + "px";
    node.style.width  = width + "px";
    
    // center it
    node.style.marginTop  = "-" + ((height - max) / 2) + "px";
    node.style.marginLeft = "-" + ((width - max) / 2) + "px";

    node.className = node.className.replace("hidden", "");
  }

  // hides all arrows in parent node, and unfloats scroller
  function hideScrollerArrows(parentNode, scroller){
    var arrows = parentNode.getElementsByClassName("thumbnailArrow");
    for (var i = 0; i < arrows.length; i++){
      if (arrows[i].className.indexOf("hidden") === -1){
        arrows[i].className += " hidden";
      }
    }
    if (scroller.className.indexOf("noFloat") === -1){
      scroller.className += " noFloat";
    }
  }
  
  // shows all arrows in parent node, and refloats scroller
  function showScrollerArrows(parentNode, scroller){
    var arrows = parentNode.getElementsByClassName("thumbnailArrow");
    for (var i = 0; i < arrows.length; i++){
      arrows[i].className = arrows[i].className.replace(" hidden", "");
    }
    scroller.className = scroller.className.replace(" noFloat", "");
  }

  // strips out html encoding from strings. IE: &amp; => &
  exports.unEncodeHtml = function(string){
    var div       = document.createElement("div");
    div.innerHTML = string;
    return div.textContent || div.innerText;
  }

}());
