import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/financial-products/pages/financial-products/financial-products').then(
                (m) => m.FinancialProducts,
            ),
    },
    {
        path: 'product/new',
        loadComponent: () =>
            import('./features/financial-products/pages/register-financial-product/register-financial-product').then(
                (m) => m.RegisterFinancialProduct,
            ),
    },
    {
        path: 'product/edit/:id',
        loadComponent: () =>
            import('./features/financial-products/pages/modify-financial-product/modify-financial-product').then(
                (m) => m.ModifyFinancialProduct,
            ),
    },
];
