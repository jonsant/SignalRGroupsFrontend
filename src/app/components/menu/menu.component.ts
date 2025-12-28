import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  title = 'Choose Your Activity';

  constructor(private router: Router) { }

  onChatGroups(): void {
    // Navigate to chat groups options (you can create another component for this)
    // For now, let's create a simple selection between create and join
    this.router.navigate(['/chat-groups-menu']);
  }

  onGameOption2(): void {
    // Placeholder for future game
    console.log('Game 2 coming soon!');
  }

  onGameOption3(): void {
    // Placeholder for future game
    console.log('Game 3 coming soon!');
  }

  onLogout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
