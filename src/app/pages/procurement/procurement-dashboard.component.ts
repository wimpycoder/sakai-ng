import { Component } from '@angular/core';

@Component({
    selector: 'app-procurement-dashboard',
    standalone: true,
    template: `
        <div class="p-6">
            <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-6">Procurement Dashboard</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-surface-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-2">Suppliers</h2>
                    <p class="text-surface-600 dark:text-surface-400">Manage supplier information</p>
                </div>
                <div class="bg-white dark:bg-surface-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-2">Purchase Orders</h2>
                    <p class="text-surface-600 dark:text-surface-400">Create and track purchase orders</p>
                </div>
                <div class="bg-white dark:bg-surface-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-2">Requisitions</h2>
                    <p class="text-surface-600 dark:text-surface-400">Manage purchase requisitions</p>
                </div>
            </div>
        </div>
    `
})
export class ProcurementDashboard {}
