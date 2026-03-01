import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonBar } from './skeleton-bar';
import { By } from '@angular/platform-browser';

describe('SkeletonBar', () => {
    let component: SkeletonBar;
    let fixture: ComponentFixture<SkeletonBar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SkeletonBar],
        }).compileComponents();

        fixture = TestBed.createComponent(SkeletonBar);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should apply default width (100%) and height (20px) styles', () => {
        fixture.detectChanges();

        const skeletonElement = fixture.debugElement.query(By.css('.skeleton')).nativeElement;

        expect(skeletonElement.style.width).toBe('100%');
        expect(skeletonElement.style.height).toBe('20px');
    });

    it('should update styles when inputs are changed', () => {
		
        fixture.componentRef.setInput('width', '50%');
        fixture.componentRef.setInput('height', '50px');

        fixture.detectChanges();

        const skeletonElement = fixture.debugElement.query(By.css('.skeleton')).nativeElement;

        expect(skeletonElement.style.width).toBe('50%');
        expect(skeletonElement.style.height).toBe('50px');
    });
});
