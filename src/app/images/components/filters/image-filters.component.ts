import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export interface FilterState {
  searchTerm: string;
  sortBy: string;
  sortOrder: string;
}

@Component({
  selector: 'ib-image-filters',
  templateUrl: './image-filters.component.html',
  styleUrl: './image-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageFiltersComponent {
  readonly searchTerm = input('');
  readonly sortBy = input('name');
  readonly sortOrder = input('desc');
  
  readonly searchChange = output<string>();
  readonly sortByChange = output<string>();
  readonly sortOrderChange = output<string>();

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onSortByChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortByChange.emit(target.value);
  }

  onSortOrderChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortOrderChange.emit(target.value);
  }
} 