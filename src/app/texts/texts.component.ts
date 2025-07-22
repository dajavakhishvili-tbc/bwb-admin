import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

interface TextItem {
  id: number;
  key: string;
  english: string;
  georgian: string;
  createdAt: string;
}

@Component({
  selector: 'ib-texts',
  templateUrl: './texts.component.html',
  styleUrl: './texts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextsComponent {
  // Core data signals
  readonly texts = signal<TextItem[]>([
    { id: 1, key: 'welcome', english: 'Welcome to our website', georgian: 'მოგესალმებათ ჩვენი ვებსაიტი', createdAt: '2024-01-15 14:30' },
    { id: 2, key: 'about', english: 'About Us', georgian: 'ჩვენს შესახებ', createdAt: '2024-01-14 09:15' },
    { id: 3, key: 'contact', english: 'Contact Information', georgian: 'საკონტაქტო ინფორმაცია', createdAt: '2024-01-13 16:45' },
    { id: 4, key: 'services', english: 'Services', georgian: 'სერვისები', createdAt: '2024-01-12 11:20' },
    { id: 5, key: 'home', english: 'Home', georgian: 'მთავარი', createdAt: '2024-01-11 13:55' },
  ]);
  
  // Filter and pagination signals
  readonly searchTerm = signal('');
  readonly sortBy = signal<'key' | 'english' | 'georgian' | 'createdAt'>('createdAt');
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(5);
  
  // Dialog state signals
  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly editingId = signal<number | null>(null);
  
  // Form input signals (linked signals)
  readonly newKey = signal('');
  readonly newEnglishText = signal('');
  readonly newGeorgianText = signal('');
  
  // Computed signals for filtered and sorted texts
  readonly filteredTexts = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const texts = this.texts();
    
    return texts.filter(text => 
      text.key.toLowerCase().includes(search) ||
      text.english.toLowerCase().includes(search) ||
      text.georgian.toLowerCase().includes(search)
    );
  });
  
  readonly sortedTexts = computed(() => {
    const filtered = this.filteredTexts();
    const sortBy = this.sortBy();
    
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'key':
          return a.key.localeCompare(b.key);
        case 'english':
          return a.english.localeCompare(b.english);
        case 'georgian':
          return a.georgian.localeCompare(b.georgian);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
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
  readonly isFormValid = computed(() => {
    return this.newKey().trim() && 
           this.newEnglishText().trim() && 
           this.newGeorgianText().trim();
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
    this.sortBy.set(target.value as 'key' | 'english' | 'georgian' | 'createdAt');
    this.currentPage.set(1);
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
      this.texts.set(this.texts().map(text => 
        text.id === editingId 
          ? { 
              ...text, 
              key: this.newKey().trim(), 
              english: this.newEnglishText().trim(), 
              georgian: this.newGeorgianText().trim() 
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
    
    const newText: TextItem = {
      id: this.generateNextId(),
      key: this.newKey().trim(),
      english: this.newEnglishText().trim(),
      georgian: this.newGeorgianText().trim(),
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
    this.newKey.set(target.value);
  }

  onEnglishTextInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.newEnglishText.set(target.value);
  }

  onGeorgianTextInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.newGeorgianText.set(target.value);
  }
} 