class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper
  private
    
    #Checks to see if current_user is defined
    #If not, redirects the user to the previous page
    #This will also store the session[:destination_page] value to the page
    #that was requested
    def verify_logged_in
      if current_user.nil?
        #THis will store get parameters but not post parameters
        session[:destination_page] = request.env['ORIGINAL_FULLPATH']
        redirect_to authenticate_path, alert:"You must be logged in before you can continue."
        #redirect_back "You must be logged in to do that."
      end
    end

    #Redirects the user back to the previous page if possible, otherwise to the default url
    #If no default url is given (and HTTP_REFERER is not set) this will redirect
    #the user to the root
    #args
    # message: the alert message to be displayed upon redirect
    # default: the destination to send the user if HTTP_REFERER is not set
    def redirect_back(message = nil, default = root_url)
      if !request.env["HTTP_REFERER"].blank? and request.env["HTTP_REFERER"] != request.env["REQUEST_URI"]
        redirect_to :back, alert:message
      else
        redirect_to default, alert:message
      end
    end    
end
