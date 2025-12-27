import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-group-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './group-page.component.html',
    styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent implements OnInit {
    groupName: number | null = null;
    username: string = '';

    constructor(private route: ActivatedRoute) { }

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
    }

    copyGroupName(): void {
        if (this.groupName !== null) {
            navigator.clipboard.writeText(this.groupName.toString())
                .then(() => {
                    alert('Group name copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                    alert('Failed to copy group name');
                });
        }
    }
}
