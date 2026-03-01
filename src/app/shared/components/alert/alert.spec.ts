import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alert } from './alert';
import { AlertConfig } from '@shared/models/alert-config.model';
import { By } from '@angular/platform-browser';

describe('Alert', () => {
    let component: Alert;
    let fixture: ComponentFixture<Alert>;

    const mockConfig: AlertConfig = {
        type: 'success',
        title: 'Success!',
        description: 'Operation completed successfully.',
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Alert],
        }).compileComponents();

        fixture = TestBed.createComponent(Alert);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('alertConfig', mockConfig);
        fixture.detectChanges();
    });

    it('should create the alert component', () => {
        expect(component).toBeTruthy();
    });

    it('should render the correct title and description', () => {
        const titleElement = fixture.debugElement.query(By.css('.alert-title')).nativeElement;
        const descElement = fixture.debugElement.query(By.css('.alert-description')).nativeElement;

        expect(titleElement.textContent).toContain(mockConfig.title);
        expect(descElement.textContent).toContain(mockConfig.description);
    });

    it('should apply the correct CSS class based on alert type', () => {
        const container = fixture.debugElement.query(By.css('.alert-container')).nativeElement;

        expect(container.classList).toContain('success');

        fixture.componentRef.setInput('alertConfig', {
            ...mockConfig,
            type: 'danger',
        });
        fixture.detectChanges();

        expect(container.classList).toContain('danger');
        expect(container.classList).not.toContain('success');
    });

    it('should update the view when the alertConfig signal changes', () => {
        const newTitle = 'New Warning';
		
        fixture.componentRef.setInput('alertConfig', {
            type: 'warning',
            title: newTitle,
            description: 'Be careful!',
        });
        fixture.detectChanges();

        const titleElement = fixture.debugElement.query(By.css('.alert-title')).nativeElement;
        expect(titleElement.textContent).toContain(newTitle);
    });
});
