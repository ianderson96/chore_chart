defmodule ChoreChart.Repo.Migrations.CreateUserGroups do
  use Ecto.Migration

  def change do
    create table(:user_groups) do
      add(:name, :string, null: false)
      add(:join_code, :string, null: false)

      timestamps()
    end
  end
end
