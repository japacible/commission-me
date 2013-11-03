require 'test_helper'

class ArtTest < ActiveSupport::TestCase
  test "edwards_masterpiece belongs to edward" do
     assert arts(:edwards_masterpiece).user==users(:edward)
  end
end
