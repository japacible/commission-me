class UsersController < ApplicationController
  include SessionsHelper

  def index
	@users = User.all
  end
  def new
  	@user = User.new
  end

  def edit
	@user = User.find(params[:id])
	if @user != current_user
		redirect_to root_url, :alert => "You must be logged in to edit your profile"
	end
  end

  def update
	@user = User.find(params[:id])
	if @user.update_attributes(params[:user])
		redirect_to root_url
	else
          if @user.errors.any?
            flash[:alert] = ""
            i = 0
            for message in @user.errors.full_messages do
              if i == 0 
                flash[:alert] << message
                i = 1
              else
                flash[:alert] << ", "+message
              end
            end
          end
          redirect_to :action => 'edit'
	end
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
		do_login(params[:email], params[:password])
	else
		#TODO Make this re-render the page without a complete redirect so that
		#email and password stay filled out
		#Employ model's confirmation checking and display its errors instead of generating here
		if @user.errors.any?
                  flash[:alert] = ""
                  i = 0
                  for message in @user.errors.full_messages do
                    if i == 0 
                      flash[:alert] << message
                      i = 1
                    else
                      flash[:alert] << ", "+message
                    end
                  end
		else
                  flash[:alert] = "Invalid fields"
		end 	
          redirect_to :action => "authenticate"
	end
  end

  def authenticate
	if(current_user)
		redirect_to root_url, :alert => "Already logged in."
	end
  end

  def login
	remember_me = false
	if params[:remember_me]
		remember_me = true
	end
	do_login(params[:email], params[:password],remember_me )
  end

  def logout
	do_logout(current_user)
  end


  private
  #The actual functionality of logging in the user
  #If this fails for any reason, the user will not be logged in and will instead be redirected back to the authenticate page
  def do_login(email, password, remember_me=false)
	user = User.find_by_email(email)
	if user && user.authenticate(password)
		sign_in(user, remember_me)
		redirect_to root_url
	else
		flash.now.alert = "Invalid email or password"
		redirect_to :action => "authenticate"
	end
  end

  def do_logout(user)
	sign_out(user)
	redirect_to root_url, :notice => "Logged out user: "+user.name
  end

  def user_params
	params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
