export const procurementMenu = [
    {
        label: 'Procurement',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: ['/procurement']
            },
            {
                label: 'Suppliers',
                icon: 'pi pi-building',
                routerLink: ['/procurement/suppliers']
            },
            {
                label: 'Purchase Orders',
                icon: 'pi pi-shopping-cart',
                routerLink: ['/procurement/purchase-orders']
            },
            {
                label: 'Requisitions',
                icon: 'pi pi-file-edit',
                routerLink: ['/procurement/requisitions']
            },
            {
                label: 'Reports',
                icon: 'pi pi-chart-bar',
                routerLink: ['/procurement/reports']
            }
        ]
    }
];
