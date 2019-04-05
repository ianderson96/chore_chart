defmodule ChoreChart.Chores.Chore do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :completed, :desc, :name, :value, :assign_interval, :complete_interval, :user_id]}
  schema "chores" do
    field(:completed, :boolean, default: false)
    field(:desc, :string)
    field(:name, :string)
    field(:value, :integer)
    field(:assign_interval, :integer)
    field(:complete_interval, :integer)
    belongs_to(:user, ChoreChart.Users.User)
    belongs_to :user_group, ChoreChart.UserGroups.UserGroup, references: :join_code, type: :string, foreign_key: :user_group_join_code

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
      :user_group_join_code
    ])
    |> validate_required([
      :name,
      :value,
      :completed,
      :assign_interval,
      :complete_interval,
      :user_group_join_code
    ])
  end
end
