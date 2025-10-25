export const inventoryMenu = [
    {
        label: 'Inventory',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: ['/inventory']
            },
            {
                label: 'Items',
                icon: 'pi pi-box',
                routerLink: ['/inventory/items']
            },
            {
                label: 'Stock Levels',
                icon: 'pi pi-chart-line',
                routerLink: ['/inventory/stock-levels']
            },
            {
                label: 'Warehouses',
                icon: 'pi pi-building',
                routerLink: ['/inventory/warehouses']
            },
            {
                label: 'Stock Adjustments',
                icon: 'pi pi-arrow-right-arrow-left',
                routerLink: ['/inventory/adjustments']
            },
            {
                label: 'Reports',
                icon: 'pi pi-chart-bar',
                routerLink: ['/inventory/reports']
            }
        ]
    }
];
