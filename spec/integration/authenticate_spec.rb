require 'spec_helper'

describe "Log in page" do
  #Set up a new user
  user = User.new
  user.name = "teddy"
  user.email = "teddy@gmail.com"
  user.password = "secret"
  user.password_confirmation = "secret"
  user.save

  it "must have login text" do
    visit authenticate_path
    page.should have_content('Log in')
  end
  it "must have a log in link" do
    visit authenticate_path
    page.should have_button('Log in')
    page.should have_field('email')
  end


  it "must display error message if a user provides bad email" do
    visit authenticate_path
    fill_in 'email', :with => "teddy@gmail.co.uk"
    fill_in 'password', :with => "secret"
    click_button 'Log in'
    page.should have_content('Invalid')
  end
    

  it "must display error message if a user provides bad password" do
    visit authenticate_path
    fill_in 'email', :with => "teddy@gmail.com"
    fill_in 'password', :with => "secretary"
    click_button 'Log in'
    page.should have_content('Invalid')
  end

  it "must log in a valid user" do
    visit authenticate_path
    page.fill_in 'email', :with => "teddy@gmail.com"
    fill_in 'password', :with => "secret"
    click_button 'Log in'
    #Check for content specific to CommissionMe front page (or wherever we should be redirected)
    within 'head' do
	page.should have_content("CommissionMe")
    end
  end
end

describe "Sign up page" do

  before :each do
    visit authenticate_path
  end
  it "must have sign up text" do 
    page.should have_content('Sign up')
  end

  it "must have correct fields" do
    within(:css, "form#sign_up") do
      page.should have_field 'email'
      page.should have_field 'name'
      page.should have_field 'password'
      page.should have_field 'password_confirmation'
    end
  end
  
  it "must fail with invalid fields" do
    within(:css, "form#sign_up") do
      fill_in 'email', :with => "invalidAtinvalid.com"
      fill_in 'name', :with => "some name"
      fill_in 'password', :with => "secret"
      fill_in 'password_confirmation', :with => "secret"
      click_button 'Sign Up'
    end
    page.should have_content('invalid')
    assert_nil User.find_by_email('invalidAtinvalid.com')
  end  

  
  it "must create a user with valid fields" do
    within(:css, "form#sign_up") do
      fill_in 'email', :with => "valid@valid.com"
      fill_in 'name', :with => "some name"
      fill_in 'password', :with => "secret"
      fill_in 'password_confirmation', :with => "secret"
      click_button 'Sign Up'
    end 
    assert_not_nil User.find_by_email('valid@valid.com')
  end  
end
