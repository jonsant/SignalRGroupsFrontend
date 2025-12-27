import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-group-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './group-page.component.html',
    styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('messagesContainer') private chatMessagesContainer?: ElementRef;
    groupName: number | null = null;
    username: string = '';
    chatMessages: { username: string; message: string }[] = [];
    newMessage: string = '';
    private messageSub?: Subscription;
    private shouldScroll = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private signalRService: SignalRService,
        private snackbarService: SnackbarService
    ) { }

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
                        this.GoHome();
                    });
            }
            else {
                console.error('Error joining chat group after refresh');
                this.GoHome();
                return;
            }
        }

        // Subscribe to SignalR messages
        this.messageSub = this.signalRService.message$.subscribe(msg => {
            this.chatMessages.push(msg);
            this.shouldScroll = true;
        });
    }

    GoHome() {
        sessionStorage.removeItem('groupName');
        sessionStorage.removeItem('username');
        this.router.navigate(['/']);
    }

    ngOnDestroy(): void {
        this.messageSub?.unsubscribe();
    }

    ngAfterViewChecked(): void {
        if (this.shouldScroll) {
            this.shouldScroll = false;
            setTimeout(() => this.scrollToBottom(), 0);
        }
    }

    private scrollToBottom(): void {
        try {
            if (this.chatMessagesContainer) {
                const element = this.chatMessagesContainer.nativeElement;
                element.scrollTop = element.scrollHeight;
            }
        } catch (err) {
            console.error('Error scrolling to bottom:', err);
        }
    }

    sendMessage(): void {
        if (!this.newMessage.trim()) {
            return;
        }

        if (this.groupName === null) {
            this.snackbarService.show('Unable to send message: No group selected');
            return;
        }

        this.signalRService.invokeHubMethod('SendMessageToGroup', this.groupName.toString(), this.username, this.newMessage)
            .then(() => {
                this.newMessage = '';
                this.shouldScroll = true;
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                this.snackbarService.show('Failed to send message');
            });
    }

    copyGroupName(): void {
        if (this.groupName !== null) {
            navigator.clipboard.writeText(this.groupName.toString())
                .then(() => {
                    this.snackbarService.show('Group number was copied!');
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                    this.snackbarService.show('Failed to copy group name');
                });
        }
    }

    exitRoom(): void {
        if (this.groupName === null) {
            this.router.navigate(['/']);
            return;
        }

        this.signalRService.invokeHubMethod('LeaveChatGroup', this.groupName.toString())
            .then(() => {
                sessionStorage.removeItem('groupName');
                sessionStorage.removeItem('username');
                return this.signalRService.stopConnection();
            })
            .then(() => {
                this.router.navigate(['/']);
            })
            .catch((error) => {
                console.error('Error leaving chat group:', error);
                // Clear session and navigate anyway
                sessionStorage.removeItem('groupName');
                sessionStorage.removeItem('username');
                this.signalRService.stopConnection()
                    .finally(() => {
                        this.router.navigate(['/']);
                    });
            });
    }
}
