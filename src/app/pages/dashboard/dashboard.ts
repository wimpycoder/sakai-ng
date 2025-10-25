import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule],
    template: `
        <div class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-0 mb-12">Select a Module</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                <!-- Procurement Module Card -->
                <div
                    class="bg-white dark:bg-surface-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary-500"
                    (click)="navigateToModule('procurement')">
                    <div class="p-8 flex flex-col items-center">
                        <div class="w-48 h-48 mb-6 flex items-center justify-center">
                            <img src="assets/modules/procurement.svg" alt="Procurement" class="w-full h-full object-contain" />
                        </div>
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-3">Procurement</h2>
                        <p class="text-surface-600 dark:text-surface-400 text-center">Manage suppliers, purchase orders, and procurement processes</p>
                    </div>
                </div>

                <!-- Inventory Module Card -->
                <div
                    class="bg-white dark:bg-surface-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary-500"
                    (click)="navigateToModule('inventory')">
                    <div class="p-8 flex flex-col items-center">
                        <div class="w-48 h-48 mb-6 flex items-center justify-center">
                            <img src="assets/modules/inventory.svg" alt="Inventory" class="w-full h-full object-contain" />
                        </div>
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-3">Inventory</h2>
                        <p class="text-surface-600 dark:text-surface-400 text-center">Track stock levels, manage warehouses, and control inventory</p>
                    </div>
                </div>

                <!-- Sales Module Card -->
                <div
                    class="bg-white dark:bg-surface-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary-500"
                    (click)="navigateToModule('sales')">
                    <div class="p-8 flex flex-col items-center">
                        <div class="w-48 h-48 mb-6 flex items-center justify-center">
                            <img src="assets/modules/sales.svg" alt="Sales" class="w-full h-full object-contain" />
                        </div>
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-3">Sales</h2>
                        <p class="text-surface-600 dark:text-surface-400 text-center">Manage customers, orders, and sales operations</p>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
        }
    `]
})
export class Dashboard {
    constructor(private router: Router) {}

    navigateToModule(module: string) {
        this.router.navigate([`/${module}`]);
    }
}
