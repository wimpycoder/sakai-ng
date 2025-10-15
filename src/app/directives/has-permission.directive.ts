import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../pages/service/auth.service';

@Directive({
    selector: '[hasPermission]',
    standalone: true
})
export class HasPermissionDirective implements OnInit {
    private permissions: string[] = [];

    @Input() set hasPermission(permissions: string | string[]) {
        this.permissions = Array.isArray(permissions) ? permissions : [permissions];
        this.updateView();
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.updateView();
    }

    private updateView() {
        if (this.authService.hasAnyPermission(this.permissions)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
