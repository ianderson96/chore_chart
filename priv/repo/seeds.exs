# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     ChoreChart.Repo.insert!(%ChoreChart.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias ChoreChart.Repo
alias ChoreChart.Users.User
alias ChoreChart.UserGroups.UserGroup
alias ChoreChart.Chores.Chore

pwhash = Argon2.hash_pwd_salt("3000")

Repo.insert!(%UserGroup{name: "Outkast", join_code: "test"})

Repo.insert!(%User{
  id: 1,
  email: "hey@ya.com",
  phone_number: "+16038926145",
  full_name: "Andre 3000",
  password_hash: pwhash,
  user_group_join_code: "test",
  score: 0
})

Repo.insert!(%User{
  id: 2,
  email: "ms@jackson.net",
  phone_number: "+16038926145",
  full_name: "Big Boi",
  password_hash: pwhash,
  user_group_join_code: "test",
  score: 0
})

Repo.insert!(%Chore{
  id: 1,
  name: "Clean the Bathroom",
  desc: "Scrub shower, toilet, and sink. Mop floor and tidy counter.",
  completed: false,
  value: 5,
  assign_interval: 3,
  complete_interval: 3,
  days_passed_for_assign: 0,
  days_passed_for_complete: 0,
  user_group_join_code: "test",
  user_id: 1
})

Repo.insert!(%Chore{
  id: 2,
  name: "Take out the trash",
  desc: "Replace the trash bag!",
  completed: false,
  value: 5,
  assign_interval: 3,
  complete_interval: 3,
  days_passed_for_assign: 0,
  days_passed_for_complete: 0,
  user_group_join_code: "test",
  user_id: 1
})

Repo.insert!(%Chore{
  id: 3,
  name: "Tidy the living room",
  desc: "fold blankets",
  completed: false,
  value: 5,
  assign_interval: 3,
  complete_interval: 3,
  days_passed_for_assign: 0,
  days_passed_for_complete: 0,
  user_group_join_code: "test",
  user_id: 2
})

Repo.insert!(%Chore{
  id: 4,
  name: "Clean the Kitchen",
  desc: "Scrub da counters",
  completed: false,
  value: 5,
  assign_interval: 3,
  complete_interval: 3,
  days_passed_for_assign: 0,
  days_passed_for_complete: 0,
  user_group_join_code: "test",
  user_id: 2
})
