defmodule ChoreChartWeb.ChoreController do
  use ChoreChartWeb, :controller

  alias ChoreChart.Chores
  alias ChoreChart.Chores.Chore

  action_fallback ChoreChartWeb.FallbackController

  def index(conn, _params) do
    chores = Chores.list_chores()
    render(conn, "index.json", chores: chores)
  end

  def create(conn, %{"chore" => chore_params}) do
    with {:ok, %Chore{} = chore} <- Chores.create_chore(chore_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.chore_path(conn, :show, chore))
      |> render("show.json", chore: chore)
    end
  end

  def remind(conn, %{"id" => id, "name" => name}) do
    Chores.send_reminder(id, name)
    send_resp(conn, :no_content, "")
  end

  def show(conn, %{"id" => id}) do
    chore = Chores.get_chore(id)
    render(conn, "show.json", chore: chore)
  end

  def update(conn, %{"id" => id, "chore" => chore_params}) do
    chore = Chores.get_chore(id)

    with {:ok, %Chore{} = chore} <- Chores.update_chore(chore, chore_params) do
      render(conn, "show.json", chore: chore)
    end
  end

  def delete(conn, %{"id" => id}) do
    chore = Chores.get_chore(id)

    with {:ok, %Chore{}} <- Chores.delete_chore(chore) do
      send_resp(conn, :no_content, "")
    end
  end
end
