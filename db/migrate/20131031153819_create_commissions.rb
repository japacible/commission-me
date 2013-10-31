class CreateCommissions < ActiveRecord::Migration
  def change
    create_table :commissions do |t|
      t.text :request_form
      t.text :revision_request
      t.time :closed_date
      t.text :state
      t.belongs_to :commissioner, :class_name => User
      t.belongs_to :artist, :class_name => User
      t.timestamps
    end
  end
end
