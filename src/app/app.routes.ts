import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { ChatGroupsMenuComponent } from './components/chat-groups/chat-groups-menu/chat-groups-menu.component';
import { CreateGroupComponent } from './components/chat-groups/create-group/create-group.component';
import { JoinGroupComponent } from './components/chat-groups/join-group/join-group.component';
import { GroupPageComponent } from './components/chat-groups/group-page/group-page.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'chat-groups-menu', component: ChatGroupsMenuComponent },
    { path: 'create-group', component: CreateGroupComponent },
    { path: 'join-group', component: JoinGroupComponent },
    { path: 'group/:id', component: GroupPageComponent },
    { path: '**', redirectTo: '' }
];
