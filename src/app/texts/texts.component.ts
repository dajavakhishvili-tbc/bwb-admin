import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TextDialogComponent, TextFormData } from './components/text-dialog/text-dialog';

interface TextItem {
  id: number;
  key: string;
  english: string;
  georgian: string;
  channels: string[];
  labels: string[];
  author: string;
  createdAt: string;
}

@Component({
  selector: 'ib-texts',
  imports: [TextDialogComponent],
  templateUrl: './texts.component.html',
  styleUrl: './texts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextsComponent {
  readonly currentUser = signal<string>('admin');

  readonly texts = signal<TextItem[]>([
    { id: 1, key: 'welcome', english: 'Website', georgian: 'ვებსაიტი', channels: ['BWB', 'BMB'], labels: ['navigation', 'header'], author: 'admin', createdAt: '2024-01-15 14:30' },
    { id: 2, key: 'about', english: 'About Us', georgian: 'ჩვენს შესახებ', channels: ['BWB'], labels: ['company', 'info'], author: 'admin', createdAt: '2024-01-14 09:15' },
    { id: 3, key: 'contact', english: 'Contact Information', georgian: 'საკონტაქტო ინფორმაცია', channels: ['BMB'], labels: ['contact', 'support'], author: 'editor', createdAt: '2024-01-13 16:45' },
    { id: 4, key: 'services', english: 'Services', georgian: 'სერვისები', channels: ['BWB', 'BMB'], labels: ['business'], author: 'admin', createdAt: '2024-01-12 11:20' },
    { id: 5, key: 'home', english: 'Home', georgian: 'მთავარი', channels: ['BWB'], labels: ['navigation'], author: 'editor', createdAt: '2024-01-11 13:55' },
  ]);
  
  readonly searchTerm = signal('');
  readonly sortBy = signal<'createdAt-asc' | 'createdAt-desc'>('createdAt-desc');
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(5);
  readonly selectedChannelFilters = signal<string[]>([]);
  
  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly dialogFormData = computed((): TextFormData => {
    if (this.isEditing()) {
      const text = this.texts().find(t => t.id === this.editingId());
      if (text) {
        return {
          english: text.english,
          georgian: text.georgian,
          key: text.key,
          channels: [...text.channels],
          labels: [...text.labels]
        };
      }
    }
    return {
      english: '',
      georgian: '',
      key: '',
      channels: [],
      labels: []
    };
  });
  
  readonly filteredTexts = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const channelFilters = this.selectedChannelFilters();
    const texts = this.texts();
    
    return texts.filter(text => {
      const matchesSearch = !search || 
        text.key.toLowerCase().includes(search) ||
        text.english.toLowerCase().includes(search) ||
        text.georgian.toLowerCase().includes(search);
      
      const matchesChannel = channelFilters.length === 0 || 
        channelFilters.some(filter => text.channels.includes(filter));
      
      return matchesSearch && matchesChannel;
    });
  });
  
  readonly sortedTexts = computed(() => {
    const filtered = this.filteredTexts();
    const sortBy = this.sortBy();
    
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      if (sortBy === 'createdAt-asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
  });
  
  readonly totalPages = computed(() => {
    return Math.ceil(this.sortedTexts().length / this.itemsPerPage());
  });
  
  readonly paginatedTexts = computed(() => {
    const sorted = this.sortedTexts();
    const currentPage = this.currentPage();
    const itemsPerPage = this.itemsPerPage();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return sorted.slice(startIndex, endIndex);
  });
  
  readonly hasPreviousPage = computed(() => this.currentPage() > 1);
  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
  
  constructor() {
    this.searchTerm.set('');
  }
  
  updateSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(1);
  }
  
  updateSort(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortBy.set(target.value as 'createdAt-asc' | 'createdAt-desc');
    this.currentPage.set(1);
  }
  
  toggleChannelFilter(channel: string): void {
    const currentFilters = [...this.selectedChannelFilters()];
    const index = currentFilters.indexOf(channel);
    
    if (index > -1) {
      currentFilters.splice(index, 1);
    } else {
      currentFilters.push(channel);
    }
    
    this.selectedChannelFilters.set(currentFilters);
    this.currentPage.set(1);
  }

  isChannelFilterSelected(channel: string): boolean {
    return this.selectedChannelFilters().includes(channel);
  }
  
  openAddDialog() {
    this.showDialog.set(true);
    this.isEditing.set(false);
    this.editingId.set(null);
  }
  
  openEditDialog(text: TextItem) {
    this.showDialog.set(true);
    this.isEditing.set(true);
    this.editingId.set(text.id);
  }
  
  closeDialog() {
    this.showDialog.set(false);
    this.isEditing.set(false);
    this.editingId.set(null);
  }

  onDialogSubmit(formData: TextFormData) {
    if (this.isEditing()) {
      this.updateExistingText(formData);
    } else {
      this.addNewText(formData);
    }
    this.closeDialog();
  }

  private generateKeyFromText(text: string): string {
    const words = text.trim().split(/\s+/);
    const limitedWords = words.slice(0, 4);
    return limitedWords
      .map(word => word.toLowerCase().replace(/[^a-z0-9]/g, ''))
      .filter(word => word.length > 0)
      .join('.');
  }
  
  private updateExistingText(formData: TextFormData) {
    const editingId = this.editingId();
    if (editingId) {
      const cleanKey = formData.key.trim().replace(/\.+$/, '');
      
      this.texts.set(this.texts().map(text => 
        text.id === editingId 
          ? { 
              ...text, 
              key: cleanKey, 
              english: formData.english.trim(), 
              georgian: formData.georgian.trim(),
              channels: [...formData.channels],
              labels: [...formData.labels],
              author: this.currentUser()
            }
          : text
      ));
    }
  }
  
  private addNewText(formData: TextFormData) {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10);
    const formattedTime = now.toTimeString().slice(0, 5);
    const createdAt = `${formattedDate} ${formattedTime}`;
    
    const cleanKey = formData.key.trim().replace(/\.+$/, '');
    
    const newText: TextItem = {
      id: this.generateNextId(),
      key: cleanKey,
      english: formData.english.trim(),
      georgian: formData.georgian.trim(),
      channels: [...formData.channels],
      labels: [...formData.labels],
      author: this.currentUser(),
      createdAt,
    };
    
    this.texts.set([newText, ...this.texts()]);
  }
  
  private generateNextId(): number {
    const current = this.texts();
    return current.length > 0 ? Math.max(...current.map(text => text.id)) + 1 : 1;
  }
  
  previousPage() {
    if (this.hasPreviousPage()) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }
  
  nextPage() {
    if (this.hasNextPage()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }
  
  deleteText(text: TextItem) {
    this.texts.set(this.texts().filter(t => t.id !== text.id));
    if (this.paginatedTexts().length === 0 && this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }
}