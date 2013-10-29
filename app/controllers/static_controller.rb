class StaticController < ApplicationController
	def generic
		respond_to do |format|
			format.html
		end
	end

	def index
	end
end
