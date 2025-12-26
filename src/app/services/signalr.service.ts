import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection: signalR.HubConnection | null = null;
    private connectionStatus = new BehaviorSubject<string>('Disconnected');

    public connectionStatus$ = this.connectionStatus.asObservable();

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
            })
            .catch(err => {
                console.error('Error while starting SignalR connection: ', err);
                this.connectionStatus.next('Connection Failed');
                throw err;
            });
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

    public invokeHubMethod<T>(methodName: string, ...args: any[]): Promise<T> {
        if (!this.hubConnection) {
            return Promise.reject('No hub connection established');
        }
        return this.hubConnection.invoke<T>(methodName, ...args);
    }
}
