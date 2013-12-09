class ArtsController < ApplicationController
	before_filter :verify_logged_in
  
  #Controller for user's sample art
  #This is the art that is displayed on the user's profile page
  #it is not directly related to commissions

  #Shows a particular piece of art
  def show
		@art = Art.find(params[:id])
	end
  
  #Action for adding profile art to a user's profile
  def new
     
  end

  #Supports image location or uploading image
  def create 
    #Set up location and create image if necessary
    if params[:upload_image] == "1" 
      @image = Image.new do |t|
        t.data = params["picture"].read
        t.filename = params["picture"].original_filename
        t.file_type = params["picture"].content_type
        t.artist_id = current_user.id
      end
      if !@image.save
        redirect_back "Unable to upload image."
        return
      end 
      location = serve_image_path :id => @image.id
    else
      location = params[:location]
    end
    #Create actual art object
    @art = Art.new do |art|
      art.user_id = current_user.id
      art.location = location
      art.description = params[:description]
      art.tags = params[:tags]
      art.title = params[:title]
    end
    if @art.save
      flash[:notice] = "Art saved successfully"
    else
      flash[:alert] = "Error saving art"
    end
    redirect_to arts_path
  end

  #def edit
  #  
  #end

  #def update
  #
  #end
  
  def destroy
    @art = Art.find(params[:id])
    if @art && (@art.user_id == current_user.id)
      title = @art.title
      if @art.destroy
        redirect_to arts_path, :notice => "#{title} successfuly deleted."
        return
      end
    end
    redirect_back "Unable to destroy #{@art.title}"
  end

  #Displays user's profile art
	def index
    @arts = current_user.arts
	end
end
