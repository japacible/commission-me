class Commission < ActiveRecord::Base
  attr_accessor :state, :commissioner_id, :artist_id, :commission_current
  belongs_to :artist, :class_name => User
  belongs_to :commissioner, :class_name => User
  has_one :commission_request, :class_name => CommissionRequest, :foreign_key =>
    "commission_id"
end
