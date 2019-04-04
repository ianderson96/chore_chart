defmodule ChoreChartWeb.UserView do
  use ChoreChartWeb, :view
  alias ChoreChartWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      email: user.email,
      password_hash: user.password_hash,
      full_name: user.full_name,
      score: user.score,
      user_group_join_code: user.user_group_join_code}
  end
end
