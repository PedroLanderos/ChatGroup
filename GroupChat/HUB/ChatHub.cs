using Microsoft.AspNetCore.SignalR;

namespace GroupChat.HUB
{
    public class ChatHub : Microsoft.AspNetCore.SignalR.Hub
    {
        //"map" of id connection and userroom object (user and room)
        private readonly IDictionary<string, UserRoomConnection> _connection;

        //constructor
        public ChatHub(IDictionary<string, UserRoomConnection> connection)
        {
            _connection = connection;
        }


        public async Task JoinRoom(UserRoomConnection userConnection)
        {
            //if the room does not exists signaR creates it automatically 
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room!);

            _connection[Context.ConnectionId] = userConnection;

            //send a message to the room saying the x user is online 
            await Clients.Group(userConnection.Room!)
                .SendAsync("ReceiveMessage", "Lets Program Bot", $"{userConnection.User} has Joined the Group", DateTime.Now);

            //updates the users room and shows it
            await SendConnectedUser(userConnection.Room!);
        }

        public async Task SendMessage(string message)
        {
            //if the connection (user and room) is valid the throws 
            if (_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection userRoomConnection))
            {
                await Clients.Group(userRoomConnection.Room!)
                    .SendAsync("ReceiveMessage", userRoomConnection.User, message, DateTime.Now);
            }
        }

        public override Task OnDisconnectedAsync(Exception? exp)
        {
            if (!_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection roomConnection))
            {
                return base.OnDisconnectedAsync(exp);
            }

            _connection.Remove(Context.ConnectionId);
            Clients.Group(roomConnection.Room!)
                .SendAsync("ReceiveMessage", "Lets Program bot", $"{roomConnection.User} has Left the Group", DateTime.Now);
            SendConnectedUser(roomConnection.Room!);
            return base.OnDisconnectedAsync(exp);
        }

        public Task SendConnectedUser(string room)
        {
            var users = _connection.Values
                .Where(u => u.Room == room)
                .Select(s => s.User);
            return Clients.Group(room).SendAsync("ConnectedUser", users);
        }
    }
}
