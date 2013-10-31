class ArtsController < ApplicationController
	def show
		@art = Art.find(params[:id])
	end

	def index
	end
end
