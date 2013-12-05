/*
v2.4
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

FUTURE MODIFICATIONS
- Modifiable Category Titles
- Add / Rearrange Categories
- Rearrange Steps
- Rearrange Options
- Prettify New Category Prompt
*/

(function($) { // Anonymous function module

  var data = null;

  $(function() { // DOM is loaded and ready
  
    // Grab commission template from server
    data = $('#json_id').data('url');
    
    // Build page from commission settings data
    build_page(data);
    
    // Activate buttons and name fields
    load_dynamics();
  });
  
  var category_num = 0;
  var step
  
  function build_page(data) {
    /* LOOP THROUGH EACH CATEGORY */
    $.each(data.categories, function(catkey, val) {
    
      // Navigation Tab
      var tabli = $("<li/>").appendTo(".nav-tabs");
      var tablia = $("<a/>", {
        "href": "#category-" + catkey,
        "data-toggle": "tab"
      }).appendTo(tabli);
      $("<span/>", {
        html: val.name
      }).appendTo(tablia);
      
      // Button: Category Removal
      $("<button/>", {
        "type": "button",
        "class": "close remove-category",
        html: "&times;"
      }).appendTo(tablia);
    
      // Category Container
      var category = $("<div/>", {
        "id": "category-" + catkey,
        "class": "category tab-pane"
      }).appendTo(".tab-content");
      
      // Get Auth Token
      var authenticity_token = $("<input/>", {
        "name": "authenticity_token",
        "value": getAuthToken(),
        "type": "hidden"
      }).appendTo(category);
      
      // Category Name : category-[cat]
      var hacky_cat_name = $("<input/>", {
        "name": "category-" + catkey,
        "value": val.name,
        "type" : "hidden"
      }).appendTo(category);
      
      // Step Group
      var step_group = $("<div/>", {
        "id": "accordion-" + catkey,
        "class": "step-group"
      }).appendTo(category);
      
      /* LOOP THROUGH EACH STEP */
      $.each(val.steps, function(stepkey, val) {
      
        // Step Container
        var step_container = $("<div/>", {
          "class": "step-container"
        }).appendTo(step_group);
        
        // Step Heading
        var step_heading = $("<div/>", {
          "class": "step-heading well",
          "data-toggle": "collapse",
          "data-parent": "#accordion-" + catkey,
          "href": "#" + catkey + "-" + stepkey,
          html: "STEP " + (stepkey+1)
        }).appendTo(step_container);
        
        // Button: Step Removal
        $("<button/>", {
          "type": "button",
          "class": "close remove-step",
          html: "&times;"
        }).appendTo(step_heading);
        
        // Step
        var step = $("<div/>", {
          "id": catkey + "-" + stepkey,
          "class": "step collapse"
        }).appendTo(step_container);
        
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
        
        var option_group = $("<div/>", {
          "id": "option-group-" + catkey + "-" + stepkey
        }).appendTo(step);
        
        add_step_utilities(step);
        
        /* LOOP THROUGH EACH OPTION */
        $.each(val.options, function(optkey, val) {
        
          // Option Container
          var option = $("<div/>", {
            "class": "option"
          }).appendTo(option_group);
          
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
            "class": "close remove-option",
            html: "&times;"
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
        
        
      });
      
      // Button: Add Step
      $("<button/>", {
        "class": "btn btn-default add-step",
        "type": "button",
        html: "Add Step"
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
        "html": data.categories.prompt
      }).appendTo(category);
      
      // Button: Submit
      var submit = $("<div/>", {
        "id": "control-btns"
      }).appendTo(category);
      $("<input/>", {
        "id": "submit",
        "class": "btn btn-primary btn-lg",
        "type": "submit",
        html: "Submit"
      }).appendTo(submit);

    }); // category loop
    
    // Button: New Category
    var tabli = $("<li/>").appendTo(".nav-tabs");
    var tablia = $("<a/>").appendTo(tabli);
    $("<span/>", {
      "class": "cat-name add-category",
      html: "New Category"
    }).appendTo(tablia);
    
    $('.nav-tabs a:first').tab('show');
    
    rebind_events();
    
  } // build page
  
  function load_dynamics() {
    rebind_events();
    
    // parse through form
  }
  
  // Unbinds all event handlers and binds each interactive UI
  // element with a single event handler.
  //   (this avoids multiple binds on any element)
  function rebind_events() {
    // Rebind Add Category
    $(".add-category").unbind();
    $(".add-category").click(function() {
      add_category(this);
    });
    // Rebind Add Step
    $(".add-step").unbind();
    $(".add-step").click(function() {
      add_step($(this).prev());
    });
    
    // Rebind Add Option
    $(".add-option").unbind();
    $(".add-option").click(function() {
      add_option($(this).prev());
    });
    
    // Rebind Remove Category
    $(".remove-category").unbind();
    $(".remove-category").click(function() {
      var r = confirm("Are you sure you want to remove this category?");
      if (r) {
        $($(this).parent().attr("href")).remove(); // remove form content
        $(this).parent().parent().remove(); // remove tab
      }
    });
    
    // Rebind Remove Step
    $(".remove-step").unbind();
    $(".remove-step").click(function() {
      $(this).parent().parent().remove();
    });
    
    // Rebind Remove Option
    $(".remove-option").unbind();
    $(".remove-option").click(function() {
      $(this).parent().parent().remove();
    });
  }
  
  // Adds a new category, including both navigation tab and
  // form body. Creates one step with one option inside.
  function add_category(frame) {
    var cat_name = prompt("New Category:");
    if (!cat_name) return;
    
    var tabli = $("<li/>").insertBefore($(frame).parent().parent());
    var tablia = $("<a/>", {
      "href": "#category-",
      "data-toggle": "tab"
    }).appendTo(tabli);
    $("<span/>", {
      html: cat_name
    }).appendTo(tablia);
    
    // Button: Category Removal
    $("<button/>", {
      "type": "button",
      "class": "close remove-category",
      html: "&times;"
    }).appendTo(tablia);
  
    // Category Container
    var category = $("<div/>", {
      "id": "category-",
      "class": "category tab-pane"
    }).appendTo(".tab-content");
    
    // Get Auth Token
    var authenticity_token = $("<input/>", {
      "name": "authenticity_token",
      "value": getAuthToken(),
      "type": "hidden"
    }).appendTo(category);
    
    // Category Name : category-[cat]
    var hacky_cat_name = $("<input/>", {
      "name": "category-",
      "value": cat_name,
      "type" : "hidden"
    }).appendTo(category);
    
    // Step Group
    var step_group = $("<div/>", {
      "id": "accordion-",
      "class": "step-group"
    }).appendTo(category);
    
    add_step(step_group);
    
    // Button: Add Step
    $("<button/>", {
      "class": "btn btn-default add-step",
      "type": "button",
      html: "Add Step"
    }).appendTo(category);
    
    rebind_events();
    
    $("<hr>").appendTo(category);
    
    /* FINAL STEP */
    $("<h3/>", {
      html: "Final Step"
    }).appendTo(category);
    $("<textarea/>", {
      "name": "prompt",
      "class": "form-control",
      "placeholder": "Prompt the customer for commission specification....",
      "html": data.categories.prompt
    }).appendTo(category);
    
    // Button: Submit
    var submit = $("<div/>", {
      "id": "control-btns"
    }).appendTo(category);
    $("<input/>", {
      "id": "submit",
      "class": "btn btn-primary btn-lg",
      "type": "submit",
      html: "Submit"
    }).appendTo(submit);
  }
  
  // Appends a new step to the given frame.
  function add_step(frame) {
    // Step Container
    var step_container = $("<div/>", {
      "class": "step-container"
    }).appendTo(frame);
    
    // Step Heading
    var step_heading = $("<div/>", {
      "class": "step-heading well",
      "data-toggle": "collapse",
      "data-parent": "#accordion-",
      "href": "#",
      html: "STEP "
    }).appendTo(step_container);
    
    // Button: Step Removal
    $("<button/>", {
      "type": "button",
      "class": "close remove-step",
      html: "&times;"
    }).appendTo(step_heading);
    
    // Step
    var step = $("<div/>", {
      "id": "",
      "class": "step collapse"
    }).appendTo(step_container);
    
    // Step Name : step-[cat]-[step]
    var step_name = $("<div/>", {
      "class": "form-group"
    }).appendTo(step);
    $("<label/>", {
      "class": "sr-only",
      "for": "step-",
      html: "Step Name"
    }).appendTo(step_name);
    $("<input/>", {
      "id": "step-",
      "name": "step-",
      "class": "form-control input-lg step-name",
      "type": "text",
      "placeholder": "Step Name",
      "value": ""
    }).appendTo(step_name);
    
    var option_group = $("<div/>", {
      "id": "option-group-"
    }).appendTo(step);
    
    add_option(option_group);
    
    add_step_utilities(step);
    
    rebind_events();
  }
  
  function add_step_utilities(frame) {
    // Button: Add Option
    $("<button/>", {
      "class": "btn btn-default add-option",
      "type": "button",
      html: "Add Option"
    }).appendTo($(frame));
  }
  
  // Appends a new option to the given frame.
  function add_option(frame) {
    // Option Container
    var option = $("<div/>", {
      "class": "option"
    }).appendTo($(frame));
    
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
    
    rebind_events();
  }
})(jQuery);