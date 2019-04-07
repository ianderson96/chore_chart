defmodule ChoreChart.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    import Supervisor.Spec
    # List all child processes to be supervised
    children = [
      # Start the Ecto repository
      supervisor(ChoreChart.Repo, []),
      # Start the endpoint when the application starts
      supervisor(ChoreChartWeb.Endpoint, []),
      # Starts a worker by calling: ChoreChart.Worker.start_link(arg)
      # {ChoreChart.Worker, arg},
      worker(ChoreChart.Scheduler, []),
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ChoreChart.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    ChoreChartWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
