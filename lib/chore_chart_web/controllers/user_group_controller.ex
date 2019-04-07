defmodule ChoreChartWeb.UserGroupController do
  use ChoreChartWeb, :controller

  alias ChoreChart.UserGroups
  alias ChoreChart.UserGroups.UserGroup

  action_fallback ChoreChartWeb.FallbackController

  def index(conn, _params) do
    user_groups = UserGroups.list_user_groups()
    render(conn, "index.json", user_groups: user_groups)
  end

  def create(conn, %{"user_group" => user_group_params}) do
    with {:ok, %UserGroup{} = user_group} <- UserGroups.create_user_group(user_group_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_group_path(conn, :show, user_group))
      |> render("show.json", user_group: user_group)
    end
  end

  def show(conn, %{"id" => id}) do
    user_group = UserGroups.get_user_group(id)
    render(conn, "show.json", user_group: user_group)
  end

  def update(conn, %{"id" => id, "user_group" => user_group_params}) do
    user_group = UserGroups.get_user_group(id)

    with {:ok, %UserGroup{} = user_group} <- UserGroups.update_user_group(user_group, user_group_params) do
      render(conn, "show.json", user_group: user_group)
    end
  end

  def delete(conn, %{"id" => id}) do
    user_group = UserGroups.get_user_group(id)

    with {:ok, %UserGroup{}} <- UserGroups.delete_user_group(user_group) do
      send_resp(conn, :no_content, "")
    end
  end
end
