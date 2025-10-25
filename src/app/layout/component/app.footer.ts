import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Made with love by
        <a href="https://pentahivesolutions.com" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">PentaHive Solutions !</a>
    </div>`
})
export class AppFooter {}
