defmodule ChoreChart.UserGroups do
  @moduledoc """
  The UserGroups context.
  """

  import Ecto.Query, warn: false
  alias ChoreChart.Repo

  alias ChoreChart.UserGroups.UserGroup

  @doc """
  Returns the list of user_groups.

  ## Examples

      iex> list_user_groups()
      [%UserGroup{}, ...]

  """
  def list_user_groups do
    Repo.all(UserGroup)
  end

  @doc """
  Gets a single user_group.

  Raises `Ecto.NoResultsError` if the User group does not exist.

  ## Examples

      iex> get_user_group!(123)
      %UserGroup{}

      iex> get_user_group!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user_group!(id), do: Repo.get!(UserGroup, id)

  def get_user_group(id) do
    Repo.one from ug in UserGroup,
      where: ug.join_code == ^id,
      preload: [:users, :chores]    
  end

  # Gets a random user from the given user group.
  def get_random_user(id) do
    get_user_group(id).users
    |> Enum.random()
  end

  @doc """
  Creates a user_group.

  ## Examples

      iex> create_user_group(%{field: value})
      {:ok, %UserGroup{}}

      iex> create_user_group(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user_group(attrs \\ %{}) do
    %UserGroup{}
    |> UserGroup.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user_group.

  ## Examples

      iex> update_user_group(user_group, %{field: new_value})
      {:ok, %UserGroup{}}

      iex> update_user_group(user_group, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user_group(%UserGroup{} = user_group, attrs) do
    user_group
    |> UserGroup.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a UserGroup.

  ## Examples

      iex> delete_user_group(user_group)
      {:ok, %UserGroup{}}

      iex> delete_user_group(user_group)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user_group(%UserGroup{} = user_group) do
    Repo.delete(user_group)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user_group changes.

  ## Examples

      iex> change_user_group(user_group)
      %Ecto.Changeset{source: %UserGroup{}}

  """
  def change_user_group(%UserGroup{} = user_group) do
    UserGroup.changeset(user_group, %{})
  end
end
