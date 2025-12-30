import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatGroupSignalrService } from '../../services/chat-group-signalr.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    title = 'Groups';
    connectionStatus: string = 'Disconnected';
    passcode: string = '';
    loading: boolean = false;
    errorMsg: string = '';
    requirePasscode = environment.requirePasscode;

    constructor(
        private signalRService: ChatGroupSignalrService,
        private router: Router,
        private snackbarService: SnackbarService,
        private apiService: ApiService
    ) {
        this.signalRService.connectionStatus$.subscribe(status => {
            this.connectionStatus = status;
        });
    }

    ngOnInit(): void {
        // If passcode not required, skip directly to menu
        if (!this.requirePasscode) {
            sessionStorage.setItem('passcode', '');
            this.router.navigate(['/menu']);
            return;
        }

        // Check session storage for existing passcode
        const storedPasscode = sessionStorage.getItem('passcode');
        if (storedPasscode) {
            this.passcode = storedPasscode;
            this.loading = true;
            this.apiService.Authorize(storedPasscode).subscribe({
                next: () => {
                    // Navigate to menu instead of showing buttons
                    this.router.navigate(['/menu']);
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
                // Save passcode to session storage
                sessionStorage.setItem('passcode', this.passcode);
                // Navigate to menu
                this.router.navigate(['/menu']);
            },
            error: (err) => {
                this.errorMsg = 'Authorization failed. Please check your passcode.';
                this.loading = false;
            }
        });
    }
}
