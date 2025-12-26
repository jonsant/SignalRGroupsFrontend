# SignalR Chat Groups Frontend

An Angular application that connects to a .NET Web API SignalR hub for chat group functionality.

## Features

- Two main actions: **Create New Chat Group** and **Join Chat Group**
- SignalR connection to backend chatHub
- Real-time connection status indicator
- Modern, responsive UI with gradient design

## Setup

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Update the SignalR hub URL in `src/app/services/signalr.service.ts` if your backend is running on a different address:
   ```typescript
   // Default is: https://localhost:7000/chatHub
   public startConnection(hubUrl: string = 'YOUR_BACKEND_URL/chatHub')
   ```

## Running the Application

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200/`

## How It Works

1. **Create New Chat Group**: Clicking this button establishes a SignalR connection to your backend chatHub
2. **Join Chat Group**: Placeholder for join functionality (to be implemented)
3. **Connection Status**: Visual indicator shows connection state (Disconnected/Connecting/Connected)

## Project Structure

```
src/
├── app/
│   ├── services/
│   │   └── signalr.service.ts    # SignalR connection management
│   ├── app.component.ts           # Main component logic
│   ├── app.component.html         # Main component template
│   └── app.component.css          # Component styling
├── index.html                     # Main HTML file
├── main.ts                        # Application bootstrap
└── styles.css                     # Global styles
```

## Backend Requirements

Your .NET Web API should have a SignalR hub named `chatHub`. Example:

```csharp
public class ChatHub : Hub
{
    // Your hub methods here
}
```

And in your Program.cs:
```csharp
app.MapHub<ChatHub>("/chatHub");
```

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.
