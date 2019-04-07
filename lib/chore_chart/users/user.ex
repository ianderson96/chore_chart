defmodule ChoreChart.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:email, :full_name, :score]}
  schema "users" do
    field :email, :string
    field :phone_number, :string
    field :full_name, :string
    field :password_hash, :string
    field :score, :integer
    has_many :chores, ChoreChart.Chores.Chore
    belongs_to :user_group, ChoreChart.UserGroups.UserGroup, references: :join_code, type: :string, foreign_key: :user_group_join_code

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :password_hash, :full_name, :score, :phone_number, :user_group_join_code])
    |> validate_required([:email, :password_hash, :full_name, :score, :phone_number])
  end
end
