import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';

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

    constructor(
        private signalRService: SignalRService,
        private router: Router
    ) { }

    onJoinGroupWithDetails(): void {
        if (!this.username.trim()) {
            alert('Please enter a username');
            return;
        }

        if (!this.joinGroupName.trim()) {
            alert('Please enter a group name');
            return;
        }

        const groupNameNumber = parseInt(this.joinGroupName, 10);
        if (isNaN(groupNameNumber)) {
            alert('Group name must be a valid number');
            return;
        }

        console.log('Joining group:', groupNameNumber, 'as user:', this.username);

        this.signalRService.invokeHubMethod('JoinChatGroup', this.username, groupNameNumber)
            .then(() => {
                console.log('Successfully joined group');
                this.router.navigate(['/group', groupNameNumber], {
                    state: { username: this.username }
                });
            })
            .catch((error) => {
                console.error('Error joining chat group:', error);
                alert('Failed to join chat group. Please try again.');
            });
    }
}
