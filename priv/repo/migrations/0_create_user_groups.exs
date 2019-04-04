defmodule ChoreChart.Repo.Migrations.CreateUserGroups do
  use Ecto.Migration

  def change do
    create table(:user_groups, primary_key: false) do
      add :join_code, :string, primary_key: true
      add :name, :string, null: false

      timestamps()
    end
  end
end
