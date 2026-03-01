import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialProducts } from './financial-products';
import { FinancialProductsService } from '@features/financial-products/services/financial-products';
import { ConfirmModalService } from '@core/services/confirm-modal';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '@features/financial-products/models/product.model';

describe('FinancialProducts', () => {
    let component: FinancialProducts;
    let fixture: ComponentFixture<FinancialProducts>;
    let mockFinancialService: jest.Mocked<FinancialProductsService>;
    let mockConfirmModalService: jest.Mocked<ConfirmModalService>;
    let mockRouter: jest.Mocked<Router>;

    const mockProducts: Product[] = [
        {
            id: '1',
            name: 'Visa Card',
            description: 'Credit card',
            logo: '',
            date_release: new Date(),
            date_revision: new Date(),
        },
        {
            id: '2',
            name: 'Mastercard',
            description: 'Debit card',
            logo: '',
            date_release: new Date(),
            date_revision: new Date(),
        },
    ];

    beforeEach(async () => {
        mockFinancialService = {
            getProducts: jest.fn().mockReturnValue(of({ data: mockProducts })),
            deleteProduct: jest.fn(),
        } as any;

        mockConfirmModalService = {
            open: jest.fn(),
        } as any;

        mockRouter = {
            navigate: jest.fn(),
            navigateByUrl: jest.fn(),
        } as any;

        await TestBed.configureTestingModule({
            imports: [FinancialProducts],
            providers: [
                { provide: FinancialProductsService, useValue: mockFinancialService },
                { provide: ConfirmModalService, useValue: mockConfirmModalService },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FinancialProducts);
        component = fixture.componentInstance;

        jest.clearAllMocks();
        fixture.detectChanges();
    });

    it('should create and load products on init', () => {
        expect(component).toBeTruthy();
        expect(mockFinancialService.getProducts).toHaveBeenCalled();
        expect(component.products().length).toBe(2);
    });

    describe('Filtering and Pagination', () => {
        it('should filter products when searchText changes', () => {
            component.searchText.set('Visa');
            fixture.detectChanges();

            expect(component.filteredProducts().length).toBe(1);
            expect(component.filteredProducts()[0].name).toBe('Visa Card');
        });

        it('should reset to first page when search text is updated', () => {
            component.currentPagination.set({ page: 2, size: 5 });
            component.onSearchTextChange('New search');

            expect(component.searchText()).toBe('New search');
            expect(component.currentPagination().page).toBe(1);
        });

        it('should update pagination state via onPageChange', () => {
            const newState = { page: 3, size: 10 };
            component.onPageChange(newState);
            expect(component.currentPagination()).toEqual(newState);
        });
    });

    describe('Navigation', () => {
        it('should navigate to register page', () => {
            component.navigateToRegister();
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('product/new');
        });

        it('should navigate to edit page with ID', () => {
            component.handleEdit('test-id');
            expect(mockRouter.navigate).toHaveBeenCalledWith(['product/edit', 'test-id']);
        });
    });

    describe('Delete Logic (handleDelete)', () => {
        it('should NOT call deleteProduct when user cancels the modal (confirmed is false)', () => {
            (mockConfirmModalService.open as jest.Mock).mockReturnValue(of(false));

            component.handleDelete(mockProducts[0]);

            expect(mockConfirmModalService.open).toHaveBeenCalledWith(mockProducts[0].name);
            expect(mockFinancialService.deleteProduct).not.toHaveBeenCalled();
        });

        it('should call deleteProduct and reload list when user confirms', () => {
            (mockConfirmModalService.open as jest.Mock).mockReturnValue(of(true));
            mockFinancialService.deleteProduct.mockReturnValue(of({} as any));

            const refreshSpy = jest.spyOn(component, 'getFinancialProducts');

            component.handleDelete(mockProducts[0]);

            expect(mockFinancialService.deleteProduct).toHaveBeenCalledWith(mockProducts[0].id);
            expect(refreshSpy).toHaveBeenCalled();
        });

        it('should handle service error during deletion', () => {
            (mockConfirmModalService.open as jest.Mock).mockReturnValue(of(true));
            mockFinancialService.deleteProduct.mockReturnValue(
                throwError(() => new Error('API Error')),
            );

            component.handleDelete(mockProducts[0]);

            expect(component.isLoading()).toBe(false);
        });
    });

    describe('Loading State', () => {
        it('should handle error when loading products fails on init', () => {
            mockFinancialService.getProducts.mockReturnValue(throwError(() => new Error('Fail')));

            component.getFinancialProducts();

            expect(component.isLoading()).toBe(false);
        });
    });
});
