import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ImageCardComponent, type ImageItem } from './components/card';
import { ImageFiltersComponent } from './components/filters/image-filters.component';
import { ImagePaginationComponent } from './components/pagination/image-pagination.component';
import { ImageUploadComponent } from './components/upload/image-upload.component';

@Component({
  selector: 'ib-images',
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImageCardComponent, ImageFiltersComponent, ImagePaginationComponent, ImageUploadComponent]
})
export class ImagesComponent {
  readonly images = signal<ImageItem[]>([
    { id: 1, name: 'product-1.jpg', url: 'https://picsum.photos/300/200?random=1', size: '2.3 MB', resolution: '1920 × 1080', uploadedAt: '2024-01-15T14:30', device: ['web'], author: 'admin', loaded: false, error: false },
    { id: 2, name: 'banner-2.png', url: 'https://picsum.photos/300/200?random=2', size: '1.8 MB', resolution: '1200 × 630', uploadedAt: '2024-01-14T09:15', device: ['mobile'], author: 'admin', loaded: false, error: false },
    { id: 3, name: 'logo.svg', url: 'https://picsum.photos/300/200?random=3', size: '45 KB', resolution: '512 × 512', uploadedAt: '2024-01-13T16:45', device: ['web'], author: 'editor', loaded: false, error: false },
    { id: 4, name: 'hero-image.jpg', url: 'https://picsum.photos/300/200?random=4', size: '3.1 MB', resolution: '2560 × 1440', uploadedAt: '2024-01-12T11:20', device: ['web'], author: 'admin', loaded: false, error: false },
    { id: 5, name: 'icon-set.png', url: 'https://picsum.photos/300/200?random=5', size: '890 KB', resolution: '1024 × 1024', uploadedAt: '2024-01-11T13:55', device: ['mobile'], author: 'editor', loaded: false, error: false },
    { id: 6, name: 'background.jpg', url: 'https://picsum.photos/300/200?random=6', size: '2.7 MB', resolution: '1920 × 1080', uploadedAt: '2024-01-10T08:40', device: ['web'], author: 'admin', loaded: false, error: false },
    { id: 7, name: 'product-2.jpg', url: 'https://picsum.photos/300/200?random=7', size: '2.3 MB', resolution: '1600 × 900', uploadedAt: '2024-01-15T17:25', device: ['web'], author: 'admin', loaded: false, error: false },
    { id: 8, name: 'banner-3.png', url: 'https://picsum.photos/300/200?random=8', size: '1.8 MB', resolution: '1080 × 1920', uploadedAt: '2024-01-14T10:50', device: ['mobile'], author: 'admin', loaded: false, error: false },
    { id: 9, name: 'logo-2.svg', url: 'https://picsum.photos/300/200?random=9', size: '45 KB', resolution: '256 × 256', uploadedAt: '2024-01-13T15:10', device: ['mobile'], author: 'editor', loaded: false, error: false },
    { id: 10, name: 'hero-image-2.jpg', url: 'https://picsum.photos/300/200?random=10', size: '3.1 MB', resolution: '2048 × 1152', uploadedAt: '2024-01-12T12:35', device: ['web'], author: 'admin', loaded: false, error: false },
    { id: 11, name: 'icon-set-2.png', url: 'https://picsum.photos/300/200?random=11', size: '890 KB', resolution: '512 × 512', uploadedAt: '2024-01-11T14:20', device: ['mobile'], author: 'editor', loaded: false, error: false },
    { id: 12, name: 'background-2.jpg', url: 'https://picsum.photos/300/200?random=12', size: '2.7 MB', resolution: '1920 × 1080', uploadedAt: '2024-01-10T07:15', device: ['web'], author: 'admin', loaded: false, error: false }
  ]);
  
  readonly searchTerm = signal('');
  readonly sortBy = signal('name');
  readonly sortOrder = signal('desc'); 
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(6);
  readonly selectedDeviceFilter = signal<string>('');
  
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
    let filtered = this.images().filter(img => {
      const search = this.searchTerm().toLowerCase();
      const deviceFilter = this.selectedDeviceFilter();
      
      const matchesSearch = !search || 
        img.name.toLowerCase().includes(search) ||
        img.author.toLowerCase().includes(search);
      
      const matchesDevice = !deviceFilter || img.device.includes(deviceFilter);
      
      return matchesSearch && matchesDevice;
    });
    
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy()) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.uploadedAt + ':00').getTime() - new Date(b.uploadedAt + ':00').getTime();
          break;
        case 'size':
          comparison = this.parseSize(a.size) - this.parseSize(b.size);
          break;
        default:
          comparison = 0;
      }
      
      return this.sortOrder() === 'desc' ? -comparison : comparison;
    });
    
    this.filteredImages.set([...filtered]);
    this.totalPages.set(Math.ceil(filtered.length / this.itemsPerPage()));
    
    this.currentPage.set(1);
  }
  
  paginatedImages() {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return this.filteredImages().slice(startIndex, endIndex);
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

  onFileSelected(uploadedImage: ImageItem) {
    this.images.set([uploadedImage, ...this.images()]);
    this.updateFilteredImages();
  }

  selectDeviceFilter(device: string) {
    if (this.selectedDeviceFilter() === device) {
      this.selectedDeviceFilter.set('');
    } else {
      this.selectedDeviceFilter.set(device);
    }
    
    this.currentPage.set(1);
    this.updateFilteredImages();
  }

  isDeviceFilterSelected(device: string): boolean {
    return this.selectedDeviceFilter() === device;
  }

  onImageDelete(imageId: number) {
    this.images.set(this.images().filter(img => img.id !== imageId));
    this.updateFilteredImages();
  }
} 