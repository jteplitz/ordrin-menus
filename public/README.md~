# Readme

This library allows anyone to easily place a menu in any web page simply by including `script/menu.js`. This menu will be placed in an empty `<div>` that has the id `ordrinMenu`. The provided file `style/main.css` gives default styling for the menu.

## Javascript
The `ordrin` global object has all externally accessable information related to this script...

## Input Data
The webpage must contain a script element that creates the `ordrin` global object if it does not exist and sets `ordrin.menu` to an array of objects. This array should be in the same format as the value of the menu key in the restaurant details request to the ordr.in API, as detailed on [this page](http://ordr.in/developers/restaurant).

## Templates
The `ordrin` object contains the following 3 Mustache templates. Any of these templates can be replaced with a custom template with the same structure that will be used instead. Alternatively, a page with the same structure as the main template can be rendered on the server side, in which case `ordrin.render` should be set to `false`.

The template from which the menu is rendered is stored at `ordrin.template`. This template is rendered by with the `ordrin` global object. Any custom template that replaces this one should have the following properties:

1. For each menu item, there should be a containing tag with the attributes `data-listener="menuItem"` and `data-miid="{{id}}"`, where `{{id}}` is the `id` of that item.

2. There should be a `<div>` with the class `trayContainer` that contains an empty `<ul>` with the class `tray`.

3. There should be an empty `<div>` with the classes `optionsDialog popup-container hidden` and another one with the classes `dialogBg fade-to-gray hidden`.

The template from which the dialog is rendered is stored at `ordrin.dialogTemplate`. This template is rendered with the item object from `ordrin.menu`. Any custom template that replaces this one should have the following properties:

1. For each option group, there should be a containing tag with the class `optionCategory` and the attribute `data-mgid="{{id}}"` where `{{id}}` is the group id. Each option in the option group should have the following things:
    a. A containing tag with the class `option` and the attribute `data-moid="{{id}}"` where `{{id}}` is the option id.
    b. A tag like `<input type="checkbox" class="optionCheckbox" data-listener="optionCheckbox" name="options" />`
2. 