import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

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
  templateUrl: './texts.component.html',
  styleUrl: './texts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextsComponent {
  // Current user signal
  readonly currentUser = signal<string>('admin');

  // Core data signals
  readonly texts = signal<TextItem[]>([
    { id: 1, key: 'welcome', english: 'Welcome to our website', georgian: 'მოგესალმებათ ჩვენი ვებსაიტი', channels: ['BWB', 'BMB'], labels: ['navigation', 'header'], author: 'admin', createdAt: '2024-01-15 14:30' },
    { id: 2, key: 'about', english: 'About Us', georgian: 'ჩვენს შესახებ', channels: ['BWB'], labels: ['company', 'info'], author: 'admin', createdAt: '2024-01-14 09:15' },
    { id: 3, key: 'contact', english: 'Contact Information', georgian: 'საკონტაქტო ინფორმაცია', channels: ['BMB'], labels: ['contact', 'support'], author: 'editor', createdAt: '2024-01-13 16:45' },
    { id: 4, key: 'services', english: 'Services', georgian: 'სერვისები', channels: ['BWB', 'BMB'], labels: ['business'], author: 'admin', createdAt: '2024-01-12 11:20' },
    { id: 5, key: 'home', english: 'Home', georgian: 'მთავარი', channels: ['BWB'], labels: ['navigation'], author: 'editor', createdAt: '2024-01-11 13:55' },
  ]);
  
  // Filter and pagination signals
  readonly searchTerm = signal('');
  readonly sortBy = signal<'createdAt-asc' | 'createdAt-desc'>('createdAt-desc');
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(5);
  readonly selectedChannelFilters = signal<string[]>([]);
  
  // Dialog state signals
  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly editingId = signal<number | null>(null);
  
  // Form input signals (linked signals)
  readonly newKey = signal('');
  readonly newEnglishText = signal('');
  readonly newGeorgianText = signal('');
  readonly selectedChannels = signal<string[]>([]);
  readonly newLabels = signal<string[]>([]);
  readonly newLabelInput = signal('');
  
  // Computed signals for filtered and sorted texts
  readonly filteredTexts = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const channelFilters = this.selectedChannelFilters();
    const texts = this.texts();
    
    return texts.filter(text => {
      // Text search filter
      const matchesSearch = !search || 
        text.key.toLowerCase().includes(search) ||
        text.english.toLowerCase().includes(search) ||
        text.georgian.toLowerCase().includes(search) ||
        text.author.toLowerCase().includes(search) ||
        text.labels.some(label => label.toLowerCase().includes(search));
      
      // Channel filter - show texts that have ALL selected channels
      const matchesChannel = channelFilters.length === 0 || 
        channelFilters.every(filterChannel => text.channels.includes(filterChannel));
      
      return matchesSearch && matchesChannel;
    });
  });
  
  readonly sortedTexts = computed(() => {
    const filtered = this.filteredTexts();
    const sortBy = this.sortBy();
    
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      if (isNaN(dateA) || isNaN(dateB)) {
        return 0;
      }
      
      switch (sortBy) {
        case 'createdAt-desc':
          return dateB - dateA;
        case 'createdAt-asc':
          return dateA - dateB;
        default:
          return dateB - dateA;
      }
    });
  });
  
  // Computed signals for pagination
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
  
  // Computed signals for pagination controls
  readonly hasPreviousPage = computed(() => this.currentPage() > 1);
  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
  
  // Computed signals for dialog validation
  readonly isKeyValid = computed(() => {
    const key = this.newKey().trim();
    if (!key) return false;
    
    // Allow trailing dots for user convenience while typing
    const cleanKey = key.replace(/\.+$/, '');
    if (!cleanKey) return false;
    
    const pattern = /^[a-z0-9]+(\.[a-z0-9]+)*$/;
    return pattern.test(cleanKey);
  });

  readonly isFormValid = computed(() => {
    return this.isKeyValid() && 
           this.newEnglishText().trim() && 
           this.newGeorgianText().trim() &&
           this.selectedChannels().length > 0;
  });
  
  // Computed signal for dialog title
  readonly dialogTitle = computed(() => {
    return this.isEditing() ? 'Edit Text' : 'Add New Text';
  });
  
  // Computed signal for submit button text
  readonly submitButtonText = computed(() => {
    return this.isEditing() ? 'Update' : 'Add';
  });
  
  constructor() {
    // Reset to first page when search changes
    this.searchTerm.set('');
  }
  
  // Event handlers
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

  onChannelFilterChange(channel: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const currentFilters = [...this.selectedChannelFilters()];
    
    if (target.checked) {
      if (!currentFilters.includes(channel)) {
        currentFilters.push(channel);
      }
    } else {
      const index = currentFilters.indexOf(channel);
      if (index > -1) {
        currentFilters.splice(index, 1);
      }
    }
    
    this.selectedChannelFilters.set(currentFilters);
    this.currentPage.set(1);
  }

  isChannelFilterSelected(channel: string): boolean {
    return this.selectedChannelFilters().includes(channel);
  }
  
  // Dialog management
  openAddDialog() {
    this.showDialog.set(true);
    this.isEditing.set(false);
    this.editingId.set(null);
    this.resetForm();
  }
  
  openEditDialog(text: TextItem) {
    this.showDialog.set(true);
    this.isEditing.set(true);
    this.editingId.set(text.id);
    this.newKey.set(text.key);
    this.newEnglishText.set(text.english);
    this.newGeorgianText.set(text.georgian);
    this.selectedChannels.set([...text.channels]);
    this.newLabels.set([...text.labels]);
  }
  
  closeDialog() {
    this.showDialog.set(false);
    this.isEditing.set(false);
    this.editingId.set(null);
    this.resetForm();
  }
  
  private resetForm() {
    this.newKey.set('');
    this.newEnglishText.set('');
    this.newGeorgianText.set('');
    this.selectedChannels.set([]);
    this.newLabels.set([]);
    this.newLabelInput.set('');
  }

  private generateKeyFromText(text: string): string {
    const words = text.trim().split(/\s+/);
    const limitedWords = words.slice(0, 4);
    return limitedWords
      .map(word => word.toLowerCase().replace(/[^a-z0-9]/g, ''))
      .filter(word => word.length > 0)
      .join('.');
  }
  
  submitNewText() {
    if (this.isFormValid()) {
      if (this.isEditing()) {
        this.updateExistingText();
      } else {
        this.addNewText();
      }
      
      this.closeDialog();
    }
  }
  
  private updateExistingText() {
    const editingId = this.editingId();
    if (editingId) {
      const cleanKey = this.newKey().trim().replace(/\.+$/, '');
      
      this.texts.set(this.texts().map(text => 
        text.id === editingId 
          ? { 
              ...text, 
              key: cleanKey, 
              english: this.newEnglishText().trim(), 
              georgian: this.newGeorgianText().trim(),
              channels: [...this.selectedChannels()],
              labels: [...this.newLabels()],
              author: this.currentUser()
            }
          : text
      ));
    }
  }
  
  private addNewText() {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10);
    const formattedTime = now.toTimeString().slice(0, 5);
    const createdAt = `${formattedDate} ${formattedTime}`;
    
    const cleanKey = this.newKey().trim().replace(/\.+$/, '');
    
    const newText: TextItem = {
      id: this.generateNextId(),
      key: cleanKey,
      english: this.newEnglishText().trim(),
      georgian: this.newGeorgianText().trim(),
      channels: [...this.selectedChannels()],
      labels: [...this.newLabels()],
      author: this.currentUser(),
      createdAt,
    };
    
    this.texts.set([newText, ...this.texts()]);
  }
  
  private generateNextId(): number {
    const current = this.texts();
    return current.length > 0 ? Math.max(...current.map(text => text.id)) + 1 : 1;
  }
  
  // Pagination controls
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
  
  // Text actions
  selectText(text: TextItem) {
    console.log('Selected text:', text);
  }
  
  deleteText(text: TextItem) {
    this.texts.set(this.texts().filter(t => t.id !== text.id));
    // Reset to first page if current page becomes empty
    if (this.paginatedTexts().length === 0 && this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  // Form input handlers (linked signals)
  onKeyInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let value = target.value;
    
    // Remove spaces and convert to lowercase
    value = value.replace(/\s+/g, '');
    value = value.toLowerCase();
    
    // Only allow letters, numbers, and dots
    value = value.replace(/[^a-z0-9.]/g, '');
    
    // Replace consecutive dots with single dot
    value = value.replace(/\.{2,}/g, '.');
    
    // Only remove leading dots, allow trailing dots for user to continue typing
    value = value.replace(/^\.+/, '');
    
    this.newKey.set(value);
    target.value = value;
  }

  onEnglishTextInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    this.newEnglishText.set(value);
    
    if (!this.isEditing() && value.trim()) {
      const generatedKey = this.generateKeyFromText(value);
      if (generatedKey) {
        this.newKey.set(generatedKey);
      }
    }
  }

  onGeorgianTextInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.newGeorgianText.set(target.value);
  }

  toggleChannel(channel: string): void {
    const currentChannels = [...this.selectedChannels()];
    const index = currentChannels.indexOf(channel);
    
    if (index > -1) {
      currentChannels.splice(index, 1);
    } else {
      currentChannels.push(channel);
    }
    
    this.selectedChannels.set(currentChannels);
  }

  onChannelChange(channel: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const currentChannels = [...this.selectedChannels()];
    
    if (target.checked) {
      if (!currentChannels.includes(channel)) {
        currentChannels.push(channel);
      }
    } else {
      const index = currentChannels.indexOf(channel);
      if (index > -1) {
        currentChannels.splice(index, 1);
      }
    }
    
    this.selectedChannels.set(currentChannels);
  }

  isChannelSelected(channel: string): boolean {
    return this.selectedChannels().includes(channel);
  }

  onLabelInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newLabelInput.set(target.value);
  }

  onLabelKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addLabel();
    }
  }

  addLabel(): void {
    const label = this.newLabelInput().trim();
    if (label && !this.newLabels().includes(label)) {
      const currentLabels = [...this.newLabels()];
      currentLabels.push(label);
      this.newLabels.set(currentLabels);
      this.newLabelInput.set('');
    }
  }

  removeLabel(label: string): void {
    const currentLabels = this.newLabels().filter(l => l !== label);
    this.newLabels.set(currentLabels);
  }
} 