import { Component, ElementRef } from '@angular/core';
import { AppMenu } from '../menu/app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    templateUrl: './app.sidebar.html'
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
