class UsersController < ApplicationController
  def new
  	@user = User.new
  end
  def show
	@user = User.find(params[:id])
  end
  def create
	@user = User.new do |t|
		t.name = params[:name]
		t.email = params[:email]
		t.password = params[:password]
		t.password_confirmation = params[:password_confirmation]
	end
	if @user.save
		redirect_to root_url, :notice => "Signed up!"
	else
		#TODO Make this re-render the page without a complete redirect so that
		#email and password stay filled out
		#Employ model's confirmation checking and display its errors instead of generating here
		redirect_to new_session_path, :notice => "Invalid fields"
	end
  end
end
