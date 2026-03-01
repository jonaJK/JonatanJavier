import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModal } from './confirm-modal';
import { ConfirmModalService } from '@core/services/confirm-modal';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

describe('ConfirmModal', () => {
    let component: ConfirmModal;
    let fixture: ComponentFixture<ConfirmModal>;
    let mockService: Partial<ConfirmModalService>;

    beforeEach(async () => {
        mockService = {
            isOpen: signal(false),
            productName: signal(''),
            confirm: jest.fn(),
            cancel: jest.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [ConfirmModal],
            providers: [{ provide: ConfirmModalService, useValue: mockService }],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmModal);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

	it('should create the confirm modal component', () => {
        expect(component).toBeTruthy();
    });

    it('should not display the modal when isOpen is false', () => {
        const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
        expect(overlay).toBeNull();
    });

    it('should display the modal and product name when isOpen is true', () => {
        (mockService.isOpen as any).set(true);
        (mockService.productName as any).set('Test Product');

        fixture.detectChanges();

        const body = fixture.debugElement.query(By.css('.modal-body')).nativeElement;
        expect(body.textContent).toContain('Test Product');
        expect(fixture.debugElement.query(By.css('.modal-overlay'))).not.toBeNull();
    });

    it('should call service.confirm() when the confirm button is clicked', () => {
        (mockService.isOpen as any).set(true);
        fixture.detectChanges();

        const confirmBtn = fixture.debugElement.query(By.css('.btn-confirm'));
        confirmBtn.nativeElement.click();

        expect(mockService.confirm).toHaveBeenCalled();
    });

    it('should call service.cancel() when the cancel button is clicked', () => {
        (mockService.isOpen as any).set(true);
        fixture.detectChanges();

        const cancelBtn = fixture.debugElement.query(By.css('.btn-cancel'));
        cancelBtn.nativeElement.click();

        expect(mockService.cancel).toHaveBeenCalled();
    });
});
