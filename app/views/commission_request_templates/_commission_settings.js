/*
v2.1
This JavaScript file parses a "Commission Request Template" JSON object
into an appropriate HTML form representation for an artist to edit
commission settings. The modified form objects are then POST'd to the
server for storage.

A webpage calling this script must have 3 specific page elements
(this requirement may change in future versions):

<ul class="nav nav-tabs"></ul>
<form role="form">
  <div class="tab-content"></div>
</form>

This page also currently requires the following file in the same directory:
- comset.css
- blobexample.txt


FUTURE MODIFICATIONS
- Modifiable Category Titles
- Add / Remove / Rearrange Categories
- A/R/R Steps
- Rearrange Options
- Final Step (Specification)
- Preview / Cancel Button Functionality
- Anonymize Root Function Calls

*/
$(document).ready(function() { 
  
  var data = $('#json_id').data('url');
  /* LOOP THROUGH EACH CATEGORY */
  $.each(data.categories, function(catkey, val) {
  
    // Navigation Tab
    var tabli = $("<li/>").appendTo(".nav-tabs");
    var tablia = $("<a/>", {
      "href": "#category-" + catkey,
      "data-toggle": "tab"
    }).appendTo(tabli);
    $("<span/>", {
      "class": "cat-name",
      html: val.name
    }).appendTo(tablia);
    
    // Remove Category
    $("<button/>", {
      "type": "button",
      "class": "close remove-category",
      html: "&times;"
    }).appendTo(tablia);
  
    // Category Container (Form)
    var category = $("<form/>", {
      "id": "category-" + catkey,
      "class": "category tab-pane",
      "action": "update_template",
      "method": "post"
      //,"enctype":"multipart/form-data" This is what we put if we want to
      //post images to the database, but currently server side code
      //isn't set up for it
    }).appendTo(".tab-content");
    var authenticity_token = $("<input/>", {
      "name": "authenticity_token",
      "value": getAuthToken(),
      "type": "hidden"
    }).appendTo(category);
    //Austin or anyone who wants to edit this thing,
    //you can pass the category name of the category being edited
    //as a form named "cat_name"
    //For new forms it will create a new category, otherwise
    //it will override the old category
    var hacky_cat_name = $("<input/>", {
      "name": "cat_name",
      "value": val.name,
      "type" : "hidden"
    }).appendTo(category);
    /* LOOP THROUGH EACH STEP */
    $.each(val.steps, function(stepkey, val) {
    
      // Step Container
      var step = $("<div/>", {
        "class": "step"
      }).appendTo(category);
      
      // Button: Remove Step
      $("<button/>", {
        "type": "button",
        "class": "btn btn-default pull-right",
        html: "&#150;"
      }).appendTo(step);
      
      // Glyph: Dropdown
      $("<button/>", {
        "class": "btn btn-sm btn-default pull-left",
        "type": "button",
        "data-toggle": "collapse",
        "data-target": "#step-options-" + catkey + "-" + stepkey,
        html: "Expand"
      }).appendTo(step);
      
      // Step Name : step-[cat]-[step]
      var step_name = $("<div/>", {
        "class": "form-group"
      }).appendTo(step);
      $("<label/>", {
        "class": "sr-only",
        "for": "step-" + catkey + "-" + stepkey,
        html: "Step Name"
      }).appendTo(step_name);
      $("<input/>", {
        "id": "step-" + catkey + "-" + stepkey,
        "name": "step-" + catkey + "-" + stepkey,
        "class": "form-control input-lg step-name",
        "type": "text",
        "placeholder": "Step Name",
        "value": val.name
      }).appendTo(step_name);
      
      var step_options = $("<div/>", {
        "id": "step-options-" + catkey + "-" + stepkey,
        "class": "collapse"
      }).appendTo(step);
      
      /* LOOP THROUGH EACH OPTION */
      $.each(val.options, function(optkey, val) {
      
        // Option Container
        var option = $("<div/>", {
          "class": "option"
        }).appendTo(step_options);
        
        // Option Panel
        var panel = $("<div/>", {
          "class": "panel panel-default"
        }).appendTo(option);
        
        // Panel Heading
        var panel_heading = $("<div/>", {
          "class": "panel-heading"
        }).appendTo(panel);

        // Button: Option Removal
        $("<button/>", {
          "type": "button",
          "class": "btn btn-default pull-right",
          html: "&#150;"
        }).appendTo(panel_heading);
        
        // Option Name : option-[cat]-[step]-[opt]-name
        var option_name = $("<div/>", {
          "class": "form-group"
        }).appendTo(panel_heading);
        $("<label/>", {
          "class": "sr-only",
          "for": "option-" + catkey + "-" + stepkey + "-" + optkey + "-name",
          html: "Option Name"
        }).appendTo(option_name);
        $("<input/>", {
          "id": "option-" + catkey + "-" + stepkey + "-" + optkey + "-name",
          "name": "option-" + catkey + "-" + stepkey + "-" + optkey + "-name",
          "class": "form-control input-lg option-name",
          "type": "text",
          "placeholder": "Option Name",
          "value": val.name
        }).appendTo(option_name);
        
        // Panel Body
        var panel_body = $("<div/>", {
          "class": "panel-body"
        }).appendTo(panel);
        
        // Option Thumbnail : option-[cat]-[step]-[opt]-thumb
        var option_thumb = $("<div/>", {
          "class": "form-group"
        }).appendTo(panel_body);
        var option_thumb_label = $("<label/>", {
          "for": "option-" + catkey + "-" + stepkey + "-" + optkey + "-thumb",
          html: "Example:"
        }).appendTo(option_thumb);
        $("<input/>", {
          "id": "option-" + catkey + "-" + stepkey + "-" + optkey + "-thumb",
          "name": "option-" + catkey + "-" + stepkey + "-" + optkey + "-thumb",
          "class": "option-thumb",
          "type": "file"
        }).appendTo(option_thumb_label);
        $("<img/>", {
          "class": "img-thumbnail pull-left",
          "src": val.thumb
        }).appendTo(option_thumb_label);
        
        // Option Price : option-[cat]-[step]-[opt]-price
        var option_price = $("<div/>", {
          "class": "input-group"
        }).appendTo(panel_body);
        $("<label/>", {
          "class": "sr-only",
          "for": "option-" + catkey + "-" + stepkey + "-" + optkey + "-price",
          html: "Price:"
        }).appendTo(option_price);
        $("<span/>", {
          "class": "input-group-addon",
          html: "$"
        }).appendTo(option_price);
        $("<input/>", {
          "id": "option-" + catkey + "-" + stepkey + "-" + optkey + "-price",
          "name": "option-" + catkey + "-" + stepkey + "-" + optkey + "-price",
          "class": "form-control option-price",
          "type": "text",
          "placeholder": 'Price (e.g. "10.00")',
          "value": val.price
        }).appendTo(option_price);
        
        $("<br>").appendTo(panel_body); 
        // Option Description : option-[cat]-[step]-[opt]-description
        $("<textarea/>", {
          "name": "option-" + catkey + "-" + stepkey + "-" + optkey + "-description",
          "class": "form-control option-description",
          "placeholder": "Enter a description...",
          html: val.description
        }).appendTo(panel_body);
      });
      
      /* ADD AN OPTION */
      $("<button/>", {
        "class": "btn btn-default add-option",
        "type": "button",
        html: "Add an Option"
      }).appendTo(step_options);
      
      $("<hr>").appendTo(step);
    });
    
    /* ADD A STEP */
    $("<button/>", {
      "class": "btn btn-default add-step",
      "type": "button",
      html: "Add a Step"
    }).appendTo(category);
    
    $("<hr>").appendTo(category);
    
    /* FINAL STEP */
    $("<h3/>", {
      html: "Final Step"
    }).appendTo(category);
    $("<textarea/>", {
      "name": "prompt",
      "class": "form-control",
      "placeholder": "Prompt the customer for commission specification....",
    }).appendTo(category);
    
    // Buttons: Preview, Submit, Cancel
    var submit = $("<div/>", {
      "id": "control-btns"
    }).appendTo(category);
    $("<button/>", {
      "id": "preview",
      "class": "btn btn-default btn-lg",
      "type": "button",
      html: "Preview"
    }).appendTo(submit);
    $("<input/>", {
      "id": "submit",
      "class": "btn btn-primary btn-lg",
      "type": "submit",
      html: "Submit"
    }).appendTo(submit);
    $("<button/>", {
      "id": "cancel",
      "class": "btn btn-default btn-lg pull-right",
      "type": "button",
      html: "Cancel"
    }).appendTo(submit);
  });
  
  /* ADD A CATEGORY */
  var tabli = $("<li/>").appendTo(".nav-tabs");
  var tablia = $("<a/>").appendTo(tabli);
  $("<span/>", {
    "class": "cat-name",
    html: "Add a Category"
  }).appendTo(tablia);
  
  $('.nav-tabs a:first').tab('show');
  
  
  function rebind_removals() {
    // Remove Category
    $(".remove-category").click(function() {
      var r = confirm("Are you sure you want to remove this category?");
      if (r) {
        $($(this).parent().attr("href")).remove(); // remove form content
        $(this).parent().parent().remove(); // remove tab
      }
    });
    
    // Remove Step
    $(".remove-step").click(function() {
      $(this).parent().remove();
    });
    
    // Remove Option
    $(".remove-option").click(function() {
      $(this).parent().parent().remove();
    });
  }
  
  function rebind_adds() {
    $(".add-option").unbind();
    $(".add-option").click(function() {
      add_option(this);
    });
  
    $(".add-step").unbind();
    $(".add-step").click(function() {
      add_step(this);
    });
  }
  
  rebind_removals();
  rebind_adds();
  
  function add_option(frame) {
    // Option Container
    var option = $("<div/>", {
      "class": "option"
    }).insertBefore($(frame));
    
    // Option Panel
    var panel = $("<div/>", {
      "class": "panel panel-default"
    }).appendTo(option);
    
    // Panel Heading
    var panel_heading = $("<div/>", {
      "class": "panel-heading"
    }).appendTo(panel);
    
    // Remove Option
    $("<button/>", {
      "type": "button",
      "class": "close remove-option",
      html: "&times;"
    }).appendTo(panel_heading);
    
    // Option Name
    var option_name = $("<div/>", {
      "class": "form-group"
    }).appendTo(panel_heading);
    $("<label/>", {
      "class": "sr-only",
      "for": "",
      html: "Option Name"
    }).appendTo(option_name);
    $("<input/>", {
      "id": "",
      "name": "",
      "class": "form-control input-lg option-name",
      "type": "text",
      "placeholder": "Option Name"  
    }).appendTo(option_name);
    
    // Panel Body
    var panel_body = $("<div/>", {
      "class": "panel-body"
    }).appendTo(panel);
    
    // Option Thumbnail
    var option_thumb = $("<div/>", {
      "class": "form-group"
    }).appendTo(panel_body);
    var option_thumb_label = $("<label/>", {
      "for": "",
      html: "Example:"
    }).appendTo(option_thumb);
    $("<input/>", {
      "id": "",
      "name": "",
      "class": "option-thumb",
      "type": "file"
    }).appendTo(option_thumb_label);
    $("<img/>", {
      "class": "img-thumbnail pull-left",
      "src": ""
    }).appendTo(option_thumb_label);
    
    // Option Price
    var option_price = $("<div/>", {
      "class": "input-group"
    }).appendTo(panel_body);
    $("<label/>", {
      "class": "sr-only",
      "for": "",
      html: "Price:"
    }).appendTo(option_price);
    $("<span/>", {
      "class": "input-group-addon",
      html: "$"
    }).appendTo(option_price);
    $("<input/>", {
      "id": "",
      "name": "",
      "class": "form-control option-price",
      "type": "text",
      "placeholder": 'Price (e.g. "10.00")',
      "value": ""
    }).appendTo(option_price);
    
    $("<br>").appendTo(panel_body); 
    
    // Option Description
    $("<textarea/>", {
      "name": "",
      "class": "form-control option-description",
      "placeholder": "Enter a description...",
      html: ""
    }).appendTo(panel_body);
    
    rebind_removals(); // rebinding, shouldn't cause a problem?
  }
  
  function add_step(frame) {
    // Step Container
    var step = $("<div/>", {
      "class": "step"
    }).insertBefore($(frame));
    
    // Remove Step
    $("<button/>", {
      "type": "button",
      "class": "close remove-step",
      html: "&times;"
    }).appendTo(step);
    
    // Glyph: Dropdown
    $("<button/>", {
      "class": "btn btn-sm btn-default pull-left",
      "type": "button",
      "data-toggle": "collapse",
      "data-target": "",
      html: "Expand"
    }).appendTo(step);
    
    // Step Name : step-[cat]-[step]
    var step_name = $("<div/>", {
      "class": "form-group"
    }).appendTo(step);
    $("<label/>", {
      "class": "sr-only",
      "for": "",
      html: "Step Name"
    }).appendTo(step_name);
    $("<input/>", {
      "id": "",
      "name": "",
      "class": "form-control input-lg step-name",
      "type": "text",
      "placeholder": "Step Name",
      "value": ""
    }).appendTo(step_name);
    
    var step_options = $("<div/>", {
      "class": "help" //collapse
    }).appendTo(step);
    
    //add_option(step_options);
    
    /* ADD AN OPTION */
    $("<button/>", {
      "class": "btn btn-default add-option",
      "type": "button",
      html: "Add an Option"
    }).appendTo(step_options);
    
    $("<hr>").appendTo(step);
    
    rebind_adds();
    rebind_removals(); // rebinding, shouldn't cause a problem?
  }
});