import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-snackbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit {
    message: string = '';
    isVisible: boolean = false;
    private hideTimeout: any;

    constructor(private snackbarService: SnackbarService) { }

    ngOnInit(): void {
        this.snackbarService.snackbar$.subscribe(snackbar => {
            this.message = snackbar.message;
            this.isVisible = true;

            // Clear any existing timeout
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
            }

            // Hide after duration
            this.hideTimeout = setTimeout(() => {
                this.isVisible = false;
            }, snackbar.duration || 3000);
        });
    }

    ngOnDestroy(): void {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
    }
}
