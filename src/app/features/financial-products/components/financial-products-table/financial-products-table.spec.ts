import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialProductsTable } from './financial-products-table';
import { Product } from '@features/financial-products/models/product.model';
import { By } from '@angular/platform-browser';

describe('FinancialProductsTable', () => {
    let component: FinancialProductsTable;
    let fixture: ComponentFixture<FinancialProductsTable>;

    const mockProducts: Product[] = [
        {
            id: 'tar-1',
            name: 'Tarjeta Visa',
            description: 'Tarjeta de crédito internacional',
            logo: 'visa.png',
            date_release: new Date('2025-01-01'),
            date_revision: new Date('2026-01-01'),
        },
        {
            id: 'tar-2',
            name: 'Tarjeta Master',
            description: 'Tarjeta de débito preferencial',
            logo: 'master.png',
            date_release: new Date('2025-02-01'),
            date_revision: new Date('2026-02-01'),
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FinancialProductsTable],
        }).compileComponents();

        fixture = TestBed.createComponent(FinancialProductsTable);
        component = fixture.componentInstance;
    });

    it('should create the table component', () => {
        fixture.componentRef.setInput('products', []);
        fixture.componentRef.setInput('isLoading', false);
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should show skeletons when isLoading is true', () => {
        fixture.componentRef.setInput('products', []);
        fixture.componentRef.setInput('isLoading', true);
        fixture.detectChanges();

        const skeletons = fixture.debugElement.queryAll(By.css('app-skeleton-bar'));
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render the list of products when not loading', () => {
        fixture.componentRef.setInput('products', mockProducts);
        fixture.componentRef.setInput('isLoading', false);
        fixture.detectChanges();

        const rows = fixture.debugElement.queryAll(By.css('tbody tr'));

        expect(rows.length).toBe(2);

        const firstProductName = rows[0].query(By.css('td')).nativeElement.textContent;
        expect(firstProductName).toContain(mockProducts[0].name);
    });

    it('should show empty message when no products are provided', () => {
        fixture.componentRef.setInput('products', []);
        fixture.componentRef.setInput('isLoading', false);
        fixture.detectChanges();

        const emptyMessage = fixture.debugElement.query(By.css('.empty-container'));
        expect(emptyMessage.nativeElement.textContent).toContain('No se han encontrados datos');
    });

    it('should emit edit event when onEdit is called', () => {
        const editSpy = jest.spyOn(component.editEmitter, 'emit');
        const productId = 'tar-1';

        component.onEdit(productId);

        expect(editSpy).toHaveBeenCalledWith(productId);
    });

    it('should emit delete event when onDelete is called', () => {
        const deleteSpy = jest.spyOn(component.deleteEmitter, 'emit');
        const productToDelete = mockProducts[0];

        component.onDelete(productToDelete);

        expect(deleteSpy).toHaveBeenCalledWith(productToDelete);
    });
});
