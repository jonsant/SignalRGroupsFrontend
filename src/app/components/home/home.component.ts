import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    title = 'Chat Groups';
    connectionStatus: string = 'Disconnected';
    passcode: string = '';
    authorized: boolean = false;
    loading: boolean = false;
    errorMsg: string = '';

    constructor(
        private signalRService: SignalRService,
        private router: Router,
        private snackbarService: SnackbarService,
        private apiService: ApiService
    ) {
        this.signalRService.connectionStatus$.subscribe(status => {
            this.connectionStatus = status;
        });
    }

    ngOnInit(): void {
        // Check session storage for existing passcode
        const storedPasscode = sessionStorage.getItem('passcode');
        if (storedPasscode) {
            this.passcode = storedPasscode;
            this.loading = true;
            this.apiService.Authorize(storedPasscode).subscribe({
                next: () => {
                    this.authorized = true;
                    this.loading = false;
                },
                error: (err) => {
                    // If stored passcode is invalid, clear it
                    sessionStorage.removeItem('passcode');
                    this.passcode = '';
                    this.loading = false;
                }
            });
        }
    }

    onEnterPasscode(): void {
        if (!this.passcode.trim()) {
            this.errorMsg = 'Please enter a passcode';
            return;
        }

        this.errorMsg = '';
        this.loading = true;

        this.apiService.Authorize(this.passcode).subscribe({
            next: () => {
                this.authorized = true;
                this.loading = false;
                // Save passcode to session storage
                sessionStorage.setItem('passcode', this.passcode);
            },
            error: (err) => {
                this.errorMsg = 'Authorization failed. Please check your passcode.';
                this.loading = false;
            }
        });
    }

    onCreateGroup(): void {
        this.router.navigate(['/create-group']);
    }

    onJoinGroup(): void {
        this.router.navigate(['/join-group']);
    }
}
