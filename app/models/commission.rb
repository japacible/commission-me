class Commission < ActiveRecord::Base
	belongs_to :artist, :class_name => User
	belongs_to :commissioner, :class_name => User
end
