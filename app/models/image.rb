class Image < ActiveRecord::Base
  attr_accessible :filename, :data, :file_type
end
