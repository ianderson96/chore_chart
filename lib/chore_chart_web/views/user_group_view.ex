defmodule ChoreChartWeb.UserGroupView do
  use ChoreChartWeb, :view
  alias ChoreChartWeb.UserGroupView

  def render("index.json", %{user_groups: user_groups}) do
    %{data: render_many(user_groups, UserGroupView, "user_group.json")}
  end

  def render("show.json", %{user_group: user_group}) do
    %{data: render_one(user_group, UserGroupView, "user_group.json")}
  end

  def render("user_group.json", %{user_group: user_group}) do
    %{name: user_group.name,
      join_code: user_group.join_code}
  end
end
