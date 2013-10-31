class AddUserIdToArts < ActiveRecord::Migration
  def change
    add_column :arts, :user_id, :integer
  end
end
