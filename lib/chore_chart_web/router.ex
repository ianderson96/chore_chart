defmodule ChoreChartWeb.Router do
  use ChoreChartWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/api/v1", ChoreChartWeb do
    pipe_through(:api)

    resources("/users", UserController, except: [:new, :edit])
    resources("/chores", ChoreController, except: [:new, :edit])
    resources("/usergroups", UserGroupController, except: [:new, :edit])
  end

  scope "/", ChoreChartWeb do
    pipe_through(:browser)

    get("/", PageController, :index)
    get("/users", PageController, :index)
  end

  # Other scopes may use custom stacks.
  # scope "/api", ChoreChartWeb do
  #   pipe_through :api
  # end
end
