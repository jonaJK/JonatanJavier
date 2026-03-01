import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PaginatorState } from '@shared/models/paginator-state.model';

@Component({
    selector: 'app-paginator',
    imports: [CommonModule, FormsModule],
    templateUrl: './paginator.html',
    styleUrl: './paginator.css',
})
export class Paginator {
    totalItems = input.required<number>();
    pageChange = output<PaginatorState>();

    currentPage = signal(1);
    currentPageSize = signal(5);
    pageSizeOptions = [5, 10, 20];

    totalPages = computed(() => Math.ceil(this.totalItems() / this.currentPageSize()));

    pagesList = computed(() => {
        const totalPages = this.totalPages();
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    });

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page);

            this.emitPaginationChange();
        }
    }

    onPageSizeChange(): void {
        this.currentPage.set(1);

        this.emitPaginationChange();
    }

    emitPaginationChange(): void {
        this.pageChange.emit({
            page: this.currentPage(),
            size: this.currentPageSize(),
        });
    }
}
