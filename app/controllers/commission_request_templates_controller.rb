#this controller exists for controlling the blob of stuff that represents
#an artist's commission request template
class CommissionRequestTemplatesController < ApplicationController
  #Should eventually be removed (all artists start with a 
  #default template)
  def new
    
  end
  
  #Renders a view
  def edit
    @json = current_user.commission_request_template_json
  end

  #Receives post data
  #This method is full of debug alerts because it has a strange problem
  #for some reason commissio nrequest tempalte updates are not being properly updated
  def update
    #flash[:message] = build_json_from_params
    @user = current_user
    if @user.commission_request_template_json.nil? 
      @user.commission_request_template_json = {"categories" => []}.to_json
    end
    hash = @user.commission_request_template_json 
    hash["categories"] = [ build_json_from_params ] #Use Currently overrides all categories
    str = hash
    @user.commission_request_template_json = str
    flash[:message] = @user.commission_request_template_json
        
    #@user.save
    if @user.save
      flash[:alert] = "JSON saved successfully, json="+@user.commission_request_template_json.to_s
    else
      flash[:alert] = "Error saving json"
    end
    sleep 8
    redirect_to root_url
  end


  private
    #Builds a JSON object from the params hash
    #This depends on a specific naming convention
    def build_json_from_params
      blob = {}
      blob["name"] = "default_category"
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
    def step_number(string)
      return string.split('-',5)[2].to_i
    end

    #Intended for use with option strings
    def option_number(string)
      return string.split('-',5)[3].to_i
    end

end
