import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatGroupSignalrService } from '../../../services/chat-group-signalr.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-join-group',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './join-group.component.html',
    styleUrls: ['./join-group.component.css']
})
export class JoinGroupComponent {
    username: string = '';
    joinGroupName: string = '';
    isJoining: boolean = false;

    constructor(
        private signalRService: ChatGroupSignalrService,
        private router: Router,
        private snackbarService: SnackbarService
    ) { }

    onJoinGroupWithDetails(): void {
        if (!this.username.trim()) {
            this.snackbarService.show('Please enter a username');
            return;
        }

        if (!this.joinGroupName.trim()) {
            this.snackbarService.show('Please enter a room number');
            return;
        }

        const password = sessionStorage.getItem('passcode') || '';

        const groupNameNumber = parseInt(this.joinGroupName, 10);
        if (isNaN(groupNameNumber)) {
            this.snackbarService.show('Room number must be a valid number');
            return;
        }

        console.log('Connecting to SignalR and joining group:', groupNameNumber, 'as user:', this.username);

        this.isJoining = true;
        this.signalRService.startConnection()
            .then(() => {
                console.log('Successfully connected to chatHub');
                return this.signalRService.invokeHubMethod('JoinChatGroup', groupNameNumber.toString(), this.username, password);
            })
            .then(() => {
                console.log('Successfully joined group');
                // Save group name and username to session storage
                sessionStorage.setItem('groupName', groupNameNumber.toString());
                sessionStorage.setItem('username', this.username);
                // Set joined group in SignalRService
                this.signalRService.setJoinedGroup(groupNameNumber.toString(), this.username);
                this.isJoining = false;
                this.router.navigate(['/group', groupNameNumber], {
                    state: { username: this.username }
                });
            })
            .catch((error) => {
                console.error('Error joining chat group:', error);
                this.isJoining = false;
                this.snackbarService.show('Failed to join chat group. Please try again.');
            });
    }
}
