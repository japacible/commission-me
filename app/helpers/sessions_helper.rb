module SessionsHelper
	#The main sign in user functionality
	#This function handles cookie/session user memorization so that
	#the user can be called upon later via current_user
	def sign_in(user, remember_me)
		remember_token = User.new_remember_token
		if remember_me
			cookies.permanent[:remember_token] = remember_token
		else
			cookies[:remember_token] = nil
			session[:remember_token] = remember_token
		end
		user.remember_token = User.encrypt(remember_token)
		user.save
		@current_user = user
	end
	def sign_out(user)
		cookies.permanent[:remember_token] = nil
		session[:remember_token] = nil
	end
	def current_user=(user)
		@current_user = user
	end

	#Retreives the current user
	#Depending on whether the user specified to be remembered, this
	#may retreive the user's remember token from the sessions or the cookies
	def current_user
		token = cookies[:remember_token]
		if token.nil? or token.empty?
			token = session[:remember_token]
		end	
		remember_token = User.encrypt(token)
		
		@current_user ||= User.find_by(:remember_token => remember_token)
	end
end
