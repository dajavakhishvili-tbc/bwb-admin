import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ImageCardComponent, type ImageItem } from './components/card';
import { ImageFiltersComponent } from './components/filters';
import { ImagePaginationComponent } from './components/pagination';
import { ImageUploadComponent, type UploadedImage } from './components/upload';

@Component({
  selector: 'ib-images',
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, ImageCardComponent, ImageFiltersComponent, ImagePaginationComponent, ImageUploadComponent]
})
export class ImagesComponent {
  readonly images = signal<ImageItem[]>([
    { id: 1, name: 'product-1.jpg', url: 'https://picsum.photos/300/200?random=1', size: '2.3 MB', uploadedAt: '2024-01-15', loaded: false, error: false },
    { id: 2, name: 'banner-2.png', url: 'https://picsum.photos/300/200?random=2', size: '1.8 MB', uploadedAt: '2024-01-14', loaded: false, error: false },
    { id: 3, name: 'logo.svg', url: 'https://picsum.photos/300/200?random=3', size: '45 KB', uploadedAt: '2024-01-13', loaded: false, error: false },
    { id: 4, name: 'hero-image.jpg', url: 'https://picsum.photos/300/200?random=4', size: '3.1 MB', uploadedAt: '2024-01-12', loaded: false, error: false },
    { id: 5, name: 'icon-set.png', url: 'https://picsum.photos/300/200?random=5', size: '890 KB', uploadedAt: '2024-01-11', loaded: false, error: false },
    { id: 6, name: 'background.jpg', url: 'https://picsum.photos/300/200?random=6', size: '2.7 MB', uploadedAt: '2024-01-10', loaded: false, error: false },
    { id: 7, name: 'product-1.jpg', url: 'https://picsum.photos/300/200?random=7', size: '2.3 MB', uploadedAt: '2024-01-15', loaded: false, error: false },
    { id: 8, name: 'banner-2.png', url: 'https://picsum.photos/300/200?random=8', size: '1.8 MB', uploadedAt: '2024-01-14', loaded: false, error: false },
    { id: 9, name: 'logo.svg', url: 'https://picsum.photos/300/200?random=9', size: '45 KB', uploadedAt: '2024-01-13', loaded: false, error: false },
    { id: 10, name: 'hero-image.jpg', url: 'https://picsum.photos/300/200?random=10', size: '3.1 MB', uploadedAt: '2024-01-12', loaded: false, error: false },
    { id: 11, name: 'icon-set.png', url: 'https://picsum.photos/300/200?random=11', size: '890 KB', uploadedAt: '2024-01-11', loaded: false, error: false },
    { id: 12, name: 'background.jpg', url: 'https://picsum.photos/300/200?random=12', size: '2.7 MB', uploadedAt: '2024-01-10', loaded: false, error: false }
  ]);
  
  readonly searchTerm = signal('');
  readonly sortBy = signal('name');
  readonly sortOrder = signal('desc'); // 'asc' or 'desc'
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(6);
  
  readonly filteredImages = signal<ImageItem[]>([]);
  readonly totalPages = signal(1);
  
  constructor() {
    this.updateFilteredImages();
  }
  
  updateSearch(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.currentPage.set(1);
    this.updateFilteredImages();
  }
  
  updateSort(sortBy: string) {
    this.sortBy.set(sortBy);
    this.updateFilteredImages();
  }
  
  updateSortOrder(sortOrder: string) {
    this.sortOrder.set(sortOrder);
    this.updateFilteredImages();
  }
  
  updateFilteredImages() {
    let filtered = this.images().filter(img => 
      img.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
    
    // Sort ALL filtered images first
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy()) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        case 'size':
          comparison = this.parseSize(a.size) - this.parseSize(b.size);
          break;
        default:
          comparison = 0;
      }
      
      // Apply sort order
      return this.sortOrder() === 'desc' ? -comparison : comparison;
    });
    
    // Update the filtered images signal with ALL sorted images
    this.filteredImages.set([...filtered]);
    this.totalPages.set(Math.ceil(filtered.length / this.itemsPerPage()));
    
    // Reset to first page when sorting changes
    this.currentPage.set(1);
  }
  
  paginatedImages() {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    // Apply pagination to the already sorted filtered images
    return this.filteredImages().slice(startIndex, endIndex);
  }
  
  onImageLoad(image: ImageItem) {
    // Image load is now handled by the ImageCardComponent
  }
  
  onImageError(image: ImageItem) {
    // Image error is now handled by the ImageCardComponent
  }
  
  parseSize(size: string): number {
    const num = parseFloat(size.replace(/[^\d.]/g, ''));
    if (size.includes('MB')) return num * 1024 * 1024; // Convert MB to bytes
    if (size.includes('KB')) return num * 1024; // Convert KB to bytes
    return num; // Already in bytes
  }
  
  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }
  
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  onFileSelected(uploadedImage: UploadedImage) {
    const newImage: ImageItem = {
      id: this.generateNextId(),
      name: uploadedImage.name,
      url: uploadedImage.url,
      size: uploadedImage.size,
      uploadedAt: uploadedImage.uploadedAt,
      loaded: uploadedImage.loaded,
      error: uploadedImage.error
    };
    this.images.set([newImage, ...this.images()]);
    this.updateFilteredImages();
  }

  private generateNextId(): number {
    const current = this.images();
    return current.length > 0 ? Math.max(...current.map(img => img.id)) + 1 : 1;
  }
  
  selectImage(image: ImageItem) {
    // Implementation for image selection
  }
} 