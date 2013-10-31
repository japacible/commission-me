class CommissionsController < ApplicationController
	def show
		@commission = Commission.find(params[:id])
	end
end
