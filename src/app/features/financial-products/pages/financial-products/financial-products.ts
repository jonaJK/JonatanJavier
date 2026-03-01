import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    DestroyRef,
    inject,
    signal,
    computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap } from 'rxjs';

import { FinancialProductsTable } from '@features/financial-products/components/financial-products-table/financial-products-table';
import { Search } from '@shared/components/search/search';
import { Paginator } from '@shared/components/paginator/paginator';

import { Product } from '@features/financial-products/models/product.model';
import { PaginatorState } from '@shared/models/paginator-state.model';

import { FinancialProductsService } from '@features/financial-products/services/financial-products';
import { ConfirmModalService } from '@core/services/confirm-modal';

@Component({
    selector: 'app-financial-products',
    imports: [FinancialProductsTable, Search, Paginator],
    templateUrl: './financial-products.html',
    styleUrl: './financial-products.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialProducts implements OnInit {
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private financialProductsService = inject(FinancialProductsService);
    private confirmModalService = inject(ConfirmModalService);

    isLoading = signal(false);
    products = signal<Product[]>([]);
    searchText = signal('');
    currentPagination = signal<PaginatorState>({ page: 1, size: 5 });

    filteredProducts = computed(() => {
        const searchText = this.searchText().toLowerCase().trim();
        if (!searchText) return this.products();

        return this.products().filter(
            (product) =>
                product.name.toLowerCase().includes(searchText) ||
                product.description.toLowerCase().includes(searchText),
        );
    });

    paginatedProducts = computed(() => {
        const filteredProducts = this.filteredProducts();
        const pagination = this.currentPagination();
        const startIndex = (pagination.page - 1) * pagination.size;
        const endIndex = startIndex + pagination.size;

        return filteredProducts.slice(startIndex, endIndex);
    });

    totalProducts = computed(() => this.filteredProducts().length);

    ngOnInit(): void {
        this.getFinancialProducts();
    }

    getFinancialProducts(): void {
        this.isLoading.set(true);
        this.financialProductsService
            .getProducts()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.products.set(response.data);
                    this.isLoading.set(false);
                },
                error: () => this.isLoading.set(false),
            });
    }

    handleDelete(currentProduct: Product): void {
        this.confirmModalService
            .open(currentProduct.name)
            .pipe(
                filter((confirmed) => confirmed && !this.isLoading()),
                tap(() => this.isLoading.set(true)),
                switchMap(() => this.financialProductsService.deleteProduct(currentProduct.id)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: () => {
                    this.getFinancialProducts();
                },
                error: () => {
                    this.isLoading.set(false);
                },
            });
    }

    handleEdit(currentProductId: string): void {
        this.router.navigate(['product/edit', currentProductId]);
    }

    onSearchTextChange(searchText: string): void {
        this.searchText.set(searchText);
        this.currentPagination.set({ ...this.currentPagination(), page: 1 });
    }

    onPageChange(pagination: PaginatorState): void {
        this.currentPagination.set(pagination);
    }

    navigateToRegister(): void {
        this.router.navigateByUrl('product/new');
    }
}
