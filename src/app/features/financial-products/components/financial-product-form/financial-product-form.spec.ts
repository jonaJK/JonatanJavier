import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { FinancialProductForm } from './financial-product-form';
import { FinancialProductsService } from '@features/financial-products/services/financial-products';
import { Product } from '@features/financial-products/models/product.model';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('FinancialProductForm', () => {
    let component: FinancialProductForm;
    let fixture: ComponentFixture<FinancialProductForm>;
    let mockFinancialService: jest.Mocked<FinancialProductsService>;

    beforeEach(async () => {
        mockFinancialService = {
            verifyProduct: jest.fn(),
        } as any;

        await TestBed.configureTestingModule({
            imports: [FinancialProductForm, ReactiveFormsModule],
            providers: [
                DatePipe,
                { provide: FinancialProductsService, useValue: mockFinancialService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FinancialProductForm);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('isEditMode', false);
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should handle service error in async validator (catchError Line 140)', async () => {
        mockFinancialService.verifyProduct.mockReturnValue(
            throwError(() => new Error('API Error')),
        );

        const productIdControl = component.productForm.controls.productId;
        productIdControl.setValue('error-id');

        await wait(350);
        fixture.detectChanges();

        expect(productIdControl.hasError('productIdExists')).toBe(false);
    });

    it('should return null in async validator if control is disabled (Line 133)', async () => {
        const productIdControl = component.productForm.controls.productId;
        productIdControl.setValue('test-id');
        productIdControl.disable();

        await wait(350);
        fixture.detectChanges();

        expect(productIdControl.errors).toBeNull();
    });

    it('should return null in async validator if value is empty (Line 133)', async () => {
        const productIdControl = component.productForm.controls.productId;
        productIdControl.setValue('');

        await wait(350);
        fixture.detectChanges();

        expect(productIdControl.hasError('productIdExists')).toBe(false);
    });

    it('should validate release date (releaseDateValidator)', () => {
        const validator = component.minReleaseDateValidator();

        const pastDate = { value: '2020-01-01' } as any;
        expect(validator(pastDate)).toEqual({ invalidReleaseDate: true });

        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const futureStr = futureDate.toISOString().split('T')[0];
        expect(validator({ value: futureStr } as any)).toBeNull();
    });

    it('should automatically set review date to exactly one year after release date', () => {
        component.productForm.controls.releaseDate.setValue('2025-01-01');
        fixture.detectChanges();

        expect(component.productForm.controls.reviewDate.value).toBe('2026-01-01');
    });

    it('should populate form and disable ID when calling setDefaultFormData', () => {
        fixture.componentRef.setInput('isEditMode', true);
        const product: Product = {
            id: 'id-123',
            name: 'Name',
            description: 'Description long',
            logo: 'logo.png',
            date_release: new Date(),
            date_revision: new Date(),
        };

        component.setDefaultFormData(product);
        fixture.detectChanges();

        expect(component.productForm.getRawValue().productId).toBe('id-123');
        expect(component.productForm.controls.productId.disabled).toBe(true);
    });

    it('should reset the form but keep the ID if in edit mode', () => {
        fixture.componentRef.setInput('isEditMode', true);
        fixture.detectChanges();

        component.productForm.patchValue({ productId: 'TestId', name: 'To Delete' });
        component.resetForm();
        fixture.detectChanges();

        expect(component.productForm.controls.name.value).toBeNull();
        expect(component.productForm.controls.productId.value).toBe('TestId');
    });

    it('should emit data on valid submit', () => {
        const spy = jest.spyOn(component.formEmitter, 'emit');
        component.productForm.patchValue({
            productId: 'valid',
            name: 'Valid Name',
            description: 'Valid Description',
            logo: 'url',
            releaseDate: '2025-01-01',
            reviewDate: '2026-01-01',
        });

        component.productForm.controls.productId.setErrors(null);

        component.onSubmit();
        expect(spy).toHaveBeenCalled();
    });

    it('should access all getters', () => {
        const controls = [
            component.productId,
            component.name,
            component.description,
            component.logo,
            component.releaseDate,
            component.reviewDate,
        ];
        controls.forEach((c) => expect(c).toBeDefined());
    });
});
