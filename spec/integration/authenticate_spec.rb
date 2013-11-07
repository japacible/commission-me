require 'spec_helper'

describe "Log in page" do
  it "must have login text" do
    visit authenticate_path
    page.should have_content('Log in')
  end
  it "must have a log in link" do
    visit authenticate_path
    page.should have_button('Log in')
  end



    

  it "must log in a valid user" do
	user = User.new
	user.name = "teddy"
	user.email = "teddy@gmail.com"
	user.password = "secret"
	user.password_confirmation = "secret"
	user.save
    visit authenticate_path
    #within(action:"/ussers/login") do
    page.should have_field('email')
    page.fill_in 'email', :with => "teddy@gmail.com"
    fill_in 'password', :with => "secret"
    click_button 'Log in'
    #end
    within 'head' do
	page.should have_content('CommissionMe')
    end
  end
end
