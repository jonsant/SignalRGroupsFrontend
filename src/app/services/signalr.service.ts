import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection: signalR.HubConnection | null = null;
    private connectionStatus = new BehaviorSubject<string>('Disconnected');

    private messageSubject = new ReplaySubject<{ username: string; message: string }>(100);
    public message$: Observable<{ username: string; message: string }> = this.messageSubject.asObservable();

    private groupMembersSubject = new BehaviorSubject<string[]>([]);
    public currentGroupMembers$: Observable<string[]> = this.groupMembersSubject.asObservable();

    public connectionStatus$ = this.connectionStatus.asObservable();


    private joinedGroup: { groupName: string; username: string } | null = null;

    public hasJoinedGroup(): boolean {
        return this.joinedGroup !== null;
    }

    public setJoinedGroup(groupName: string, username: string): void {
        this.joinedGroup = { groupName, username };
    }

    public getJoinedGroup(): { groupName: string; username: string } | null {
        return this.joinedGroup;
    }

    constructor() { }

    public startConnection(hubUrl: string = 'https://localhost:7058/chatHub'): Promise<void> {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        return this.hubConnection
            .start()
            .then(() => {
                console.log('SignalR Connection started successfully');
                this.connectionStatus.next('Connected');
                // Register ReceiveMessage handler
                this.registerReceiveMessageHandler();
                // Register GroupMembersChanged handler
                this.registerGroupMembersChangedHandler();
            })
            .catch(err => {
                console.error('Error while starting SignalR connection: ', err);
                this.connectionStatus.next('Connection Failed');
                throw err;
            });
    }
    private registerReceiveMessageHandler(): void {
        if (this.hubConnection) {
            this.hubConnection.on('ReceiveMessage', (username: string, message: string) => {
                this.messageSubject.next({ username, message });
            });
        }
    }

    private registerGroupMembersChangedHandler(): void {
        if (this.hubConnection) {
            this.hubConnection.on('GroupMembersChanged', (members: string[]) => {
                this.groupMembersSubject.next(members);
            });
        }
    }

    public stopConnection(): Promise<void> {
        if (this.hubConnection) {
            return this.hubConnection.stop().then(() => {
                console.log('SignalR Connection stopped');
                this.connectionStatus.next('Disconnected');
            });
        }
        return Promise.resolve();
    }

    public getConnection(): signalR.HubConnection | null {
        return this.hubConnection;
    }

    public isConnected(): boolean {
        return this.hubConnection?.state === signalR.HubConnectionState.Connected;
    }

    public async invokeHubMethod<T>(methodName: string, ...args: any[]): Promise<T> {
        if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
            try {
                await this.startConnection();
            } catch (err) {
                return Promise.reject('Failed to establish SignalR connection: ' + err);
            }
        }
        // If joining group, update joinedGroup state
        if (methodName === 'JoinChatGroup' && args.length >= 2) {
            this.setJoinedGroup(args[0], args[1]);
        }
        return this.hubConnection!.invoke<T>(methodName, ...args);
    }
}
