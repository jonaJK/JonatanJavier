import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Popupmenu } from './popupmenu';
import { By } from '@angular/platform-browser';

describe('Popupmenu', () => {
    let component: Popupmenu;
    let fixture: ComponentFixture<Popupmenu>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Popupmenu],
        }).compileComponents();

        fixture = TestBed.createComponent(Popupmenu);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the popup menu', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle the menu when the dots button is clicked', () => {
        const button = fixture.debugElement.query(By.css('.dots-btn'));

        button.triggerEventHandler('click', { stopPropagation: () => {} });
        fixture.detectChanges();
        expect(component.isOpen()).toBe(true);

        button.triggerEventHandler('click', { stopPropagation: () => {} });
        fixture.detectChanges();
        expect(component.isOpen()).toBe(false);
    });

    it('should emit "edit" and close menu when edit option is clicked', () => {
        const editSpy = jest.spyOn(component.edit, 'emit');
        component.isOpen.set(true);
        fixture.detectChanges();

        const editItem = fixture.debugElement.queryAll(By.css('li'))[0];
        editItem.nativeElement.click();

        expect(editSpy).toHaveBeenCalled();
        expect(component.isOpen()).toBe(false);
    });

    it('should emit "delete" and close menu when delete option is clicked', () => {
        const deleteSpy = jest.spyOn(component.delete, 'emit');
        component.isOpen.set(true);
        fixture.detectChanges();

        const deleteItem = fixture.debugElement.queryAll(By.css('li'))[1];
        deleteItem.nativeElement.click();

        expect(deleteSpy).toHaveBeenCalled();
        expect(component.isOpen()).toBe(false);
    });

    it('should close the menu when clicking anywhere else in the document', () => {
        component.isOpen.set(true);
        fixture.detectChanges();

        document.dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();

        expect(component.isOpen()).toBe(false);
    });
});
