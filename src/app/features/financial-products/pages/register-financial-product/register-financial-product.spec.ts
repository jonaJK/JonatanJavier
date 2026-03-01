import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterFinancialProduct } from './register-financial-product';
import { FinancialProductsService } from '@features/financial-products/services/financial-products';
import { of, throwError } from 'rxjs';
import { Product } from '@features/financial-products/models/product.model';
import { ApiResponse } from '@core/models/api-response.model';

describe('RegisterFinancialProduct', () => {
    let component: RegisterFinancialProduct;
    let fixture: ComponentFixture<RegisterFinancialProduct>;
    let mockFinancialService: jest.Mocked<FinancialProductsService>;

    const mockProduct: ApiResponse<Product> = {
        data: {
            id: 'test-1',
            name: 'test product',
            description: 'test description',
            logo: 'logo.png',
            date_release: new Date(),
            date_revision: new Date(),
        },
    };

    beforeEach(async () => {
        mockFinancialService = {
            registerProduct: jest.fn(),
        } as any;

        await TestBed.configureTestingModule({
            imports: [RegisterFinancialProduct],
            providers: [{ provide: FinancialProductsService, useValue: mockFinancialService }],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterFinancialProduct);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create the registration page', () => {
        expect(component).toBeTruthy();
    });

    it('should call registerProduct and show success alert on success', () => {
        mockFinancialService.registerProduct.mockReturnValue(of(mockProduct));

        const resetSpy = jest.spyOn(component.productFormComp(), 'resetForm');

        component.registerProduct(mockProduct.data);

        expect(component.isLoading()).toBe(false);
        expect(resetSpy).toHaveBeenCalled();
        expect(component.alertConfig()).toEqual({
            type: 'success',
            title: 'Éxito',
            description: 'Se ha registrado el producto satisfactoriamente',
        });
    });

    it('should show danger alert when registration fails', () => {
        mockFinancialService.registerProduct.mockReturnValue(
            throwError(() => new Error('API Error')),
        );

        component.registerProduct(mockProduct.data);

        expect(component.isLoading()).toBe(false);
        expect(component.alertConfig()).toEqual({
            type: 'danger',
            title: 'Error',
            description: 'Ha ocurrido un error al intentar registrar el producto',
        });
    });

    it('should set isLoading to true while calling the service', () => {
        mockFinancialService.registerProduct.mockReturnValue(of());

        component.registerProduct(mockProduct.data);

        expect(mockFinancialService.registerProduct).toHaveBeenCalledWith(mockProduct.data);
    });

    it('should render the alert component only when alertConfig is set', () => {
        let alertElement = fixture.nativeElement.querySelector('app-alert');
        expect(alertElement).toBeNull();

        component.alertConfig.set({ type: 'success', title: 'Test', description: 'Test' });
        fixture.detectChanges();

        alertElement = fixture.nativeElement.querySelector('app-alert');
        expect(alertElement).not.toBeNull();
    });
});
