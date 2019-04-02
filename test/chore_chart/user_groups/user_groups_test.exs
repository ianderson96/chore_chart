defmodule ChoreChart.UserGroupsTest do
  use ChoreChart.DataCase

  alias ChoreChart.UserGroups

  describe "user_groups" do
    alias ChoreChart.UserGroups.UserGroup

    @valid_attrs %{join_code: "some join_code", name: "some name"}
    @update_attrs %{join_code: "some updated join_code", name: "some updated name"}
    @invalid_attrs %{join_code: nil, name: nil}

    def user_group_fixture(attrs \\ %{}) do
      {:ok, user_group} =
        attrs
        |> Enum.into(@valid_attrs)
        |> UserGroups.create_user_group()

      user_group
    end

    test "list_user_groups/0 returns all user_groups" do
      user_group = user_group_fixture()
      assert UserGroups.list_user_groups() == [user_group]
    end

    test "get_user_group!/1 returns the user_group with given id" do
      user_group = user_group_fixture()
      assert UserGroups.get_user_group!(user_group.id) == user_group
    end

    test "create_user_group/1 with valid data creates a user_group" do
      assert {:ok, %UserGroup{} = user_group} = UserGroups.create_user_group(@valid_attrs)
      assert user_group.join_code == "some join_code"
      assert user_group.name == "some name"
    end

    test "create_user_group/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = UserGroups.create_user_group(@invalid_attrs)
    end

    test "update_user_group/2 with valid data updates the user_group" do
      user_group = user_group_fixture()
      assert {:ok, %UserGroup{} = user_group} = UserGroups.update_user_group(user_group, @update_attrs)
      assert user_group.join_code == "some updated join_code"
      assert user_group.name == "some updated name"
    end

    test "update_user_group/2 with invalid data returns error changeset" do
      user_group = user_group_fixture()
      assert {:error, %Ecto.Changeset{}} = UserGroups.update_user_group(user_group, @invalid_attrs)
      assert user_group == UserGroups.get_user_group!(user_group.id)
    end

    test "delete_user_group/1 deletes the user_group" do
      user_group = user_group_fixture()
      assert {:ok, %UserGroup{}} = UserGroups.delete_user_group(user_group)
      assert_raise Ecto.NoResultsError, fn -> UserGroups.get_user_group!(user_group.id) end
    end

    test "change_user_group/1 returns a user_group changeset" do
      user_group = user_group_fixture()
      assert %Ecto.Changeset{} = UserGroups.change_user_group(user_group)
    end
  end
end
