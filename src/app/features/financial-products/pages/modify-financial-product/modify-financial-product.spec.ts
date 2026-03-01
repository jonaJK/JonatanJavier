import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyFinancialProduct } from './modify-financial-product';
import { FinancialProductsService } from '@features/financial-products/services/financial-products';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '@features/financial-products/models/product.model';

import { ApiResponse } from '@core/models/api-response.model';

describe('ModifyFinancialProduct', () => {
    let component: ModifyFinancialProduct;
    let fixture: ComponentFixture<ModifyFinancialProduct>;
    let mockFinancialService: jest.Mocked<FinancialProductsService>;
    let mockRouter: jest.Mocked<Router>;

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
            getProducts: jest.fn(),
            updateProduct: jest.fn(),
        } as any;

        mockRouter = {
            navigate: jest.fn(),
        } as any;

        await TestBed.configureTestingModule({
            imports: [ModifyFinancialProduct],
            providers: [
                { provide: FinancialProductsService, useValue: mockFinancialService },
                { provide: Router, useValue: mockRouter },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => 'test-1' } },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ModifyFinancialProduct);
        component = fixture.componentInstance;
    });

    it('should create the component and load data on init', () => {
        mockFinancialService.getProducts.mockReturnValue(of({ data: [mockProduct.data] }));

        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(mockFinancialService.getProducts).toHaveBeenCalled();
    });

    describe('Data Loading (ngOnInit)', () => {
        it('should populate the form if the product exists', () => {
            mockFinancialService.getProducts.mockReturnValue(of({ data: [mockProduct.data] }));
            const formSpy = jest.spyOn(component.productFormComp(), 'setDefaultFormData');

            fixture.detectChanges();

            expect(formSpy).toHaveBeenCalledWith(mockProduct.data);
            expect(component.isLoading()).toBe(false);
        });

        it('should navigate back to home if product is not found', () => {
            mockFinancialService.getProducts.mockReturnValue(of({ data: [] }));

            fixture.detectChanges();

            expect(mockRouter.navigate).toHaveBeenCalledWith([''], { replaceUrl: true });
        });

        it('should show an error alert if the service fails', () => {
            mockFinancialService.getProducts.mockReturnValue(
                throwError(() => new Error('API Error')),
            );

            fixture.detectChanges();

            expect(component.alertConfig()).toEqual({
                type: 'danger',
                title: 'Error',
                description: 'Ha ocurrido un error al obtener la información del producto',
            });
        });
    });

    describe('modifyProduct method', () => {
        it('should show success alert when update is successful', () => {
            mockFinancialService.getProducts.mockReturnValue(of({ data: [mockProduct.data] }));

            mockFinancialService.updateProduct.mockReturnValue(of(mockProduct));

            component.modifyProduct(mockProduct.data);

            expect(component.isLoading()).toBe(false);
            expect(component.alertConfig()?.type).toBe('success');
        });

        it('should show danger alert when update fails', () => {
            mockFinancialService.getProducts.mockReturnValue(of({ data: [mockProduct.data] }));
            fixture.detectChanges();

            mockFinancialService.updateProduct.mockReturnValue(throwError(() => new Error('Fail')));

            component.modifyProduct(mockProduct.data);

            expect(component.alertConfig()?.type).toBe('danger');
        });
    });
});
