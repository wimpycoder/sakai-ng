import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../service/auth.service';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, MessageModule],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="300.000000pt" height="165.000000pt" viewBox="0 0 300.000000 165.000000" preserveAspectRatio="xMidYMid meet" class="mx-auto" style="fill: var(--primary-color)">
                                <g transform="translate(0.000000,165.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path d="M1396 1341 c-49 -27 -95 -60 -102 -73 -8 -14 -13 -59 -14 -115 l0 -92 50 -60 c27 -33 54 -62 60 -66 5 -3 30 6 55 20 l45 27 0 66 c0 48 -5 71 -17 84 -13 15 -15 23 -7 36 15 23 48 27 64 8 10 -13 9 -20 -4 -41 -10 -16 -16 -46 -16 -89 l0 -64 46 -27 46 -27 25 24 c14 12 40 44 59 69 32 45 34 51 34 132 0 47 -5 97 -11 111 -11 24 -181 126 -210 126 -8 0 -54 -22 -103 -49z m186 -27 c95 -53 97 -56 99 -156 1 -73 -2 -92 -20 -121 -38 -61 -73 -79 -93 -47 -6 10 -18 16 -25 13 -17 -7 -18 99 -2 126 30 46 -22 97 -71 71 -19 -10 -21 -17 -15 -48 3 -21 9 -63 12 -94 4 -49 2 -58 -11 -58 -9 0 -16 -4 -16 -9 0 -5 -10 -11 -22 -15 -26 -6 -50 15 -84 74 -28 49 -26 182 4 212 29 29 133 87 159 87 11 1 50 -15 85 -35z"/>
                                    <path d="M1124 1216 c-10 -25 0 -50 22 -56 12 -3 44 -33 73 -67 28 -35 54 -63 57 -63 9 0 -18 44 -58 94 -22 28 -36 56 -33 64 3 8 0 21 -6 28 -15 18 -48 18 -55 0z"/>
                                    <path d="M1821 1216 c-7 -9 -11 -21 -8 -28 2 -7 -15 -40 -38 -73 -49 -71 -58 -85 -51 -85 3 0 29 28 57 63 29 34 61 64 73 67 30 8 30 64 0 68 -11 2 -26 -4 -33 -12z"/>
                                    <path d="M995 1039 c-49 -27 -93 -55 -97 -62 -11 -18 -10 -225 2 -247 11 -20 167 -110 191 -110 21 0 172 61 192 78 11 10 17 30 17 58 l0 43 -57 12 c-32 7 -83 12 -115 11 -61 -1 -77 12 -58 49 13 24 46 25 59 1 7 -12 31 -22 75 -30 36 -7 72 -15 81 -18 10 -4 15 0 15 15 0 12 9 29 20 38 11 10 20 22 20 27 0 5 -18 33 -41 62 -44 57 -148 124 -191 124 -12 0 -63 -23 -113 -51z m199 -21 c55 -33 65 -42 90 -80 17 -26 17 -30 2 -53 -25 -38 -104 -32 -158 13 -25 21 -72 -4 -76 -41 -5 -45 11 -55 91 -55 90 0 127 -13 127 -45 0 -32 -22 -49 -108 -80 l-72 -26 -73 38 c-39 21 -78 49 -84 62 -7 13 -13 61 -13 108 0 78 2 85 28 108 43 40 150 92 175 85 12 -3 44 -18 71 -34z"/>
                                    <path d="M1803 1054 c-56 -32 -143 -123 -143 -151 0 -5 9 -18 20 -28 11 -10 20 -27 20 -38 0 -12 5 -17 14 -14 8 3 43 11 77 18 40 8 69 19 77 31 17 24 49 23 62 -1 7 -15 5 -24 -8 -41 -16 -19 -22 -21 -40 -11 -17 9 -38 8 -94 -4 -40 -8 -76 -15 -80 -15 -17 0 -8 -87 10 -102 19 -17 170 -78 191 -78 24 0 180 90 191 110 17 31 13 236 -5 253 -26 27 -182 107 -207 107 -12 -1 -51 -16 -85 -36z m175 -36 c100 -55 102 -58 102 -162 0 -107 -7 -118 -93 -165 -71 -38 -86 -38 -177 -5 -55 21 -72 32 -76 50 -7 28 2 58 15 50 5 -4 11 -1 13 6 3 7 31 11 84 11 88 -1 104 6 104 47 0 49 -48 70 -89 39 -12 -10 -39 -21 -60 -24 -20 -3 -44 -10 -54 -16 -9 -5 -16 -6 -15 -2 1 5 -6 20 -16 36 -19 29 -18 32 27 89 23 29 111 76 145 77 19 1 56 -12 90 -31z"/>
                                    <path d="M1490 865 c0 -43 4 -75 10 -75 6 0 10 32 10 75 0 43 -4 75 -10 75 -6 0 -10 -32 -10 -75z"/>
                                    <path d="M1520 887 c0 -35 6 -49 29 -71 18 -17 31 -41 33 -62 4 -34 -8 -47 -18 -19 -7 17 -34 21 -34 5 0 -5 3 -10 8 -10 4 0 14 -5 22 -10 13 -9 12 -13 -6 -28 -16 -12 -23 -32 -26 -69 -3 -29 -1 -53 3 -53 5 0 9 22 9 49 0 45 3 51 55 100 31 29 56 62 58 76 1 13 6 27 10 31 13 13 -14 44 -56 64 l-42 21 30 -26 c17 -13 36 -25 43 -25 8 0 10 -5 6 -12 -5 -7 -7 -26 -5 -43 1 -21 -5 -37 -18 -49 -21 -19 -21 -19 -21 1 0 10 -13 32 -30 48 -25 24 -30 36 -30 77 0 26 -4 48 -10 48 -5 0 -10 -19 -10 -43z"/>
                                    <path d="M1457 914 c-3 -4 -3 -19 0 -35 3 -17 0 -35 -8 -45 -8 -10 -12 -39 -11 -77 1 -53 5 -65 27 -84 20 -18 25 -31 25 -68 0 -25 5 -45 10 -45 6 0 10 19 10 43 0 35 -6 49 -30 72 -26 25 -30 36 -30 85 0 31 4 60 9 66 21 23 19 109 -2 88z"/>
                                    <path d="M1551 905 c0 -22 31 -65 48 -65 18 0 12 19 -10 30 -11 6 -24 21 -29 33 -8 21 -9 21 -9 2z"/>
                                    <path d="M1388 889 c-20 -10 -40 -24 -44 -31 -13 -20 -4 -112 11 -124 8 -6 15 -20 15 -31 0 -11 11 -30 24 -42 15 -14 22 -30 19 -42 -3 -10 0 -19 6 -19 20 0 11 42 -14 66 -14 13 -25 32 -25 43 0 11 -5 23 -10 26 -14 9 -10 125 4 125 15 1 62 37 56 43 -3 3 -22 -3 -42 -14z"/>
                                    <path d="M1397 733 c3 -21 14 -47 24 -58 10 -11 19 -38 22 -60 l4 -40 1 41 c2 30 -3 46 -19 60 -16 15 -20 27 -16 56 4 28 1 38 -8 38 -10 0 -12 -10 -8 -37z"/>
                                    <path d="M1598 700 c-38 -37 -48 -55 -48 -80 0 -25 3 -31 16 -26 9 3 18 6 20 6 2 0 4 9 4 21 0 23 36 58 60 58 9 0 1 -12 -20 -31 l-35 -31 34 19 c39 22 48 39 31 60 -12 13 -18 10 -51 -22 -21 -20 -40 -47 -42 -58 -4 -18 -5 -17 -6 4 -1 27 56 91 92 103 10 4 15 11 12 17 -9 15 -16 11 -67 -40z"/>
                                    <path d="M1330 696 c0 -27 6 -39 31 -56 38 -28 47 -21 14 10 -14 13 -25 34 -25 46 0 13 -4 26 -10 29 -6 4 -10 -8 -10 -29z"/>
                                    <path d="M1180 604 c-121 -48 -130 -61 -130 -185 0 -55 4 -109 10 -119 13 -24 180 -120 209 -120 25 0 179 86 198 110 13 16 18 186 7 227 -5 19 -59 63 -76 63 -13 0 -97 -141 -100 -166 -3 -25 -7 -29 -33 -29 -25 0 -31 4 -33 27 -3 22 2 29 22 34 16 4 42 31 75 78 l49 72 -41 22 c-23 12 -49 22 -57 21 -8 0 -53 -16 -100 -35z m143 -31 c4 -20 -7 -37 -54 -85 -63 -64 -69 -80 -42 -110 36 -40 80 -15 101 58 15 51 45 87 77 91 33 5 38 -19 36 -153 l-1 -71 -81 -46 c-89 -50 -98 -50 -179 -3 -92 54 -99 70 -90 200 l5 79 93 37 c102 41 127 42 135 3z"/>
                                    <path d="M1653 616 l-31 -23 44 -64 c24 -35 57 -71 72 -80 18 -10 27 -24 27 -40 0 -20 -5 -24 -30 -24 -26 0 -31 4 -35 30 -5 29 -86 165 -99 165 -10 0 -55 -31 -68 -48 -16 -20 -18 -201 -2 -234 12 -27 167 -118 200 -118 29 0 196 97 209 120 6 10 10 63 10 118 0 127 -7 137 -133 186 -107 41 -121 42 -164 12z m214 -67 c18 -7 35 -20 38 -28 8 -21 8 -183 -1 -204 -8 -22 -119 -87 -160 -94 -21 -4 -46 3 -80 21 -65 34 -87 49 -96 61 -10 14 -10 197 0 213 17 26 89 -7 78 -35 -3 -8 -2 -11 4 -8 5 3 15 -14 21 -37 7 -24 19 -51 27 -60 37 -43 108 5 84 57 -6 13 -21 26 -33 30 -17 6 -19 9 -8 17 11 7 9 8 -6 6 -14 -3 -27 7 -42 32 -28 43 -28 45 -3 70 22 22 15 23 177 -41z"/>
                                    <path d="M1059 591 c-14 -5 -35 -14 -47 -20 -15 -8 -28 -8 -40 -2 -23 12 -52 -4 -52 -29 0 -11 10 -25 22 -31 19 -10 25 -8 43 15 11 14 25 26 30 26 6 0 28 11 50 25 41 25 39 29 -6 16z"/>
                                    <path d="M1900 595 c0 -3 22 -16 50 -29 27 -13 58 -33 68 -46 16 -19 22 -21 40 -11 12 6 22 20 22 31 0 24 -30 41 -52 29 -10 -6 -28 -4 -49 5 -50 20 -79 28 -79 21z"/>
                                    <path d="M1490 238 c0 -33 -6 -58 -16 -69 -20 -22 -3 -59 26 -59 29 0 46 37 26 59 -10 11 -16 36 -16 69 0 29 -4 52 -10 52 -5 0 -10 -23 -10 -52z"/>
                                </g>
                            </svg>
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to PentaHive Solutions!</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            @if (errorMessage) {
                                <p-message severity="error" [text]="errorMessage" styleClass="mb-4 w-full"></p-message>
                            }

                            <label for="username1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                            <input pInputText id="username1" type="text" placeholder="Username" class="w-full md:w-120 mb-8" [(ngModel)]="username" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" (onClick)="onLogin()" [loading]="isLoading"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    username: string = '';
    password: string = '';
    checked: boolean = false;
    errorMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    onLogin(): void {
        this.errorMessage = '';
        this.isLoading = true;

        if (!this.username || !this.password) {
            this.errorMessage = 'Please enter both username and password';
            this.isLoading = false;
            return;
        }

        this.authService.login({ username: this.username, password: this.password }).subscribe({
            next: (response) => {
                this.isLoading = false;
                // Navigate to dashboard or home page
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.isLoading = false;

                if (error.status === 403) {
                    this.errorMessage = error.error?.message || 'Your account has been deactivated';
                } else if (error.status === 401) {
                    this.errorMessage = 'Invalid username or password';
                } else {
                    this.errorMessage = 'An error occurred during login. Please try again.';
                }
            }
        });
    }
}
