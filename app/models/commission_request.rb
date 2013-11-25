class CommissionRequest < ActiveRecord::Base
  attr_accessor :commission_current, :commission_previous
  belongs_to :commission, :class_name => Commission
end
