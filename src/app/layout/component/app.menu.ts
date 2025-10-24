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
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Administration',
                icon: 'pi pi-fw pi-shield',
                visible: this.authService.isAdmin(), // Only show for Admin users
                items: [
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
                label: 'Ken Dimaymay',
                icon: 'pi pi-fw pi-shield',
                visible: this.authService.isAdmin(), // Only show for Admin users
                items: [
                    {
                        label: 'Basta',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/kind/of']
                    },
                    {
                        label: 'mao ni',
                        icon: 'pi pi-fw pi-user-edit',
                        routerLink: ['/ken/dimaymay']
                    }
                ]
            },
        ];
    }
}
