import { Component } from '@angular/core';

@Component({
    selector: 'app-sales-dashboard',
    standalone: true,
    template: `
        <div class="p-6">
            <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-6">Sales Dashboard</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-surface-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-2">Customers</h2>
                    <p class="text-surface-600 dark:text-surface-400">Manage customer information</p>
                </div>
                <div class="bg-white dark:bg-surface-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-2">Sales Orders</h2>
                    <p class="text-surface-600 dark:text-surface-400">Create and track sales orders</p>
                </div>
                <div class="bg-white dark:bg-surface-800 rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-2">Quotations</h2>
                    <p class="text-surface-600 dark:text-surface-400">Manage sales quotations</p>
                </div>
            </div>
        </div>
    `
})
export class SalesDashboard {}
