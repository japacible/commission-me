/*
v1.3
This JavaScript file parses a commission request JSON object
into appropriate HTML representation for an artist to review a customer's
commission request. The artist chooses to accept, decline, or review the
commission for further specification.

FUTURE MODIFICATIONS
- Form Validation
- Anonymize
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
/*
  // Display Customer Specifications
  $.each(category.spec, function(key, val) {
    $("<p/>", {
      html: key+1 + ")   " + val
    }).appendTo($("#specification"));
  });
*/
  // Artist's Revised Price
  $("#price").attr("placeholder", "Estimated Value: $" + category.price);


  var authenticity_token = $("<input/>", {
    "name": "authenticity_token",
    "value": getAuthToken(),
    "type": "hidden"
  }).appendTo($("#com-req"));
});
