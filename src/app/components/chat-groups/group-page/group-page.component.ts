import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatGroupSignalrService } from '../../../services/chat-group-signalr.service';
import { SnackbarService } from '../../../services/snackbar.service';
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
    groupMembers: string[] = [];
    newMessage: string = '';
    private messageSub?: Subscription;
    private membersSub?: Subscription;
    private shouldScroll = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private signalRService: ChatGroupSignalrService,
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
            this.signalRService.clearGroupData();
            const storedGroupName = sessionStorage.getItem('groupName');
            const storedUsername = sessionStorage.getItem('username');
            const storedPasscode = sessionStorage.getItem('passcode');
            if (storedGroupName && storedUsername && storedPasscode) {
                this.groupName = +storedGroupName;
                this.username = storedUsername;
                this.signalRService.invokeHubMethod('JoinChatGroup', storedGroupName, storedUsername, storedPasscode)
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

        // Subscribe to group members changes
        this.membersSub = this.signalRService.currentGroupMembers$.subscribe(members => {
            this.groupMembers = members;
        });
    }

    GoHome() {
        sessionStorage.removeItem('groupName');
        sessionStorage.removeItem('username');
        this.router.navigate(['/']);
    }

    ngOnDestroy(): void {
        this.messageSub?.unsubscribe();
        this.membersSub?.unsubscribe();
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

        const messageToSend = this.newMessage;
        this.newMessage = '';

        this.signalRService.invokeHubMethod('SendMessageToGroup', this.groupName.toString(), this.username, messageToSend)
            .then(() => {
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
                    this.snackbarService.show('Failed to copy group number');
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
                this.signalRService.clearGroupData();
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
                this.signalRService.clearGroupData();
                this.signalRService.stopConnection()
                    .finally(() => {
                        this.router.navigate(['/']);
                    });
            });
    }
}
