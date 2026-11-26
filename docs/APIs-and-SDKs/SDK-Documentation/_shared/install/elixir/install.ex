defp deps do
  [
    {:absmartly, git: "https://github.com/absmartly/elixir-sdk.git", ref: "a68baf69e14254276a9cf1b812aaf6e38aa6574c"},
    # The versions in the SDK's mix.lock; newer hackney releases pull in a quic that needs OTP 27.
    {:hackney, "4.9.1"},
    {:quic, "2.1.3"}
  ]
end
