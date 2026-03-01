import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ConfirmModalService {
    private confirmSubject!: Subject<boolean>;

    isOpen = signal<boolean>(false);
    productName = signal<string>('');

    open(productName: string): Subject<boolean> {
        this.productName.set(productName);
        this.isOpen.set(true);
        this.confirmSubject = new Subject<boolean>();

        return this.confirmSubject;
    }

    confirm(): void {
        this.isOpen.set(false);
        this.confirmSubject.next(true);
        this.confirmSubject.complete();
    }

    cancel(): void {
        this.isOpen.set(false);
        this.confirmSubject.next(false);
        this.confirmSubject.complete();
    }
}
