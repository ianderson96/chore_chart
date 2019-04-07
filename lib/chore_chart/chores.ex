defmodule ChoreChart.Chores do
  @moduledoc """
  The Chores context.
  """

  import Ecto.Query, warn: false
  alias ChoreChart.Repo

  alias ChoreChart.Chores.Chore
  alias ChoreChart.UserGroups

  alias ChoreChartWeb.ChoreController

  @doc """
  Returns the list of chores.

  ## Examples

      iex> list_chores()
      [%Chore{}, ...]

  """
  def list_chores do
    Repo.all(Chore)
  end

  @doc """
  Gets a single chore.

  Raises `Ecto.NoResultsError` if the Chore does not exist.

  ## Examples

      iex> get_chore!(123)
      %Chore{}

      iex> get_chore!(456)
      ** (Ecto.NoResultsError)

  """
  def get_chore!(id), do: Repo.get!(Chore, id)

  def get_chore(id) do
    Repo.one from c in Chore,
      where: c.id == ^id,
      preload: [:user]
  end

  @doc """
  Creates a chore.

  ## Examples

      iex> create_chore(%{field: value})
      {:ok, %Chore{}}

      iex> create_chore(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_chore(attrs \\ %{}) do
    %Chore{}
    |> Chore.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a chore.

  ## Examples

      iex> update_chore(chore, %{field: new_value})
      {:ok, %Chore{}}

      iex> update_chore(chore, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_chore(%Chore{} = chore, attrs) do
    chore
    |> Chore.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Chore.

  ## Examples

      iex> delete_chore(chore)
      {:ok, %Chore{}}

      iex> delete_chore(chore)
      {:error, %Ecto.Changeset{}}

  """
  def delete_chore(%Chore{} = chore) do
    Repo.delete(chore)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking chore changes.

  ## Examples

      iex> change_chore(chore)
      %Ecto.Changeset{source: %Chore{}}

  """
  def change_chore(%Chore{} = chore) do
    Chore.changeset(chore, %{})
  end

  # Processes a chore to automatically assign the chore and reset its completion status.
  # This function should be run once each day on each chore in order to keep the chores 
  # assigning as they should be.
  def process_chore(%Chore{} = chore) do
    id = UserGroups.get_random_user(chore.user_group_join_code).id
    if chore.user_id == nil do
      update_chore(chore, %{user_id: id});
    end
    if chore.complete_interval - 1 == chore.days_passed_for_complete do
      update_chore(chore, %{days_passed_for_complete: 0});
      update_chore(chore, %{completed: false});
    else
      update_chore(chore, %{days_passed_for_complete: chore.days_passed_for_complete + 1});
    end

    if chore.assign_interval - 1 == chore.days_passed_for_assign do
      newChore = Map.merge(chore, %{days_passed_for_assign: 0, days_passed_for_complete: 0, user_id: id})
      update_chore(chore, %{days_passed_for_complete: 0});
      update_chore(chore, %{days_passed_for_assign: 0});
      update_chore(chore, %{user_id: id});
    else
      update_chore(chore, %{days_passed_for_assign: chore.days_passed_for_assign + 1});
    end
  end

  # Assigns all Chores to users, using their assign_intervals
  def assign_chores do
    IO.inspect(label: "IT RAN")
    Repo.all(Chore)
    |> Enum.map(fn c -> process_chore(c) end)
  end
end
