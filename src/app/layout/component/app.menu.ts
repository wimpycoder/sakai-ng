import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../pages/service/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    constructor(private authService: AuthService) {}

    ngOnInit() {
        const userRole = this.authService.getUserRole();

        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Administration',
                icon: 'pi pi-fw pi-shield',
                visible: userRole === 'Admin',
                items: [
                    {
                        label: 'Company Management',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/admin/companies']
                    },
                    {
                        label: 'Role Management',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/admin/roles']
                    },
                    {
                        label: 'User Management',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: ['/admin/users']
                    }
                ]
            },
            {
                label: 'Management',
                icon: 'pi pi-fw pi-briefcase',
                visible: userRole === 'Manager',
                items: [
                    {
                        label: 'User Management',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: ['/manager/users']
                    },
                    {
                        label: 'Branch Management',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/manager/branches']
                    }
                ]
            }
        ];
    }
}
