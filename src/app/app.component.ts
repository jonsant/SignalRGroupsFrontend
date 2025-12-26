import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalRService } from './services/signalr.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'SignalR Chat Groups';
    connectionStatus: string = 'Disconnected';
    isConnecting: boolean = false;
    currentView: 'home' | 'create-group' = 'home';
    username: string = '';

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
                this.currentView = 'create-group';
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

    onCreateGroupWithUsername(): void {
        if (!this.username.trim()) {
            alert('Please enter a username');
            return;
        }

        console.log('Creating group with username:', this.username);

        this.signalRService.invokeHubMethod('CreateChatGroup', this.username)
            .then((response) => {
                console.log('Chat group created successfully:', response);
                alert(`Chat group created successfully for ${this.username}`);
            })
            .catch((error) => {
                console.error('Error creating chat group:', error);
                alert('Failed to create chat group. Please try again.');
            });
    }
}
