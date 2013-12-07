/*
v3.0
This JavaScript file parses a "Commission Request Template" JSON object
into an appropriate HTML form representation for an artist to edit
commission settings. The modified form objects are then POST'd to the
server for storage.

FUTURE MODIFICATIONS
- Modifiable Category Titles
- Rearrange Cat/Step/Opt
- Prettify New Category Prompt
*/

(function($) { // Anonymous function module
  var data = null;

  $(function() { // DOM is loaded and ready
  
    // Grab commission template from server
    data = $('#json_id').data('url');
    
    // Build page from commission settings data
    build_page(data);
    
    // Bind event handlers
    rebind_events();
    
    // Activate buttons and name fields
    update_dynamics();
    
    // Show first category upon loading
    $('.nav-tabs a:first').tab('show');
  });
  
  function build_page(data) {
    /* LOOP THROUGH EACH CATEGORY */
    $.each(data.categories, function(key, val) {
    
      // Navigation Tab
      var tabli = $("<li/>").appendTo(".nav-tabs");
      var tablia = $("<a/>", {
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
        "class": "category tab-pane"
      }).appendTo(".tab-content");
      
      // Get Auth Token
      var authenticity_token = $("<input/>", {
        "name": "authenticity_token",
        "value": getAuthToken(),
        "type": "hidden"
      }).appendTo(category);
      
      // Category Name : category-[cat]
      var category_name = $("<input/>", {
        "class": "category-name",
        "value": val.name,
        "type" : "hidden"
      }).appendTo(category);
      
      // Step Group
      var step_group = $("<div/>", {
        "class": "step-group"
      }).appendTo(category);
      
      // Button: Add Step
      $("<button/>", {
        "class": "btn btn-default add-step",
        "type": "button",
        html: "Add Step"
      }).appendTo(category);
      
      $("<hr>").appendTo(category);
      
      // Final Step
      $("<h3/>", {
        html: "Final Step"
      }).appendTo(category);
      $("<textarea/>", {
        "name": "prompt",
        "class": "form-control",
        "placeholder": "Prompt the customer for commission specification....",
        "html": val.prompt
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
      
      /* LOOP THROUGH EACH STEP */
      $.each(val.steps, function(key, val) {
      
        // Step Container
        var step_container = $("<div/>", {
          "class": "step-container"
        }).appendTo(step_group);
        
        // Step Heading
        var step_heading = $("<div/>", {
          "class": "step-heading well",
          "data-toggle": "collapse"
        }).appendTo(step_container);
        
        // Step Title
        $("<span/>").appendTo(step_heading);
        
        // Button: Step Removal
        $("<button/>", {
          "type": "button",
          "class": "close remove-step",
          html: "&times;"
        }).appendTo(step_heading);
        
        // Step
        var step = $("<div/>", {
          "class": "step collapse"
        }).appendTo(step_container);
        
        // Step Name : step-[cat]-[step]
        var step_name = $("<div/>", {
          "class": "form-group"
        }).appendTo(step);
        $("<label/>", {
          "class": "step-name-label sr-only",
          html: "Step Name"
        }).appendTo(step_name);
        $("<input/>", {
          "class": "form-control input-lg step-name",
          "type": "text",
          "placeholder": "Step Name",
          "value": val.name
        }).appendTo(step_name);
        
        // Option Group
        var option_group = $("<div/>", {
          "class": "option-group"
        }).appendTo(step);
        
        add_step_utilities(step);
        
        /* LOOP THROUGH EACH OPTION */
        $.each(val.options, function(key, val) {
        
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
            "class": "option-name-label sr-only",
            html: "Option Name"
          }).appendTo(option_name);
          $("<input/>", {
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
            "class": "option-thumb-label",
            html: "Example:"
          }).appendTo(option_thumb);
          $("<input/>", {
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
            "class": "option-price-label sr-only",
            html: "Price:"
          }).appendTo(option_price);
          $("<span/>", {
            "class": "input-group-addon",
            html: "$"
          }).appendTo(option_price);
          $("<input/>", {
            "class": "form-control option-price",
            "type": "text",
            "placeholder": 'Price (e.g. "10.00")',
            "value": val.price
          }).appendTo(option_price);
          
          $("<br>").appendTo(panel_body);
          
          // Option Description : option-[cat]-[step]-[opt]-description
          $("<textarea/>", {
            "class": "form-control option-description",
            "placeholder": "Enter a description...",
            html: val.description
          }).appendTo(panel_body);
        });
      });
    });
    
    // Button: New Category
    var tabli = $("<li/>").appendTo(".nav-tabs");
    var tablia = $("<a/>").appendTo(tabli);
    $("<span/>", {
      "class": "cat-name add-category",
      html: "New Category"
    }).appendTo(tablia);
  }
  
  // Update all the dynamic element attributes on the page after manipulation
  function update_dynamics() {
    // navigation tabs
    $.each($(".nav-tabs").find("a"), function(tabkey, tab) {
      $(tab).attr("href", "#category-" + tabkey);
    });
    // remove live anchor from "New Category" button; it causes chaos
    $(".nav-tabs").find("a").last().removeAttr("href");
    
    /* LOOP THROUGH EACH CATEGORY */
    $.each($(".category"), function(catkey, category) {
      // category id
      $(category).attr("id", "category-" + catkey);
      
      // INPUT: category name
      $(category).find($(".category-name")).attr("name", "category-" + catkey);
      
      // step group id
      $(category).find($(".step-group")).attr("id", "accordion-" + catkey);
      
      /* LOOP THROUGH EACH STEP */
      $.each($(category).find($(".step-container")), function(stepkey, step) {
        // step heading data parent
        $(step).find($(".step-heading")).attr("data-parent", "#accordion-" + catkey);
        
        // step heading href (collapse controller)
        $(step).find($(".step-heading")).attr("href", "#" + catkey + "-" + stepkey);
        
        // step heading (span) html
        $(step).find($(".step-heading")).children("span").html("STEP " + (stepkey+1));
        
        // step id (collapse element)
        $(step).find($(".step")).attr("id", catkey + "-" + stepkey);
        
        // step name label
        $(step).find($(".step-name-label")).attr("for", "step-" + catkey + "-" + stepkey);
        
        // step name id
        $(step).find($(".step-name")).attr("id", "step-" + catkey + "-" + stepkey);
        
        // INPUT: step name
        $(step).find($(".step-name")).attr("name", "step-" + catkey + "-" + stepkey);
        
        // option group id
        $(step).find($(".option-group")).attr("id", "option-group-" + catkey + "-" + stepkey);
        
        /* LOOP THROUGH EACH OPTION */
        $.each($(step).find($(".option")), function(optkey, option) {
          // option name label
          $(option).find($(".option-name-label")).attr("for", "option-" + catkey + "-" + stepkey + "-" + optkey + "-name");
          
          // option name id
          $(option).find($(".option-name")).attr("id", "option-" + catkey + "-" + stepkey + "-" + optkey + "-name");
          
          // INPUT: option name
          $(option).find($(".option-name")).attr("name", "option-" + catkey + "-" + stepkey + "-" + optkey + "-name");
          
          // option thumbnail label
          $(option).find($(".option-thumb-label")).attr("for", "option-" + catkey + "-" + stepkey + "-" + optkey + "-thumb");
          
          // option thumbnail id
          $(option).find($(".option-thumb")).attr("id", "option-" + catkey + "-" + stepkey + "-" + optkey + "-thumb");
          
          // INPUT: option thumbnail
          $(option).find($(".option-thumb")).attr("name", "option-" + catkey + "-" + stepkey + "-" + optkey + "-thumb");
          
          // option price label
          $(option).find($(".option-price-label")).attr("for", "option-" + catkey + "-" + stepkey + "-" + optkey + "-price");
          
          // option price id
          $(option).find($(".option-price")).attr("id", "option-" + catkey + "-" + stepkey + "-" + optkey + "-price");
          
          // INPUT: option price
          $(option).find($(".option-price")).attr("name", "option-" + catkey + "-" + stepkey + "-" + optkey + "-price");
          
          // INPUT: option description
          $(option).find($(".option-description")).attr("name", "option-" + catkey + "-" + stepkey + "-" + optkey + "-description");
        });
      });
    });
  }
  
  // Unbinds all event handlers and binds each interactive UI
  // element with a single event handler.
  //   (this avoids multiple binds on any element)
  function rebind_events() {
    // Rebind Add Category
    $(".add-category").unbind();
    $(".add-category").click(function() {
      add_category(this);
      rebind_events();
      update_dynamics();
    });
    // Rebind Add Step
    $(".add-step").unbind();
    $(".add-step").click(function() {
      add_step($(this).prev());
      rebind_events();
      update_dynamics();
    });
    
    // Rebind Add Option
    $(".add-option").unbind();
    $(".add-option").click(function() {
      add_option($(this).prev());
      rebind_events();
      update_dynamics();
    });
    
    // Rebind Remove Category
    $(".remove-category").unbind();
    $(".remove-category").click(function() {
      var r = confirm("Are you sure you want to remove this category?");
      if (r) {
        $($(this).parent().attr("href")).remove(); // remove form content
        $(this).parent().parent().remove(); // remove tab
        update_dynamics();
      }
    });
    
    // Rebind Remove Step
    $(".remove-step").unbind();
    $(".remove-step").click(function() {
      $(this).parent().parent().remove();
      update_dynamics();
    });
    
    // Rebind Remove Option
    $(".remove-option").unbind();
    $(".remove-option").click(function() {
      $(this).parent().parent().remove();
      update_dynamics();
    });
  }
  
  // Adds a new category, including both navigation tab and
  // form body. Creates one step with one option inside.
  function add_category(frame) {
    var cat_name = prompt("New Category:");
    if (!cat_name) return;
    
    var tabli = $("<li/>").insertBefore($(frame).parent().parent());
    var tablia = $("<a/>", {
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
      "class": "category tab-pane"
    }).appendTo(".tab-content");
    
    // Get Auth Token
    var authenticity_token = $("<input/>", {
      "name": "authenticity_token",
      "value": getAuthToken(),
      "type": "hidden"
    }).appendTo(category);
    
    // Category Name : category-[cat]
    var category_name = $("<input/>", {
      "class": "category-name",
      "value": cat_name,
      "type" : "hidden"
    }).appendTo(category);
    
    // Step Group
    var step_group = $("<div/>", {
      "class": "step-group"
    }).appendTo(category);
    
    add_step(step_group);
    
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
      "data-toggle": "collapse"
    }).appendTo(step_container);
    
    // Step Title
    $("<span/>").appendTo(step_heading);
    
    // Button: Step Removal
    $("<button/>", {
      "type": "button",
      "class": "close remove-step",
      html: "&times;"
    }).appendTo(step_heading);
    
    // Step
    var step = $("<div/>", {
      "class": "step collapse"
    }).appendTo(step_container);
    
    // Step Name : step-[cat]-[step]
    var step_name = $("<div/>", {
      "class": "form-group"
    }).appendTo(step);
    $("<label/>", {
      "class": "step-name-label sr-only",
      html: "Step Name"
    }).appendTo(step_name);
    $("<input/>", {
      "class": "form-control input-lg step-name",
      "type": "text",
      "placeholder": "Step Name"
    }).appendTo(step_name);
    
    var option_group = $("<div/>", {
      "class": "option-group"
    }).appendTo(step);
    
    add_option(option_group);
    
    add_step_utilities(step);
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
      "class": "option-name-label sr-only",
      html: "Option Name"
    }).appendTo(option_name);
    $("<input/>", {
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
      "class": "option-thumb-label",
      html: "Example:"
    }).appendTo(option_thumb);
    $("<input/>", {
      "class": "option-thumb",
      "type": "file"
    }).appendTo(option_thumb_label);
    $("<img/>", {
      "class": "img-thumbnail pull-left",
      "src": "http://terryshoemaker.files.wordpress.com/2013/03/placeholder1.jpg"
    }).appendTo(option_thumb_label);
    
    // Option Price
    var option_price = $("<div/>", {
      "class": "input-group"
    }).appendTo(panel_body);
    $("<label/>", {
      "class": "option-price-label sr-only",
      html: "Price:"
    }).appendTo(option_price);
    $("<span/>", {
      "class": "input-group-addon",
      html: "$"
    }).appendTo(option_price);
    $("<input/>", {
      "class": "form-control option-price",
      "type": "text",
      "placeholder": 'Price (e.g. "10.00")'
    }).appendTo(option_price);
    
    $("<br>").appendTo(panel_body); 
    
    // Option Description
    $("<textarea/>", {
      "class": "form-control option-description",
      "placeholder": "Enter a description..."
    }).appendTo(panel_body);
  }
})(jQuery);