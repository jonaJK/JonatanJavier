import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertConfig } from '@shared/models/alert-config.model';

@Component({
    selector: 'app-alert',
    imports: [CommonModule],
    templateUrl: './alert.html',
    styleUrl: './alert.css',
})
export class Alert {
    alertConfig = input.required<AlertConfig>();
}
