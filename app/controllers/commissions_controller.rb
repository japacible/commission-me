class CommissionsController < ApplicationController
  def show
    @commission = Commission.find(params[:id])
  end
  
  def new
    @artist = User.find(params[:artist_id])
    @commission = Commission.new
  end

  def create
    #TODO: create new commission request
    @commission = Commission.new do |t|
      t.state = "NewRequest"
      t.artist_id = params[:artist_id]
      t.commissioner_id = params[:commissioner_id]
      #TODO: t.commission_current = ?
    end
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
