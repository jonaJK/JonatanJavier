import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkeletonBar } from '@shared/components/skeleton-bar/skeleton-bar';
import { Popupmenu } from '@shared/components/popupmenu/popupmenu';

import { Product } from '@features/financial-products/models/product.model';

@Component({
    selector: 'app-financial-products-table',
    imports: [CommonModule, Popupmenu, SkeletonBar],
    templateUrl: './financial-products-table.html',
    styleUrl: './financial-products-table.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialProductsTable {
    products = input.required<Product[]>();
    isLoading = input.required<boolean>();

    deleteEmitter = output<Product>();
    editEmitter = output<string>();

    onEdit(productId: string): void {
        this.editEmitter.emit(productId);
    }

    onDelete(product: Product): void {
        this.deleteEmitter.emit(product);
    }
}
