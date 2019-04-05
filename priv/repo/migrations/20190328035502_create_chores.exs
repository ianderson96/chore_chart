defmodule ChoreChart.Repo.Migrations.CreateChores do
  use Ecto.Migration

  def change do
    create table(:chores) do
      add(:name, :string, null: false)
      add(:desc, :text)
      add(:value, :integer, null: false)
      add(:completed, :boolean, default: false, null: false)
      add(:assign_interval, :integer, null: false)
      add(:complete_interval, :integer, null: false)
      add(:days_passed_for_assign, :integer, null: false)
      add(:days_passed_for_complete, :integer, null: false)
      add(:user_id, references(:users, on_delete: :nothing))
      add :user_group_join_code, references(:user_groups, on_delete: :nothing, column: :join_code, type: :string)

      timestamps()
    end
  end
end
