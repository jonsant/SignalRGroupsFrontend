import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { JoinGroupComponent } from './components/join-group/join-group.component';
import { GroupPageComponent } from './components/group-page/group-page.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'create-group', component: CreateGroupComponent },
    { path: 'join-group', component: JoinGroupComponent },
    { path: 'group/:id', component: GroupPageComponent },
    { path: '**', redirectTo: '' }
];
