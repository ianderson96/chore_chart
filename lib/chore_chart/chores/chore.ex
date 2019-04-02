defmodule ChoreChart.Chores.Chore do
  use Ecto.Schema
  import Ecto.Changeset

  schema "chores" do
    field(:completed, :boolean, default: false)
    field(:desc, :string)
    field(:name, :string)
    field(:value, :integer)
    field(:assign_interval, :integer)
    field(:complete_interval, :integer)
    belongs_to(:user, ChoreChart.Users.User)
    belongs_to(:user_group, ChoreChart.UserGroups.UserGroup)

    timestamps()
  end

  @doc false
  def changeset(chore, attrs) do
    chore
    |> cast(attrs, [
      :name,
      :desc,
      :value,
      :completed,
      :assign_interval,
      :complete_interval,
      :user_id,
      :user_group_id
    ])
    |> validate_required([
      :name,
      :value,
      :completed,
      :assign_interval,
      :complete_interval,
      :user_group_id
    ])
  end
end
