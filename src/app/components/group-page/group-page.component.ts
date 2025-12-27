import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-group-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './group-page.component.html',
    styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit, OnDestroy {
    groupName: number | null = null;
    username: string = '';
    chatMessages: { username: string; message: string }[] = [];
    private messageSub?: Subscription;

    constructor(private route: ActivatedRoute, private signalRService: SignalRService) { }

    ngOnInit(): void {
        // Get group name from route params
        this.route.params.subscribe(params => {
            this.groupName = +params['id'];
        });

        // Get username from navigation state
        const navigation = window.history.state;
        if (navigation && navigation.username) {
            this.username = navigation.username;
        }

        // If not already joined, check sessionStorage and try to join
        if (!this.signalRService.hasJoinedGroup()) {
            const storedGroupName = sessionStorage.getItem('groupName');
            const storedUsername = sessionStorage.getItem('username');
            if (storedGroupName && storedUsername) {
                this.groupName = +storedGroupName;
                this.username = storedUsername;
                this.signalRService.invokeHubMethod('JoinChatGroup', storedGroupName, storedUsername)
                    .then(() => {
                        console.log('Joined group after refresh or direct load');
                    })
                    .catch((error) => {
                        console.error('Error joining chat group after refresh:', error);
                    });
            }
        }

        // Subscribe to SignalR messages
        this.messageSub = this.signalRService.message$.subscribe(msg => {
            this.chatMessages.push(msg);
        });
    }

    ngOnDestroy(): void {
        this.messageSub?.unsubscribe();
    }

    copyGroupName(): void {
        if (this.groupName !== null) {
            navigator.clipboard.writeText(this.groupName.toString())
                .then(() => {
                    alert('Group name copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                    alert('Failed to copy group name');
                });
        }
    }
}
