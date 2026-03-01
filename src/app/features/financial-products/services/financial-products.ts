import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@features/financial-products/models/product.model';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
    providedIn: 'root',
})
export class FinancialProductsService {
    private baseUrl = 'bp';
    private http = inject(HttpClient);

    getProducts(): Observable<ApiResponse<Product[]>> {
        return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/products`);
    }

    registerProduct(product: Product): Observable<ApiResponse<Product>> {
        return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/products`, product);
    }

    updateProduct(product: Product): Observable<ApiResponse<Product>> {
        return this.http.put<ApiResponse<Product>>(
            `${this.baseUrl}/products/${product.id}`,
            product,
        );
    }

    verifyProduct(productId: string): Observable<Boolean> {
        return this.http.get<Boolean>(`${this.baseUrl}/products/verification/${productId}`);
    }

    deleteProduct(productId: string): Observable<ApiResponse<Product>> {
        return this.http.delete<ApiResponse<Product>>(`${this.baseUrl}/products/${productId}`);
    }
}
