class CommissionsController < ApplicationController
  before_filter :verify_logged_in
  def show
    @commission = Commission.find(params[:commission_id])
  end

  def review
    @commission = Commission.find(params[:commission_id])
    @artist = User.find(@commission.artist_id)
    @json = @commission.commission_current
  end

  def requests
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
      flash[:notice] = "Commission successfully sent!"
      redirect_to root_url
    else
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
    if current_user.id == @commission.artist_id
      @commission.state = "Accepted"
      @commission.save
      flash[:notice] = "Commission Accepted!"
      redirect_to commissions_requests_path
    end
  end
  
  def catch_post_review
    switch = params[:post]
    if switch == "Decline"
      decline()
    else    
      @commission = Commission.find(params[:commission_id])
      @commission.state = "Review"
      @json = @commission.commission_current
      @json["price"] = params[:price]
      @json["review"] = [params[:review]]
      @commission.commission_current = @json
      @commission.save
      flash[:notice] = "Commission up for revision!"
      redirect_to commissions_requests_path
    end
  end

  def decline
    @commission = Commission.find(params[:commission_id])
    if current_user.id == @commission.artist_id
      @commission.state = "Declined"
      if @commission.commission_current["review"].nil?
        @commission.commission_current["review"] = [params[:review]]
      else
        @commission.commissions_current["review"] << params[:review]
      end
      @commission.save
      flash[:notice] = "Commission Declined!"
      redirect_to commissions_requests_path
    end
  end

  def progress
    @commission = Commission.find(params[:commission_id])
    @artist = User.find(@commission.artist_id)
    @json = @commission.commission_current
  end

  def finish
    @commission = Commission.find(params[:commission_id])
    @commission.state = "In Progress"
    if @commission.save
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
    flash[:notice] = "Commission Finalized!"
    redirect_to commissions_requests_path
  end

  def complete

  end

private
  def testing
    flash[:alert] = @template["categories"][0]["steps"]
  end

  def build_json_from_params
    blob = {}
    i = 0
    category_blob = {}
    price = 0
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
        price += blob_step["choice"]["price"].to_i
        blob["steps"] << blob_step      
      elsif k.starts_with? "final"
        blob["spec"] = [v];
      end
    end
    blob["price"] = price
    blob["review"] = []
    return blob
  end

  def category_number(string)
    return string.split('-',5)[1].to_i
  end

  def step_number(string)
    return string.split('-',5)[2].to_i
  end
end
