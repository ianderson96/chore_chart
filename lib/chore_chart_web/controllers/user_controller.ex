defmodule ChoreChartWeb.UserController do
  use ChoreChartWeb, :controller

  alias ChoreChart.Users
  alias ChoreChart.Users.User

  action_fallback(ChoreChartWeb.FallbackController)

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    IO.inspect(user_params, label: "params")
    pw = Map.get(user_params, "password_hash")
    pwhash = Argon2.hash_pwd_salt(pw)
    new_params = Map.put(user_params, "password_hash", pwhash)
    IO.inspect(new_params, label: "new params")

    with {:ok, %User{} = user} <- Users.create_user(new_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("show.json", user: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
