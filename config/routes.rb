Myapp::Application.routes.draw do
  resources :conversations

  resources :messages
  
  get "edit_template" => 'commission_request_templates#edit'
  post "update_template" => 'commission_request_templates#update'
  post "commissions/:artist_id/request_commission" => 'commissions#create'
  get "commissions/new" => 'commissions#edit'
  get "commissions/requests/accept" => 'commissions#accept'
  get "commissions/requests/decline" => 'commissions#decline'
  post "commissions/review/:commission_id" => 'commissions#catch_post_review'
  get "commissions/requests/finish" => 'commissions#finish'
  get "commissions/review/:commission_id" => 'commissions#review', as: :review
  get "commissions/progress/:commission_id" => 'commissions#progress', as: :progress
  post "commissions/progress/:commission_id" => 'commissions#complete'
  get "commissions/requests" => 'commissions#requests'
  get "commissions/:artist_id" => 'commissions#edit'
  resources :commissions
  get 'users/:id/artist_dashboard' => 'users#artist_dashboard' 
  post 'users/login' => 'users#login'
  post 'users/logout' => 'users#logout'
  #get "users/new"
  #get "users/create"
  resources :users
  resources :arts 
  resources :images do
    get "serve", :on => :member
  end
  #get "new/create"
  #resources :fake_users
  #get "login" => "sessions#new", :as => "login"  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  get "about" => 'about#index'
  get 'authenticate' => 'users#authenticate'

  # You can have the root of your site routed with "root"
  root 'welcome#index'
  match 'static/:action', via:[:get,:post], :controller => "static"
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
