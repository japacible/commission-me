class AddImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :filename
      t.binary :data
      t.string :file_type
      t.timestamps
    end
  end
end
