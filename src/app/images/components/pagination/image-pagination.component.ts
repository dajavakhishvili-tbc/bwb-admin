import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'ib-image-pagination',
  templateUrl: './image-pagination.component.html',
  styleUrl: './image-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePaginationComponent {
  readonly currentPage = input(1);
  readonly totalPages = input(1);
  
  readonly previousPage = output<void>();
  readonly nextPage = output<void>();

  onPreviousPage() {
    // TODO: The 'emit' function requires a mandatory void argument
    this.previousPage.emit();
  }

  onNextPage() {
    // TODO: The 'emit' function requires a mandatory void argument
    this.nextPage.emit();
  }
} 