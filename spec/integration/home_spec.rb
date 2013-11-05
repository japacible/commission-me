require 'spec_helper'

describe 'home page' do
  it 'welcomes the user' do
    visit '/'
    page.should have_content('CommissionMe')
  end
end

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
    visit authenticate_path
    page.should have_field('email')
    page.fill_in 'email', :with => "eddy@gmail.com"
    fill_in 'password', :with => "secret"
    click_button 'Log in'
    page.should have_content('Log out')
  end
end
