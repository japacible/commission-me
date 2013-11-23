class ConversationsController < ApplicationController
  before_filter :get_user, :get_mailbox, :get_box
  before_filter :check_current_subject_in_conversation, 
    :only => [:show, :update, :destroy]

  def index
    @conversations_inbox = @mailbox.inbox
    @conversations_sentbox = @mailbox.sentbox
    @conversations_trash = @mailbox.trash
  end

  def show
    @conversation = Conversation.find(params[:id])
    @conversations_inbox = @mailbox.inbox
    @conversations_sentbox = @mailbox.sentbox
    @conversations_trash = @mailbox.trash
  end

private

  def get_mailbox
    @mailbox = current_user.mailbox
  end

  def get_user
    if !@user = current_user
      flash[:alert] = "You must be logged in to view conversations." 
      redirect_to root_path
      #Ideally we need to set up a general purpose 'redirect_back_or_to_root'
      #so that the user doesn't get confused by always getting pushed to root'
    end
  end

  def get_box
    if params[:box].blank? or !["inbox","sentbox","trash"].include?params[:box]
      params[:box] = 'inbox'
    end

    @box = params[:box]
  end

  def check_current_subject_in_conversation
    @conversation = Conversation.find_by_id(params[:id])
    if @conversation.nil? or !@conversation.is_participant?(@user)
      redirect_to conversations_path(:box => @box),
        alert:"Cannot access conversation with id: #{params[:id]}"
    return
    end
  end

end
