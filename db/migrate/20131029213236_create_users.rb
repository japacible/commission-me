class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :password_digest
      t.has_many :arts
      t.has_many :commissions
      t.timestamps
    end
  end
end
