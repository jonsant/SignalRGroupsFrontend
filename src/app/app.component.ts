import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalRService } from './services/signalr.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'SignalR Chat Groups';
    connectionStatus: string = 'Disconnected';
    isConnecting: boolean = false;

    constructor(private signalRService: SignalRService) {
        this.signalRService.connectionStatus$.subscribe(status => {
            this.connectionStatus = status;
        });
    }

    onCreateGroup(): void {
        this.isConnecting = true;
        this.signalRService.startConnection()
            .then(() => {
                console.log('Successfully connected to chatHub');
                this.isConnecting = false;
                // You can navigate to a different component or show a success message here
            })
            .catch(error => {
                console.error('Failed to connect:', error);
                this.isConnecting = false;
                alert('Failed to connect to the chat hub. Please check if the server is running.');
            });
    }

    onJoinGroup(): void {
        console.log('Join group clicked');
        // Implement join group logic here
        alert('Join group functionality will be implemented');
    }
}
