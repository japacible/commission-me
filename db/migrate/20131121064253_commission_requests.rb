class CommissionRequests < ActiveRecord::Migration
  def change
    create_table :commission_requests do |t|
      t.json :commission_current
      t.json :commission_previous
      t.timestamps
      t.belongs_to :commission, :class_name => Commission
    end
  end
end
