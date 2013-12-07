class ImagesController < ApplicationController

  def show
    @image = Image.find(params[:id])
  end
  
  def new
    @image = Image.new
  end

  def serve
    @image = Image.find(params[:id])
    send_data(@image.data, :type => @image.file_type, :disposition => "inline")
  end
end
