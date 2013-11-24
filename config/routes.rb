Myapp::Application.routes.draw do
  resources :conversations

  resources :messages

  get "about/index"
  get "edit_template" => 'commission_request_templates#edit'
  post "update_template" => 'commission_request_templates#update'
  post "request_commission" => 'commissions#create'
  get "commissions/:artist_id" => 'commissions#edit'
  resources :commissions
  get 'users/:id/artist_dashboard' => 'users#artist_dashboard' 
  post 'users/login' => 'users#login'
  post 'users/logout' => 'users#logout'
  #get "users/new"
  #get "users/create"
  resources :users
  resources :arts 
  #get "new/create"
  #resources :fake_users
  #get "login" => "sessions#new", :as => "login"  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

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
