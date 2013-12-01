require 'spec_helper'


def create_user(name)
  #Set up a new user
  user = User.new
  user.name = name
  user.email = "#{name}@gmail.com"
  user.password = "secret"
  user.password_confirmation = "secret"
  user.save
end

describe "Mailbox" do
  create_user("Eddy")
  create_user("Jimmy")
  
  it "must log in Eddy and send a message to Jimmy" do
    visit authenticate_path
  
    within(:css, "form#log_in") do
      page.fill_in 'email', :with => "Eddy@gmail.com"
      fill_in 'password', :with => "secret"
      click_button 'Log in'
    end 
   
    page.should have_content("Eddy")
    visit conversations_path 
    page.should have_selector('div', 'btn.btn-primary.btn-mid')
        
    recip = User.find_by_name("Jimmy") 
    recip.mailbox.conversations.count.should eql(0)
    click_button "Compose"
    fill_in 'msg_recipient', :with => recip.name
    fill_in 'msg_subject', :with => "Hello"
    fill_in 'msg_body', :with => "Just sayin hi"
    click_button 'Send' 
    page.should_not have_content("Invalid")
    recip.mailbox.conversations.count.should eql(1)
  end

end


