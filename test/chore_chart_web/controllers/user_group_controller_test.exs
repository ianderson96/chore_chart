defmodule ChoreChartWeb.UserGroupControllerTest do
  use ChoreChartWeb.ConnCase

  alias ChoreChart.UserGroups
  alias ChoreChart.UserGroups.UserGroup

  @create_attrs %{
    join_code: "some join_code",
    name: "some name"
  }
  @update_attrs %{
    join_code: "some updated join_code",
    name: "some updated name"
  }
  @invalid_attrs %{join_code: nil, name: nil}

  def fixture(:user_group) do
    {:ok, user_group} = UserGroups.create_user_group(@create_attrs)
    user_group
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all user_groups", %{conn: conn} do
      conn = get(conn, Routes.user_group_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create user_group" do
    test "renders user_group when data is valid", %{conn: conn} do
      conn = post(conn, Routes.user_group_path(conn, :create), user_group: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.user_group_path(conn, :show, id))

      assert %{
               "id" => id,
               "join_code" => "some join_code",
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.user_group_path(conn, :create), user_group: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update user_group" do
    setup [:create_user_group]

    test "renders user_group when data is valid", %{conn: conn, user_group: %UserGroup{id: id} = user_group} do
      conn = put(conn, Routes.user_group_path(conn, :update, user_group), user_group: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.user_group_path(conn, :show, id))

      assert %{
               "id" => id,
               "join_code" => "some updated join_code",
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, user_group: user_group} do
      conn = put(conn, Routes.user_group_path(conn, :update, user_group), user_group: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete user_group" do
    setup [:create_user_group]

    test "deletes chosen user_group", %{conn: conn, user_group: user_group} do
      conn = delete(conn, Routes.user_group_path(conn, :delete, user_group))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.user_group_path(conn, :show, user_group))
      end
    end
  end

  defp create_user_group(_) do
    user_group = fixture(:user_group)
    {:ok, user_group: user_group}
  end
end
