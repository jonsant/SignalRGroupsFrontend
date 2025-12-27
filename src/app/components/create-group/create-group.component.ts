import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';

@Component({
    selector: 'app-create-group',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-group.component.html',
    styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent {
    username: string = '';

    constructor(
        private signalRService: SignalRService,
        private router: Router
    ) { }

    onCreateGroupWithUsername(): void {
        if (!this.username.trim()) {
            alert('Please enter a username');
            return;
        }

        console.log('Creating group with username:', this.username);

        this.signalRService.invokeHubMethod<number>('CreateChatGroup', this.username)
            .then((response) => {
                console.log('Chat group created successfully:', response);
                this.router.navigate(['/group', response], {
                    state: { username: this.username }
                });
            })
            .catch((error) => {
                console.error('Error creating chat group:', error);
                alert('Failed to create chat group. Please try again.');
            });
    }
}
