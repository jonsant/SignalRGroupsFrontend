import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-groups-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-groups-menu.component.html',
  styleUrl: './chat-groups-menu.component.css'
})
export class ChatGroupsMenuComponent {
  title = 'Chat Groups';

  constructor(private router: Router) { }

  onCreateGroup(): void {
    this.router.navigate(['/create-group']);
  }

  onJoinGroup(): void {
    this.router.navigate(['/join-group']);
  }

  onBack(): void {
    this.router.navigate(['/menu']);
  }
}
