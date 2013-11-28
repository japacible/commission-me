class MessagesController < ApplicationController

  before_filter :get_mailbox, :get_box, :get_user
  
  #Copied from social_stream example
  #Probably needs work before it can be used
  def show
    if @message = Message.find_by_id(params[:id]) and @conversation = @message.conversation
      if @conversation.is_participant?(@user)
      else
        redirect_to :back, alert: "You are not authorized to view this message."
      end
    else
      redirect_to :back, alert: "Invalid Message Id: #{params[:id]}"
    end
    #implicitly render show
  end

  def new
    if params[:msg_recipient].present?
      @recipient = User.find_by_name(params[:msg_recipient])
      return if @recipient.nil?
      @recipient = nil if @recipient == current_user
    end
  end

  def create
    alerts = []
    can_send = true
   
    if (!params[:msg_recipient].present? or 
        !(@recipient = User.find_by_name(params[:msg_recipient])) or 
        @recipient == current_user )
      alerts << "Error: Invalid Recipient" 
      can_send = false
    end

    if !params[:msg_body].present?
      alerts << "Error: Invalid Message Body" 
      can_send = false
    end   

    if !params[:msg_subject].present?
       alerts << "Error: Invalid Message Subject"
       can_send = false
    end
    if can_send
      @receipt = current_user.send_message @recipient, params[:msg_body], params[:msg_subject]
      alerts << "Message sent successfully!"
    end
    redirect_to conversations_path, :alert => alerts.join("<br/>").html_safe
  end

  def edit

  end

  # PUT /messages/1
  # PUT /messages/1.xml
  def update

  end

  # DELETE /messages/1
  # DELETE /messages/1.xml
  def destroy

  end

private

  def get_mailbox
    @mailbox = current_user.mailbox
  end

  def get_user
    @user = current_user
  end

  def get_box
    if params[:box].blank? or !["inbox","sentbox","trash"].include?params[:box]
      @box = "inbox"
    return
    end
    @box = params[:box]
  end
end
