import { Component, inject, input, output, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
    FormGroup,
    FormControl,
    ReactiveFormsModule,
    Validators,
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
    AsyncValidatorFn,
} from '@angular/forms';
import { catchError, map, switchMap, timer, of, Observable, first } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FinancialProductsService } from '@features/financial-products/services/financial-products';

import { Product, ProductForm } from '@features/financial-products/models/product.model';

@Component({
    selector: 'app-financial-product-form',
    imports: [ReactiveFormsModule],
    providers: [DatePipe],
    templateUrl: './financial-product-form.html',
    styleUrl: './financial-product-form.css',
})
export class FinancialProductForm {
    private datePipe = inject(DatePipe);
    private financialProductsService = inject(FinancialProductsService);

    today = new Date();
    minDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');

    productForm = new FormGroup({
        productId: new FormControl('', {
            validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
            asyncValidators: [this.productIdExistsValidator()],
        }),
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
        ]),
        description: new FormControl('', [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(200),
        ]),
        logo: new FormControl('', [Validators.required]),
        releaseDate: new FormControl('', [Validators.required, this.minReleaseDateValidator()]),
        reviewDate: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });

    isEditMode = input.required<Boolean>();
    formEmitter = output<Product>();

    get productId() {
        return this.productForm.get('productId');
    }

    get name() {
        return this.productForm.get('name');
    }

    get description() {
        return this.productForm.get('description');
    }

    get logo() {
        return this.productForm.get('logo');
    }

    get releaseDate() {
        return this.productForm.get('releaseDate');
    }

    get reviewDate() {
        return this.productForm.get('reviewDate');
    }

    constructor() {
        this.productForm
            .get('releaseDate')
            ?.valueChanges.pipe(takeUntilDestroyed())
            .subscribe((value) => {
                if (value) {
                    const date = new Date(value + 'T00:00:00');
                    date.setFullYear(date.getFullYear() + 1);

                    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
                    this.productForm.get('reviewDate')?.setValue(formattedDate);
                } else {
                    this.productForm.get('reviewDate')?.setValue('');
                }
            });

        effect(() => {
            const productIdControl = this.productForm.get('productId');
            this.isEditMode() ? productIdControl?.disable() : productIdControl?.enable();
        });
    }

    setDefaultFormData(product: Product): void {
        this.productForm.patchValue({
            productId: product.id,
            name: product.name,
            description: product.description,
            logo: product.logo,
            releaseDate: this.datePipe.transform(product.date_release, 'yyyy-MM-dd'),
            reviewDate: this.datePipe.transform(product.date_revision, 'yyyy-MM-dd'),
        });

        this.productForm.get('productId')?.updateValueAndValidity();
    }

    minReleaseDateValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;

            const [year, month, day] = control.value.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return selectedDate >= today ? null : { invalidReleaseDate: true };
        };
    }

    productIdExistsValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (control.disabled || !control.value) {
                return of(null);
            }

            return timer(300).pipe(
                switchMap(() => this.financialProductsService.verifyProduct(control.value)),
                map((exists) => (exists ? { productIdExists: true } : null)),
                first(),
                catchError(() => of(null)),
            );
        };
    }

    onSubmit(): void {
        const formData: ProductForm = this.productForm.getRawValue() as ProductForm;

        this.formEmitter.emit({
            id: formData.productId,
            name: formData.name,
            description: formData.description,
            logo: formData.logo,
            date_release: formData.releaseDate!,
            date_revision: formData.reviewDate!,
        });
    }

    resetForm(): void {
        const currentId = this.productForm.get('productId')?.value;

        this.productForm.reset();

        if (currentId && this.isEditMode()) {
            this.productForm.get('productId')?.setValue(currentId);
        }
    }
}
