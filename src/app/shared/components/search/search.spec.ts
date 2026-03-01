import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Search } from './search';
import { By } from '@angular/platform-browser';

describe('Search', () => {
    let component: Search;
    let fixture: ComponentFixture<Search>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Search, FormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(Search);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with an empty string', () => {
        expect(component.searchText()).toBe('');
    });

    it('should update the model and sanitize input on change', () => {
        const inputElement = fixture.debugElement.query(By.css('.search-input')).nativeElement;

        inputElement.value = 'Angular        Test';
        inputElement.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(component.searchText()).toBe('Angular Test');
    });

    it('should clear the search text when clearSearch is called', () => {
        component.searchText.set('Find something');

        component.clearSearch();

        expect(component.searchText()).toBe('');
    });
});
