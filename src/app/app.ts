import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/layout/header/header';
import { ConfirmModal } from '@shared/components/confirm-modal/confirm-modal';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, ConfirmModal],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {}
