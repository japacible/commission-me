class AddPaypalEmailToUserModel < ActiveRecord::Migration
  def change
    add_column :users, :paypal_email, :string
  end
end
