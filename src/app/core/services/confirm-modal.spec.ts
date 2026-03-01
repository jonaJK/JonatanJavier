import { TestBed } from '@angular/core/testing';
import { ConfirmModalService } from './confirm-modal';

describe('ConfirmModalService', () => {
    let service: ConfirmModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ConfirmModalService],
        });
        service = TestBed.inject(ConfirmModalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(service.isOpen()).toBe(false);
        expect(service.productName()).toBe('');
    });

    it('should update signals and return a Subject when open() is called', () => {
        const productName = 'Test Product';
        const result$ = service.open(productName);

        expect(service.productName()).toBe(productName);
        expect(service.isOpen()).toBe(true);
        expect(result$).toBeDefined();
    });

    it('should emit true and close when confirm() is called', (done) => {
        const result$ = service.open('Product');

        result$.subscribe((value) => {
            expect(value).toBe(true);
            expect(service.isOpen()).toBe(false);
            done();
        });

        service.confirm();
    });

    it('should emit false and close when cancel() is called', (done) => {
        const result$ = service.open('Product');

        result$.subscribe((value) => {
            expect(value).toBe(false);
            expect(service.isOpen()).toBe(false);
            done();
        });

        service.cancel();
    });

    it('should complete the Subject after confirming or cancelling', (done) => {
        const result$ = service.open('Product');

        result$.subscribe({
            complete: () => {
                expect(true).toBe(true);
                done();
            },
        });

        service.confirm();
    });
});
