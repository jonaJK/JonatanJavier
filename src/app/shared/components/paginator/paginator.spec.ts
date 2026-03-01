import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Paginator } from './paginator';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('Paginator', () => {
    let component: Paginator;
    let fixture: ComponentFixture<Paginator>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Paginator, FormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(Paginator);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('totalItems', 25);
        fixture.detectChanges();
    });

    it('should create the paginator component', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate totalPages correctly based on totalItems and pageSize', () => {
        expect(component.totalPages()).toBe(5);

        fixture.componentRef.setInput('totalItems', 21);
        expect(component.totalPages()).toBe(5);

        fixture.componentRef.setInput('totalItems', 10);
        expect(component.totalPages()).toBe(2);
    });

    it('should render the correct number of page buttons', () => {
        const buttons = fixture.debugElement.queryAll(By.css('.num-btn'));

        expect(buttons.length).toBe(5);
        expect(buttons[0].nativeElement.textContent.trim()).toBe('1');
    });

    it('should change page and emit event when a page button is clicked', () => {
        const pageSpy = jest.spyOn(component.pageChange, 'emit');
        const secondPageButton = fixture.debugElement.queryAll(By.css('.num-btn'))[1];

        secondPageButton.nativeElement.click();
        fixture.detectChanges();

        expect(component.currentPage()).toBe(2);
        expect(pageSpy).toHaveBeenCalledWith({ page: 2, size: 5 });
    });

    it('should reset to page 1 and emit change when page size is updated', () => {
        const pageSpy = jest.spyOn(component.pageChange, 'emit');

        component.currentPageSize.set(10);
        component.onPageSizeChange();
        fixture.detectChanges();

        expect(component.currentPage()).toBe(1);
        expect(pageSpy).toHaveBeenCalledWith({ page: 1, size: 10 });
    });

    it('should not go to an invalid page', () => {
        const pageSpy = jest.spyOn(component.pageChange, 'emit');

        component.goToPage(0);
        expect(component.currentPage()).toBe(1);

        component.goToPage(100);
        expect(component.currentPage()).toBe(1);

        expect(pageSpy).not.toHaveBeenCalled();
    });
});
