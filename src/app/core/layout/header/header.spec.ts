import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { By } from '@angular/platform-browser';

describe('Header', () => {
    let component: Header;
    let fixture: ComponentFixture<Header>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Header],
        }).compileComponents();

        fixture = TestBed.createComponent(Header);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the title "Banco" in uppercase style', () => {
        const titleElement = fixture.debugElement.query(By.css('.header-title')).nativeElement;

        expect(titleElement.textContent).toContain('Banco');
    });
});
