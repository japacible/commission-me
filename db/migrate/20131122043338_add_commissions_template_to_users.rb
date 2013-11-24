class AddCommissionsTemplateToUsers < ActiveRecord::Migration
  def change
    add_column :users, :commission_request_template_json, :json
  end
end
