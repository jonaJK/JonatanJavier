import { Component, input } from '@angular/core';

@Component({
    selector: 'app-skeleton-bar',
    imports: [],
    templateUrl: './skeleton-bar.html',
    styleUrl: './skeleton-bar.css',
})
export class SkeletonBar {
    width = input<string>('100%');
    height = input<string>('20px');
}
