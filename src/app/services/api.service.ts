import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    Authorize(passcode: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/authorize`, { passcode });
    }
}
