class CommissionsController < ApplicationController
  def show
    @commission = Commission.find(params[:id])
  end
  
  def new
    @artist = User.find(params[:artist_id])
    @commission = Commission.new
  end

  def edit
    @json = User.find(params[:artist_id]).commission_request_template_json
  end

  def create
    #TODO: create new commission request
    @commission = Commission.new do |t|
      t.state = "NewRequest"
      t.artist_id = params[:artist_id]
      t.commissioner_id = params[:commissioner_id]
      #TODO: t.commission_current = ?
    end
    hash["categories"] = [ build_json_from_params ]
    @commission.commission_current = hash
    flash[:alert] = ""
    if @commission.save
      flash[:alert] << "Commission successfully sent!"
      #redirect to?
    else
      i = 0
      for message in @commission.errors.full_messages do
        if i == 0
          flash[:alert] << message
          i = 1
        else
          flash[:alert] << ", " + message
        end
      end
      #redirect to?
    end
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
end
