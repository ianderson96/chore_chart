defmodule ChoreChartWeb.ChoreView do
  use ChoreChartWeb, :view
  alias ChoreChartWeb.ChoreView

  def render("index.json", %{chores: chores}) do
    %{data: render_many(chores, ChoreView, "chore.json")}
  end

  def render("show.json", %{chore: chore}) do
    %{data: render_one(chore, ChoreView, "chore.json")}
  end

  def render("chore.json", %{chore: chore}) do
    %{id: chore.id,
      name: chore.name,
      desc: chore.desc,
      value: chore.value,
      completed: chore.completed}
  end
end
