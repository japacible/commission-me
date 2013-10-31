class User < ActiveRecord::Base
	attr_accessible :name, :email, :password, :password_confirmation
	has_many :arts	
	has_many :received_commissions, :class_name => "Commission", :foreign_key => "artist_id"
	has_many :requested_commissions, :class_name => "Commission", :foreign_key => "commissioner_id" 
	has_secure_password

	validates_uniqueness_of :email
	validates_presence_of :email
	validates_presence_of :password, :on => :create	

	def get_featured_art
		arts.first
	end
end
