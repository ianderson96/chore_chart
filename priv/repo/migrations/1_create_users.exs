defmodule ChoreChart.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add(:email, :string, null: false)
      add(:password_hash, :string, null: false)
      add(:full_name, :string, null: false)
      add(:score, :integer, null: false)
      add(:user_group_id, references(:user_groups, on_delete: :nothing))

      timestamps()
    end
  end
end
