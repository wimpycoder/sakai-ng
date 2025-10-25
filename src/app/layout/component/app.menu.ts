import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../pages/service/auth.service';
import { procurementMenu } from '../../pages/procurement/procurement.menu';
import { inventoryMenu } from '../../pages/inventory/inventory.menu';
import { salesMenu } from '../../pages/sales/sales.menu';
import { filter } from 'rxjs/operators';

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

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        // Set initial menu
        this.updateMenu(this.router.url);

        // Listen to route changes and update menu accordingly
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.updateMenu(event.urlAfterRedirects);
            });
    }

    private updateMenu(url: string) {
        const userRole = this.authService.getUserRole();

        // Check if we're in a module route
        if (url.startsWith('/procurement')) {
            this.model = [this.getBackToModulesItem(), ...procurementMenu];
        } else if (url.startsWith('/inventory')) {
            this.model = [this.getBackToModulesItem(), ...inventoryMenu];
        } else if (url.startsWith('/sales')) {
            this.model = [this.getBackToModulesItem(), ...salesMenu];
        } else {
            // Default menu (dashboard)
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

    private getBackToModulesItem(): MenuItem {
        return {
            separator: false,
            label: 'Navigation',
            items: [
                {
                    label: 'Back to Modules',
                    icon: 'pi pi-fw pi-arrow-left',
                    routerLink: ['/']
                }
            ]
        };
    }
}
