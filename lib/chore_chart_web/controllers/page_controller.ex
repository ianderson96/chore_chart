defmodule ChoreChartWeb.PageController do
  use ChoreChartWeb, :controller

  def index(conn, _params) do
    chores =
      ChoreChart.Chores.list_chores()
      |> Enum.map(
        &Map.take(&1, [
          :id,
          :desc,
          :completed,
          :name,
          :value,
          :assign_interval,
          :complete_interval,
          :days_passed_for_complete,
          :days_passed_for_assign,
          :user_id,
          :user_group_id
        ])
      )

    users =
      ChoreChart.Users.list_users()
      |> Enum.map(&Map.take(&1, [:id, :email, :full_name, :score, :user_group_id]))

    render(conn, "index.html", chores: chores, users: users)
  end
end
