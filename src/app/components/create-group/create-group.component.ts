import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-create-group',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-group.component.html',
    styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent {
    username: string = '';
    isCreating: boolean = false;

    constructor(
        private signalRService: SignalRService,
        private router: Router,
        private snackbarService: SnackbarService
    ) { }

    onCreateGroupWithUsername(): void {
        if (!this.username.trim()) {
            this.snackbarService.show('Please enter a username');
            return;
        }

        this.isCreating = true;
        console.log('Connecting to SignalR and creating group with username:', this.username);

        this.signalRService.startConnection()
            .then(() => {
                console.log('Successfully connected to chatHub');
                return this.signalRService.invokeHubMethod<number>('CreateChatGroup', this.username);
            })
            .then((response) => {
                console.log('Chat group created successfully:', response);
                // Save group name and username to session storage
                sessionStorage.setItem('groupName', response.toString());
                sessionStorage.setItem('username', this.username);
                // Set joined group in SignalRService
                this.signalRService.setJoinedGroup(response.toString(), this.username);
                this.isCreating = false;
                this.router.navigate(['/group', response], {
                    state: { username: this.username }
                });
            })
            .catch((error) => {
                console.error('Error creating chat group:', error);
                this.isCreating = false;
                this.snackbarService.show('Failed to create chat group. Please try again.');
            });
    }
}
