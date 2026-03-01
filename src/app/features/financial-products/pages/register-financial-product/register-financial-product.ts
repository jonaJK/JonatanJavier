import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    viewChild,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FinancialProductForm } from '@features/financial-products/components/financial-product-form/financial-product-form';
import { Alert } from '@shared/components/alert/alert';

import { FinancialProductsService } from '@features/financial-products/services/financial-products';

import { Product } from '@features/financial-products/models/product.model';
import { AlertConfig } from '@shared/models/alert-config.model';

@Component({
    selector: 'app-register-financial-product',
    imports: [FinancialProductForm, Alert],
    templateUrl: './register-financial-product.html',
    styleUrl: './register-financial-product.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFinancialProduct {
    private destroyRef = inject(DestroyRef);
    private financialProductsService = inject(FinancialProductsService);

    productFormComp = viewChild.required(FinancialProductForm);

    alertConfig = signal<AlertConfig | null>(null);
    isLoading = signal(false);

    registerProduct(data: Product): void {
        this.isLoading.set(true);
        this.financialProductsService
            .registerProduct(data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.isLoading.set(false);

                    this.productFormComp().resetForm();

                    this.alertConfig.set({
                        type: 'success',
                        title: 'Éxito',
                        description: 'Se ha registrado el producto satisfactoriamente',
                    });
                },
                error: () => {
                    this.isLoading.set(false);

                    this.alertConfig.set({
                        type: 'danger',
                        title: 'Error',
                        description: 'Ha ocurrido un error al intentar registrar el producto',
                    });
                },
            });
    }
}
