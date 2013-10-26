class User < ActiveRecord::Base
  has_one :username
  has_one :f_name
  has_one :l_name
end
