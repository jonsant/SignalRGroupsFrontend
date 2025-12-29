import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { ChatGroupsMenuComponent } from './components/chat-groups/chat-groups-menu/chat-groups-menu.component';
import { CreateGroupComponent } from './components/chat-groups/create-group/create-group.component';
import { JoinGroupComponent } from './components/chat-groups/join-group/join-group.component';
import { GroupPageComponent } from './components/chat-groups/group-page/group-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'menu', component: MenuComponent, canActivate: [authGuard] },
    { path: 'chat-groups-menu', component: ChatGroupsMenuComponent, canActivate: [authGuard] },
    { path: 'create-group', component: CreateGroupComponent, canActivate: [authGuard] },
    { path: 'join-group', component: JoinGroupComponent, canActivate: [authGuard] },
    { path: 'group/:id', component: GroupPageComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
