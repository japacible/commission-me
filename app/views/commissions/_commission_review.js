/*
v1.1
This JavaScript file parses a commission request JSON object
into appropriate HTML representation for an artist to review a customer's
commission request. The artist chooses to accept or decline the
commission.

FUTURE MODIFICATIONS
- Preliminary Price calculation
- Revision option w/ comments
*/

$(document).ready(function() {
  // Data Pull
  var category = $('#json_id').data('url');
  
  // Category Name
  $("<h1/>", {
    html: category.name
  }).appendTo("#com-req");
  
  // Preliminary Price
  // (not important at the moment)
  
  $.each(category.steps, function(stepkey, step) {
    // Step Container
    var panel = $("<div/>", {
      "class": "panel panel-info"
    }).appendTo("#com-req");

    var authenticity_token = $("<input/>", {
      "name": "authenticity_token",
      "value": getAuthToken(),
      "type": "hidden"
    }).appendTo(panel);
    
    // Step Name
    $("<div/>", {
      "class": "panel-heading",
      html: step.name
    }).appendTo(panel);
    
    var choice = step.choice;
    
    // Choice Container
    var choice_container = $("<div/>", {
      "class": "panel-body"
    }).appendTo(panel);
    
    // Choice Name
    $("<h4/>", {
      html: choice.name + " ($" + choice.price + ")"
    }).appendTo(choice_container);
    
    // Choice Description
    $("<em/>", {
      html: choice.description
    }).appendTo(choice_container);
  });

  //Display final step
  var panel = $("<div/>", {
    "class": "panel panel-info"
  }).appendTo("#com-req");

  $("<div/>", {
    "class": "panel-heading",
    html: "Specification"
  }).appendTo(panel);

  $("<div/>", {
    "class": "panel-body",
    html: category.final
  }).appendTo(panel);
});
