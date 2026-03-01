import { Component, signal, HostListener, output } from '@angular/core';

@Component({
    selector: 'app-popupmenu',
    imports: [],
    templateUrl: './popupmenu.html',
    styleUrl: './popupmenu.css',
})
export class Popupmenu {
    isOpen = signal(false);

    edit = output<void>();
    delete = output<void>();

    @HostListener('document:click')
    close() {
        this.isOpen.set(false);
    }

    toggleMenu(event: Event) {
        event.stopPropagation();
        this.isOpen.update((isOpen) => !isOpen);
    }

    onEdit() {
        this.edit.emit();
        this.isOpen.set(false);
    }

    onDelete() {
        this.delete.emit();
        this.isOpen.set(false);
    }
}
