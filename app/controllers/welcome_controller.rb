class WelcomeController < ApplicationController
	def index
		@featured_users = User.all
	end
end
