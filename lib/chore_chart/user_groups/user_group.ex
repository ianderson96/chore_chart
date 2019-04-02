defmodule ChoreChart.UserGroups.UserGroup do
  use Ecto.Schema
  import Ecto.Changeset

  schema "user_groups" do
    field(:join_code, :string)
    field(:name, :string)
    has_many(:users, ChoreChart.Users.User)
    has_many(:chores, ChoreChart.Chores.Chore)

    timestamps()
  end

  @doc false
  def changeset(user_group, attrs) do
    user_group
    |> cast(attrs, [:name, :join_code])
    |> validate_required([:name, :join_code])
  end
end
