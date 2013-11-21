class MessagesController < ApplicationController

  before_filter :get_mailbox, :get_box, :get_user
  
  #Copied from social_stream example
  #Probably needs work before it can be used
  def show
    if @message = Message.find_by_id(params[:id]) and @conversation = @message.conversation
      if @conversation.is_participant?(@user)
        #redirect_to conversation_path(@conversation, :box => @box,
        # :anchor => "message_" + @message.id.to_s)
        #return
      end
    end
    #redirect_to conversations_path(:box => @box)
  end

  def new
    if params[:receiver].present?
      @recipient = User.find_by_name(params[:receiver])
      return if @recipient.nil?
      @recipient = nil if @recipient == current_user
    end
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
