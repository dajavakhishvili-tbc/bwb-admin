import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface ImageItem {
  id: number;
  name: string;
  url: string;
  size: string;
  uploadedAt: string;
}

@Component({
  selector: 'ib-images',
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesComponent {
  readonly images = signal<ImageItem[]>([
    { id: 1, name: 'product-1.jpg', url: 'https://picsum.photos/300/200?random=1', size: '2.3 MB', uploadedAt: '2024-01-15' },
    { id: 2, name: 'banner-2.png', url: 'https://picsum.photos/300/200?random=2', size: '1.8 MB', uploadedAt: '2024-01-14' },
    { id: 3, name: 'logo.svg', url: 'https://picsum.photos/300/200?random=3', size: '45 KB', uploadedAt: '2024-01-13' },
    { id: 4, name: 'hero-image.jpg', url: 'https://picsum.photos/300/200?random=4', size: '3.1 MB', uploadedAt: '2024-01-12' },
    { id: 5, name: 'icon-set.png', url: 'https://picsum.photos/300/200?random=5', size: '890 KB', uploadedAt: '2024-01-11' },
    { id: 6, name: 'background.jpg', url: 'https://picsum.photos/300/200?random=6', size: '2.7 MB', uploadedAt: '2024-01-10' },
    { id: 7, name: 'product-1.jpg', url: 'https://picsum.photos/300/200?random=1', size: '2.3 MB', uploadedAt: '2024-01-15' },
    { id: 8, name: 'banner-2.png', url: 'https://picsum.photos/300/200?random=2', size: '1.8 MB', uploadedAt: '2024-01-14' },
    { id: 9, name: 'logo.svg', url: 'https://picsum.photos/300/200?random=3', size: '45 KB', uploadedAt: '2024-01-13' },
    { id: 10, name: 'hero-image.jpg', url: 'https://picsum.photos/300/200?random=4', size: '3.1 MB', uploadedAt: '2024-01-12' },
    { id: 11, name: 'icon-set.png', url: 'https://picsum.photos/300/200?random=5', size: '890 KB', uploadedAt: '2024-01-11' },
    { id: 12, name: 'background.jpg', url: 'https://picsum.photos/300/200?random=6', size: '2.7 MB', uploadedAt: '2024-01-10' }
  ]);
  
  readonly searchTerm = signal('');
  readonly sortBy = signal('name');
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(6);
  
  readonly filteredImages = signal<ImageItem[]>([]);
  readonly totalPages = signal(1);
  
  constructor() {
    this.updateFilteredImages();
  }
  
  updateSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(1);
    this.updateFilteredImages();
  }
  
  updateSort(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortBy.set(target.value);
    this.updateFilteredImages();
  }
  
  updateFilteredImages() {
    let filtered = this.images().filter(img => 
      img.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
    
    // Sort images
    filtered.sort((a, b) => {
      switch (this.sortBy()) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'size':
          return this.parseSize(b.size) - this.parseSize(a.size);
        default:
          return 0;
      }
    });
    
    this.filteredImages.set(filtered);
    this.totalPages.set(Math.ceil(filtered.length / this.itemsPerPage()));
  }
  
  parseSize(size: string): number {
    const num = parseFloat(size.replace(/[^\d.]/g, ''));
    if (size.includes('MB')) return num * 1024;
    if (size.includes('KB')) return num;
    return num;
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      const newImage: ImageItem = {
        id: this.generateNextId(),
        name: file.name,
        url,
        size: this.formatFileSize(file.size),
        uploadedAt: new Date().toISOString().slice(0, 10),
      };
      this.images.set([newImage, ...this.images()]);
      this.updateFilteredImages();
    };
    reader.readAsDataURL(file);
    // Reset input value so same file can be uploaded again if needed
    input.value = '';
  }

  private generateNextId(): number {
    const current = this.images();
    return current.length > 0 ? Math.max(...current.map(img => img.id)) + 1 : 1;
  }

  private formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(0) + ' KB';
    } else {
      return bytes + ' B';
    }
  }
  
  selectImage(image: ImageItem) {
    // Implementation for image selection
    console.log('Selected image:', image);
  }
} 