class User < ActiveRecord::Base
	attr_accessible :email, :password, :password_confirmation
	has_many :arts	
	has_many :commissions
	has_secure_password

	validates_uniqueness_of :email
	validates_presence_of :email
	validates_presence_of :password, :on => :create	
end
