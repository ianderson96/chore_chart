# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :chore_chart,
  ecto_repos: [ChoreChart.Repo]

# Configures the endpoint
config :chore_chart, ChoreChartWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Y38yn9jYdjp2xACGfV2T4mrXGiRXxK5DCE6gJOv2LZr4TJLaq2/wb5HS0h7qmuzx",
  render_errors: [view: ChoreChartWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: ChoreChart.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :ex_twilio, account_sid:   {:system, "TWILIO_ACCOUNT_SID"},
                   auth_token:    {:system, "TWILIO_AUTH_TOKEN"}

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
