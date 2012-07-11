# Readme

This library allows anyone to easily place a menu in any web page simply by including `script/menu.js`. This menu will be placed in an empty `<div>` that has the id `ordrinMenu`. The provided file `style/main.css` gives default styling for the menu.

## Javascript
The following classes are used for externally visible data:

### Option
Fields:

1. `id`: The menu id of the option
2. `name`: The name of the option
3. `price`: The price of the option

### TrayItem
Fields:

1. `trayItemId`: The tray id of the item (used for uniquely identifying items in the tray
2. `itemId`: The menu id of the item
3. `itemName`: The name of the item
4. `quantity`: The selected quantity for the item in the tray
5. `options`: The selected options for the item in the tray
6. `price`: The base price of the item

Methods:

1. `buildItemString()`: Returns the part of the ordr.in API query string corresponding to this item
2. `renderTrayHtml()`: Returns the DOM node corresponding to this item in the tray
3. `hasOptionSelected(optionId)`: Returns true if this item has an option selected with this `optionId` and false otherwise
4. `getTotalPrice()`: Returns the total price of this tray item, taking into account selected options and quantity

### Tray
Fields:

1. `items`: A hash mapping tray item ids to items in the tray

Methods:

1. `addItem(item)`: Adds `item` to the tray
2. `removeItem(id)`: Removes the item with the tray id `id` from the tray
3. `buildTrayString()`: Returns the part of the ordr.in API query string corresponding to the tray
4. `getSubtotal()`: Returns the total price of all items in the tray

The `ordrin` global object has all externally accessable information related to this script. It has a field for the menu data (more on this later). It also has a field for each template and one for determining whether the script should render the menu from the template (again, more on these later). It also stores the tray in `ordrin.tray`. This is an instance of `Tray`.

## Input Data
The webpage must contain a script element that creates the `ordrin` global object if it does not exist and sets `ordrin.menu` to an array of objects. This array should be in the same format as the value of the menu key in the restaurant details request to the ordr.in API, as detailed on [this page](http://ordr.in/developers/restaurant).

## Templates
The `ordrin` object contains the following 3 Mustache templates. Any of these templates can be replaced with a custom template with the same structure that will be used instead. Alternatively, a page with the same structure as the main template can be rendered on the server side, in which case `ordrin.render` should be set to `false`.

### Menu

The template from which the menu is rendered is stored at `ordrin.template`. This template is rendered by with the `ordrin` global object. Any custom template that replaces this one should have the following properties:

1. For each menu item, there should be a containing tag with the attributes `data-listener="menuItem"` and `data-miid="{{id}}"`, where `{{id}}` is the `id` of that item.

2. There should be a `<div>` with the class `trayContainer` that contains an empty `<ul>` with the class `tray`.

3. There should be an empty `<div>` with the classes `optionsDialog popup-container hidden` and another one with the classes `dialogBg fade-to-gray hidden`.

### Dialog

The template from which the dialog is rendered is stored at `ordrin.dialogTemplate`. This template is rendered with an item object from `ordrin.menu`. Any custom template that replaces this one should have the following properties:

1. For each option group, there should be a containing tag with the class `optionCategory` and the attribute `data-mgid="{{id}}"` where `{{id}}` is the group id. Each option in the option group should have the following things: a containing tag with the class `option` and the attribute `data-moid="{{id}}"` where `{{id}}` is the option id and a checkbox with the class `optionCheckbox` and the attribute `data-listener="optionCheckbox"`
2. A number input with the class `itemQuantity`.
3. A submit button with the attribute `data-listener="addToTray"`.

### Tray Item

The template from which the tray items are rendered is stored at `ordrin.trayItemTemplate`. This template is rendered with a `TrayItem` object. Any custom template that replaces this one should have the following properties:

1. The containing tag should be like `<li class="trayItem" data-listener="editTrayItem" data-miid="{{itemId}}" data-tray-id="{{trayItemId}}">`.
2. There should be some element with the attribute `data-listener="removeTrayItem"`.