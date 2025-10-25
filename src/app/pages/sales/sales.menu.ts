export const salesMenu = [
    {
        label: 'Sales',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: ['/sales']
            },
            {
                label: 'Customers',
                icon: 'pi pi-users',
                routerLink: ['/sales/customers']
            },
            {
                label: 'Sales Orders',
                icon: 'pi pi-shopping-cart',
                routerLink: ['/sales/orders']
            },
            {
                label: 'Quotations',
                icon: 'pi pi-file-edit',
                routerLink: ['/sales/quotations']
            },
            {
                label: 'Invoices',
                icon: 'pi pi-receipt',
                routerLink: ['/sales/invoices']
            },
            {
                label: 'Reports',
                icon: 'pi pi-chart-bar',
                routerLink: ['/sales/reports']
            }
        ]
    }
];
