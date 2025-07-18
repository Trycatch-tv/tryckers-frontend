import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [ButtonModule, RouterModule, RippleModule, ButtonModule],
    templateUrl: './unauthorized.html'
})
export class Unauthorized {}
