import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    title = 'SignalR Chat Groups';
    connectionStatus: string = 'Disconnected';
    isConnecting: boolean = false;

    constructor(
        private signalRService: SignalRService,
        private router: Router
    ) {
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
                this.router.navigate(['/create-group']);
            })
            .catch(error => {
                console.error('Failed to connect:', error);
                this.isConnecting = false;
                alert('Failed to connect to the chat hub. Please check if the server is running.');
            });
    }

    onJoinGroup(): void {
        this.isConnecting = true;
        this.signalRService.startConnection()
            .then(() => {
                console.log('Successfully connected to chatHub');
                this.isConnecting = false;
                this.router.navigate(['/join-group']);
            })
            .catch(error => {
                console.error('Failed to connect:', error);
                this.isConnecting = false;
                alert('Failed to connect to the chat hub. Please check if the server is running.');
            });
    }
}
