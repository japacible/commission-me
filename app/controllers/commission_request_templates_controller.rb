#this controller exists for controlling the blob of stuff that represents
#an artist's commission request template
class CommissionRequestTemplatesController < ApplicationController
  #Should eventually be removed (all artists start with a 
  #default template)
  before_filter :verify_logged_in
  def new
    
  end
  
  #Renders a view
  def edit
    @user = current_user
    if @user.nil?
      redirect_to authenticate_path
    else
      @json = @user.commission_request_template_json
    end
  end

  #Receives post data and attempts to update the user's commission
  #request tempalate json
  def update
    @user = current_user
    if @user.commission_request_template_json.nil? 
      @user.commission_request_template_json = {"categories" => []}.to_json
    end
    json = build_json_from_params  
    @user.commission_request_template_json = nil
    @user.save
    @user.commission_request_template_json = json
    if @user.save
      flash[:notice] = "Commission Template Saved!"
    else
      flash[:alert] = "Error Saving Template"
    end 
    redirect_to root_url
  end

  private
    #Builds a JSON object from the params hash
    #This depends on a specific naming convention
    def build_json_from_params 
      #Construct array for holding categories
      arr = [] 
      get_categories.each do |cat|      #Meow
        #For each category create a map {}
        new_cat = {}
        new_cat["name"] = cat[0]
        new_cat["steps"] = []
        get_steps(cat).each do |step|
          #For each step create a map {}
          new_cat_step = {}
          new_cat_step["name"] = step[2]
          #get options returns a list of maps of options
          new_cat_step["options"] = get_options(step)    
          new_cat["steps"] << new_cat_step
        end 
        arr << new_cat
      end
      json = {"categories" => arr, "prompt" => params[:prompt]}
      return json
    end
    
    #Returns a list of categories (cat name, cat number) from the params hash
    def get_categories
      cats = []
      params.each do |k,v|
        if k.starts_with? "category"
          name = v
          num = cat_number(k) 
          cats << [name,num]
        end
      end
      return cats
    end


    #Returns a list of steps (category number, step number, step name) 
    #from the params hash for the given (category name, category number) pair
    def get_steps(category)
      steps = []
      params.each do |k,v|
        if (k.starts_with? "step") && (cat_number(k) == category[1])
          name = v
          num = step_number(k)
          steps << [cat_number(k),num,name]
        end
      end
      return steps
    end
   
    #Returns a list of maps of option name-value pairs
    #[{opt_key => opt_val, opt_key2 => opt_val2}, {opt_key => opt_val}]
    #step is a (num, name pair)
    def get_options(step)
      options = []
      params.each do |k,v|
        if k.starts_with? "option"
          if (step_number(k) == step[1]) && (cat_number(k) == step[0])
            opt_name = k.split('-',5)[4] 
            if opt_name == "thumb" 
              opt_val = build_image k,v  
            elsif opt_name == "thumb-id"
              #In case we (A) Do have an image and (B) Do not have an updated
              #one to use, the id will still be posted so we need to make sure
              #we add it to the new JSON
              opt_name = "thumb"
              opt_val = v
              next if(v.nil? || v.empty?) 
            else
              opt_val = v
            end
            opt_option_num = option_number(k)
            if options[opt_option_num].nil? 
              options[opt_option_num] = {}
            end
            options[opt_option_num][opt_name] = opt_val
          end
        end
 
      end
      return options
    end

    #Intended for use with option strings
    #Returns the step number for a given string
    def cat_number(string)
      return string.split('-',5)[1].to_i
    end

    #Intended for use with option strings
    #Returns the step number for a given string
    def step_number(string)
      return string.split('-',5)[2].to_i
    end

    #Intended for use with option strings
    #Returns the option number for a given string
    def option_number(string)
      return string.split('-',5)[3].to_i
    end
    
    #Constructs an image with the given data
    #param key: the parameter key. The way the form is set up, an additional
    #           parameter will be passed if the image already existed, allowing
    #           us to update it instead of rewrite
    #param data: the data to construct the image from
    #returns: an ID for finding the image
    def build_image(key,data) 
      #TODO check for existing image ID and just update it if it exists
      exst_id = get_image_id(key)
      if (exst_id != nil) && (exst_id != "")
        image = Image.find(exst_id)  
      else 
        image = Image.new
      end
      if data.nil? 
        return exst_id
      end
      image.data = data.read
      image.filename = data.original_filename
      image.file_type = data.content_type
      image.artist_id = current_user.id 
      if image.save 
        return image.id
      else
        return exst_id
      end
    end

    #Attempts to retreive the associated image id with the given image key
    #image key is an option, ie "option-x-x-x-thumb"
    #if an associated key is found, it will be returned
    #otherwise returns nil
    def get_image_id(key)
      id_key = "#{key}-id"
      return params[id_key]
    end
end
