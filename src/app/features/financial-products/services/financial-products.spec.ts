import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FinancialProductsService } from './financial-products';
import { Product } from '@features/financial-products/models/product.model';
import { ApiResponse } from '@core/models/api-response.model';

describe('FinancialProductsService', () => {
    let service: FinancialProductsService;
    let httpMock: HttpTestingController;

    const baseUrl = 'bp/products';

    const mockProduct: Product = {
        id: 'card123',
        name: 'Credit Card',
        description: 'Card with $5000 limit',
        logo: 'logo-url',
        date_release: new Date('2025-01-01'),
        date_revision: new Date('2026-01-01'),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FinancialProductsService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(FinancialProductsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch products using GET', () => {
        const mockResponse: ApiResponse<Product[]> = {
            data: [mockProduct],
            name: 'Success',
            message: 'Products retrieved',
        };

        service.getProducts().subscribe((res) => {
            expect(res.data).toEqual([mockProduct]);
        });

        const req = httpMock.expectOne(`${baseUrl}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should verify product existence', () => {
        service.verifyProduct('card123').subscribe((exists) => {
            expect(exists).toBe(true);
        });

        const req = httpMock.expectOne(`${baseUrl}/verification/card123`);
        expect(req.request.method).toBe('GET');
        req.flush(true);
    });

    it('should send a DELETE request for a product', () => {
        service.deleteProduct('card123').subscribe();

        const req = httpMock.expectOne(`${baseUrl}/card123`);
        expect(req.request.method).toBe('DELETE');
        req.flush({ message: 'Deleted' });
    });
});
