defmodule ChoreChartWeb.ChoreControllerTest do
  use ChoreChartWeb.ConnCase

  alias ChoreChart.Chores
  alias ChoreChart.Chores.Chore

  @create_attrs %{
    completed: true,
    desc: "some desc",
    name: "some name",
    value: 42
  }
  @update_attrs %{
    completed: false,
    desc: "some updated desc",
    name: "some updated name",
    value: 43
  }
  @invalid_attrs %{completed: nil, desc: nil, name: nil, value: nil}

  def fixture(:chore) do
    {:ok, chore} = Chores.create_chore(@create_attrs)
    chore
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all chores", %{conn: conn} do
      conn = get(conn, Routes.chore_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create chore" do
    test "renders chore when data is valid", %{conn: conn} do
      conn = post(conn, Routes.chore_path(conn, :create), chore: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.chore_path(conn, :show, id))

      assert %{
               "id" => id,
               "completed" => true,
               "desc" => "some desc",
               "name" => "some name",
               "value" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.chore_path(conn, :create), chore: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update chore" do
    setup [:create_chore]

    test "renders chore when data is valid", %{conn: conn, chore: %Chore{id: id} = chore} do
      conn = put(conn, Routes.chore_path(conn, :update, chore), chore: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.chore_path(conn, :show, id))

      assert %{
               "id" => id,
               "completed" => false,
               "desc" => "some updated desc",
               "name" => "some updated name",
               "value" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, chore: chore} do
      conn = put(conn, Routes.chore_path(conn, :update, chore), chore: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete chore" do
    setup [:create_chore]

    test "deletes chosen chore", %{conn: conn, chore: chore} do
      conn = delete(conn, Routes.chore_path(conn, :delete, chore))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.chore_path(conn, :show, chore))
      end
    end
  end

  defp create_chore(_) do
    chore = fixture(:chore)
    {:ok, chore: chore}
  end
end
