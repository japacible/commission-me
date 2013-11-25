class CommissionsController < ApplicationController
  def show
    @commission = Commission.find(params[:id])
  end
  
  #def new
  #  @artist = User.find(params[:artist_id])
  #  @commission = Commission.new
  #end

  def edit
    @artist = User.find(params[:artist_id])
    @json = User.find(params[:artist_id]).commission_request_template_json
  end

  def create
    #TODO: create new commission request
    @template = User.find(params[:artist_id]).commission_request_template_json
    @commission = Commission.new do |t|
      t.state = "NewRequest"
      t.artist_id = params[:artist_id]
      t.commissioner_id = params[:commissioner_id]
      #TODO: t.commission_current = ?
    end
    #flash[:alert] = ""
    #params.each do |k,v|
    #  flash[:alert] << "$$$  " + k + " --- " + v
    #end
    blob_test = build_json_from_params
    flash[:alert] = blob_test
    #hash["categories"] = [ build_json_from_params ]
    #@commission.commission_current = hash
    #flash[:alert] = ""
    #if @commission.save
    #  flash[:alert] << "Commission successfully sent!"
    #  #redirect to?
    #else
    #  i = 0
    #  for message in @commission.errors.full_messages do
    #    if i == 0
    #      flash[:alert] << message
    #      i = 1
    #    else
    #      flash[:alert] << ", " + message
    #    end
    #  end
      #redirect to?
    #end
    redirect_to root_url
  end

  def accept
    @commission.state = "Accepted"
    #TODO: Deletion of associated commission request
  end
  
  def decline
    @commission.state = "Declined"
    #TODO: Deletion of associated commission request
  end

  def finish
    @commission.state = "Finished"
  end

private
  def testing
    flash[:alert] = @template["categories"][0]["steps"]
  end

  def build_json_from_params
    blob = {}
    i = 0
    category_blob = {}
    params.each do |k, v|
      if k.starts_with? "option"
        if i == 0
          category = category_number(k)
          category_blob = @template["categories"][category]
          blob["name"] = "Commission from " + current_user.name + " for " +
            category_blob["name"]
          blob["steps"] = []
          i = 1
        end
        blob_step = {}
        num = step_number(k)
        choice_num = v.to_i
        blob_step["name"] = category_blob["steps"][num]["name"]
        blob_step["choice"] = category_blob["steps"][num]["options"][choice_num]
        blob["steps"] << blob_step
      end
    end
    return blob
  end

  def category_number(string)
    return string.split('-',5)[1].to_i
  end

  def step_number(string)
    return string.split('-',5)[2].to_i
  end
end
