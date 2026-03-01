import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    DestroyRef,
    inject,
    viewChild,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { FinancialProductForm } from '@features/financial-products/components/financial-product-form/financial-product-form';
import { Alert } from '@shared/components/alert/alert';

import { FinancialProductsService } from '@features/financial-products/services/financial-products';

import { Product } from '@features/financial-products/models/product.model';
import { AlertConfig } from '@shared/models/alert-config.model';

@Component({
    selector: 'app-modify-financial-product',
    imports: [FinancialProductForm, Alert],
    templateUrl: './modify-financial-product.html',
    styleUrl: './modify-financial-product.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifyFinancialProduct implements OnInit {
    private destroyRef = inject(DestroyRef);
    private financialProductsService = inject(FinancialProductsService);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    productFormComp = viewChild.required(FinancialProductForm);

    alertConfig = signal<AlertConfig | null>(null);
    isLoading = signal(false);

    ngOnInit(): void {
        const productId = this.activatedRoute.snapshot.paramMap.get('id');

        if (productId) {
            this.getFinancialProducts(productId);
        }
    }

    getFinancialProducts(productId: string): void {
        this.isLoading.set(true);
        this.financialProductsService
            .getProducts()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.isLoading.set(false);

                    const selectedProduct = response.data.find(
                        (product) => product.id === productId,
                    );

                    if (selectedProduct) {
                        this.productFormComp().setDefaultFormData(selectedProduct);
                    } else {
                        this.router.navigate([''], { replaceUrl: true });
                    }
                },
                error: () => {
                    this.isLoading.set(false);

                    this.alertConfig.set({
                        type: 'danger',
                        title: 'Error',
                        description: 'Ha ocurrido un error al obtener la información del producto',
                    });
                },
            });
    }

    modifyProduct(data: Product): void {
        this.isLoading.set(true);
        this.financialProductsService
            .updateProduct(data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this.alertConfig.set({
                        type: 'success',
                        title: 'Éxito',
                        description: 'Se ha modificado el producto satisfactoriamente',
                    });
                },
                error: () => {
                    this.isLoading.set(false);
                    this.alertConfig.set({
                        type: 'danger',
                        title: 'Error',
                        description: 'Ha ocurrido un error al intentar modificar el producto',
                    });
                },
            });
    }
}
