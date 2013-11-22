class ReformatCreateCommissions < ActiveRecord::Migration
  def change
    add_column :commissions, :commission_current, :json
    remove_column :commissions, :request_form
    remove_column :commissions, :revision_request
    remove_column :commissions, :closed_date
    remove_column :commissions, :commission_request_data
  end
end
