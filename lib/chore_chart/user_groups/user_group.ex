defmodule ChoreChart.UserGroups.UserGroup do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:join_code, :string, []}
  @derive {Phoenix.Param, key: :join_code}
  schema "user_groups" do
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
    |> foreign_key_constraint(:join_code)
  end
end
