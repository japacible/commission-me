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
    puts "PATH = #{current_path}"
    within(:css, "form#log_in") do
      page.fill_in 'email', :with => "Eddy@gmail.com"
      fill_in 'password', :with => "secret"
      click_button 'Log in'
    end 
    puts "PATH = #{current_path}" 
    page.should have_content("Eddy")
    visit conversations_path
    puts "PATH = #{current_path}" 
    page.should have_selector('div', 'btn.btn-primary.btn-mid')
    #For some reason test cannot click this button, even though above line verifies its existence
    click_button "Compose"
    fill_in 'msg_recipient', :with => "Jimmy@gmail.com"
    fill_in 'msg_subject', :with => "Hello"
    fill_in 'msg_body', :with => "Just sayin hi"
    click_button 'Send'
  end

end


