require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "at least one user exists" do
    assert User.all.count > 0
  end

  test "user named eddy exists in db" do
    assert User.all.pluck(:name).include?("eddy")
  end

  test "user named eddy has at least one work of art" do
   
    assert User.find_by_name("eddy").arts.count > 0, "Eddy should have at least one art"
  end
end
