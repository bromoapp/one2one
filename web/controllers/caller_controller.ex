defmodule One2one.CallerController do
    use One2one.Web, :controller

    def index(conn, _params) do
        render conn, "index.html"
    end
end