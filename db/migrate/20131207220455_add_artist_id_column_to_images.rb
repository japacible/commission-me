class AddArtistIdColumnToImages < ActiveRecord::Migration
  def change
    add_column :images, :artist_id, :integer
  end
end
