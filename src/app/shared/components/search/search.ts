import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-search',
    imports: [FormsModule],
    templateUrl: './search.html',
    styleUrl: './search.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
    searchText = model<string>('');

    onSearchChange(value: string): void {
        const cleanedText = value.replace(/\s+/g, ' ');
        this.searchText.set(cleanedText);
    }

    clearSearch(): void {
        this.searchText.set('');
    }
}
