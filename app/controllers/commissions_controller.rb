class CommissionsController < ApplicationController
  def show
    @commission = Commission.find(params[:commission_id])
  end

  def review
    @commission = Commission.find(params[:commission_id])
    @artist = User.find(@commission.artist_id)
    @json = @commission.commission_current
  end
  
  def requests
    #TODO: check for current_user == nil, route to login/signup?
    @user = current_user
  end

  def edit
    @artist = User.find(params[:artist_id])
    @json = User.find(params[:artist_id]).commission_request_template_json
  end

  def create
    @template = User.find(params[:artist_id]).commission_request_template_json
    @user = current_user
    json = build_json_from_params
    @commission = Commission.new do |t|
      t.state = "NewRequest"
      t.artist_id = params[:artist_id]
      t.commissioner_id = @user.id
      t.commission_current = json
    end
    if @commission.save
      @commission_request = CommissionRequest.new do |req|
        req.commission_id = @commission.id
        req.commission_current = json
      end
      if @commission_request.save
        flash[:alert] = "Commission successfully sent!"
        redirect_to root_url
      else
        @commission.delete
        for message in @commission_request.errors.full_messages do
          if i == 0
            flash[:alert] = message
            i = 1
          else
            flash[:alert] << ", " + message
          end
        end
      end
    else
      i = 0
      for message in @commission.errors.full_messages do
        if i == 0
          flash[:alert] = message
          i = 1
        else
          flash[:alert] << ", " + message
        end
      end
    end
  end

  def accept
    @commission = Commission.find(params[:commission_id])
    @commission.state = "Accepted"
    @commission.save
    flash[:alert] = "Commission Accepted!"
    redirect_to root_url
    #TODO: redirect to commissions list instead
  end
  
  def decline
    @commission = Commission.find(params[:commission_id])
    @commission.state = "Declined"
    @commission.save
    flash[:alert] = "Commission Declined!"
    redirect_to root_url
    #TODO: redirect to commissions list instead
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
      elsif k.starts_with? "final"
        blob["final"] = v;
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
