class CreateFakeUsers < ActiveRecord::Migration
  def change
    create_table :fake_users do |t|
      t.string :name
      t.string :email

      t.timestamps
    end
  end
end
