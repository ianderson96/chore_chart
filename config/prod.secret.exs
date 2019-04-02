use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :chore_chart, ChoreChartWeb.Endpoint,
  secret_key_base: "lu8SQVgvgRhjm7RBiv8ya5A2Bu/m1LgqTdjscvUIt0aI8NERnOYuQvsd0p63LKXJ"

# Configure your database
config :chore_chart, ChoreChart.Repo,
  username: "postgres",
  password: "postgres",
  database: "chore_chart_prod",
  pool_size: 15
