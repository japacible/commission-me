class CreateArts < ActiveRecord::Migration
  def change
    create_table :arts do |t|
      t.string :author_name
      t.integer :featured
      t.text :description
      t.text :tags
      t.string :location
      t.belongs_to :user

      t.timestamps
    end
  end
end
