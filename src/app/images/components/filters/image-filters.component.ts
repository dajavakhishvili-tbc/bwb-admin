import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

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
  @Input() searchTerm = '';
  @Input() sortBy = 'name';
  @Input() sortOrder = 'desc';
  
  @Output() searchChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();
  @Output() sortOrderChange = new EventEmitter<string>();

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