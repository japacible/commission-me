class User < ActiveRecord::Base
	attr_accessible :name, :email, :password, :password_confirmation, :remember_token
	has_many :arts	
	has_many :received_commissions, :class_name => "Commission", :foreign_key => "artist_id"
	has_many :requested_commissions, :class_name => "Commission", :foreign_key => "commissioner_id" 
	has_secure_password
	before_create :create_remember_token
  	validates_format_of :name, :with => /\A[\w \-\xC0-\xFF]+\z/
	validates_uniqueness_of :email
	validates_presence_of :email
	validates_format_of :email, :with => /.+@.+\..+/i
	validates_presence_of :password, :on => :create	

	def get_featured_art
		arts.first
	end
	
	
	#Returns the URL of the highest rated featured image or a default image if no art by this user exists
	#Currently just returns the first art	
	def masterpiece
		if arts.empty?
			"BioCorgi.jpg"
		else
			arts.first.location
		end
	end


	def User.new_remember_token
		SecureRandom.urlsafe_base64
	end

	def User.encrypt(token)
		Digest::SHA1.hexdigest(token.to_s)
	end

        private 
 
                def create_remember_token 
                        self.remember_token = User.encrypt(User.new_remember_token)
                end 


end
