import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    title = 'Chat Groups';
    connectionStatus: string = 'Disconnected';

    constructor(
        private signalRService: SignalRService,
        private router: Router,
        private snackbarService: SnackbarService
    ) {
        this.signalRService.connectionStatus$.subscribe(status => {
            this.connectionStatus = status;
        });
    }

    onCreateGroup(): void {
        this.router.navigate(['/create-group']);
    }

    onJoinGroup(): void {
        this.router.navigate(['/join-group']);
    }
}
