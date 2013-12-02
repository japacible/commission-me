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
    hash = @user.commission_request_template_json 
    json = build_json_from_params 
    #Add new/updated category (json) to hash 
    add_category hash, json
    @user.commission_request_template_json = nil
    @user.save
    @user.commission_request_template_json = hash
    if @user.save
      flash[:notice] = "Commission Template Saved!"  #+@user.commission_request_template_json.to_s
    else
      flash[:alert] = "Error Saving Template"
    end 
    redirect_to root_url
  end


  private
    #Builds a JSON object from the params hash
    #This depends on a specific naming convention
    def build_json_from_params
      blob = {}
      blob["name"] = params["cat_name"]
      blob["steps"] = []
      get_steps.each do |step|
        blob_step = {}
        blob_step["name"] = step[1]
        blob_step["options"] = get_options(step)    
        blob["steps"] << blob_step
      end
      return blob
    end

    #Returns a list of steps (step number, step name) from the params hash
    def get_steps
      steps = []
      params.each do |k,v|
        if k.starts_with? "step"
          name = v
          num = step_number(k)
          steps << [num,name]
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
          if step_number(k) == step[0]
            opt_name = k.split('-',5)[4]
            opt_val = v
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
    def step_number(string)
      return string.split('-',5)[2].to_i
    end

    #Intended for use with option strings
    #Returns the option number for a given string
    def option_number(string)
      return string.split('-',5)[3].to_i
    end

    #Adds the specified json category to the given hash(map)
    #If a category with json["name"] already exists, this will overrwrite it
    #Otherwise it will append it
    def add_category(hash, json) 
      found = false
      hash["categories"].each_with_index do |cat,index|
        if cat["name"] == json["name"]
          hash["categories"][index] = json;
          found = true 
        end
        break if found = true
      end
      #If we finished the loop without finding a same-name category,
      #append the new category
      if !found
        hash["categories"] << json
      end
    end
end
