class CommissionsController < ApplicationController
	def show
		@commission = Commission.find(params[:id])
	end

	def new
		@artist = User.find(params[:artist_id])
	end
end
