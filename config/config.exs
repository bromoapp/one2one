# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :one2one,
  ecto_repos: [One2one.Repo]

# Configures the endpoint
config :one2one, One2one.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "oDM3JvrM+WTi5PuB7Ge16KsJlzIH0+zIPU0dGLyAX29B2r46eZ2qGYEzV/zS1ck5",
  render_errors: [view: One2one.ErrorView, accepts: ~w(html json)],
  pubsub: [name: One2one.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
