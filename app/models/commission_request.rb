class CommissionRequest < ActiveRecord::Base
  belongs_to :commission, :class_name => Commission
end
