defmodule One2one.RoomChannel do
    use One2one.Web, :channel
    require Logger

    def join("room", _params, socket) do
        user = socket.assigns.user
        Logger.info(">>> USER JOIN: #{user}")
        {:ok, socket}
    end

    def handle_in("message", %{"body" => body}, socket) do
        user = socket.assigns.user
        Logger.info(">>> ORIGIN: #{user}\n >>> MESSAGE: #{body}")
        broadcast! socket, "message", %{"origin" => user, "body" => body}
        {:noreply, socket}
    end

    def terminate(_reason, socket) do
        user = socket.assigns.user
        Logger.info(">>> USER LEFT: #{user}")
        {:noreply, socket}
    end
end