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

pwhash = Argon2.hash_pwd_salt("pass1")

Repo.insert!(%UserGroup{name: "71 Pontiac", join_code: "test"})

Repo.insert!(%User{
  email: "ian@pontiac.fun",
  full_name: "Ian Anderson",
  password_hash: pwhash,
  user_group_join_code: "test",
  score: 0
})

Repo.insert!(%User{
  email: "dave@pontiac.fun",
  full_name: "Dave Earley",
  password_hash: pwhash,
  user_group_join_code: "test",
  score: 0
})

Repo.insert!(%Chore{
  name: "Clean the Bathroom",
  desc: "Scrub shower, toilet, and sink. Mop floor and tidy counter.",
  completed: false,
  value: 5,
  assign_interval: 3,
  complete_interval: 3,
  days_passed_for_assign: 0,
  days_passed_for_complete: 0,
  user_group_join_code: "test"
})
