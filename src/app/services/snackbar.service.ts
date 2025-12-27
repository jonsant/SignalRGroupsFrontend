import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SnackbarMessage {
    message: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private snackbarSubject = new Subject<SnackbarMessage>();
    public snackbar$ = this.snackbarSubject.asObservable();

    show(message: string, duration: number = 3000): void {
        this.snackbarSubject.next({ message, duration });
    }
}
