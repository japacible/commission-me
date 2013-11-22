class AddCommissionsTemplateToUsers < ActiveRecord::Migration
  def change
    remove_column :users, :commission_request_template
    add_column :users, :commission_request_template_json, :json
  end
end
