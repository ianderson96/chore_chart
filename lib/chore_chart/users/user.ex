defmodule ChoreChart.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field(:email, :string)
    field(:full_name, :string)
    field(:password_hash, :string)
    field(:score, :integer)
    has_many(:chores, ChoreChart.Chores.Chore)
    belongs_to(:user_group, ChoreChart.UserGroups.UserGroup)

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :password_hash, :full_name, :score, :user_group_id])
    |> validate_required([:email, :password_hash, :full_name, :score])
  end
end
