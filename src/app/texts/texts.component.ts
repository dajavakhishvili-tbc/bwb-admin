import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

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
  readonly texts = signal<TextItem[]>([
    { id: 1, key: 'welcome', english: 'Welcome to our website', georgian: 'მოგესალმებათ ჩვენი ვებსაიტი', createdAt: '2024-01-15 14:30' },
    { id: 2, key: 'about', english: 'About Us', georgian: 'ჩვენს შესახებ', createdAt: '2024-01-14 09:15' },
    { id: 3, key: 'contact', english: 'Contact Information', georgian: 'საკონტაქტო ინფორმაცია', createdAt: '2024-01-13 16:45' },
    { id: 4, key: 'services', english: 'Services', georgian: 'სერვისები', createdAt: '2024-01-12 11:20' },
    { id: 5, key: 'home', english: 'Home', georgian: 'მთავარი', createdAt: '2024-01-11 13:55' },
  ]);
  
  readonly searchTerm = signal('');
  readonly sortBy = signal('createdAt');
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(5);
  
  readonly filteredTexts = signal<TextItem[]>([]);
  readonly totalPages = signal(1);
  
  // Dialog state
  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly newKey = signal('');
  readonly newEnglishText = signal('');
  readonly newGeorgianText = signal('');
  
  constructor() {
    this.updateFilteredTexts();
  }
  
  updateSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(1);
    this.updateFilteredTexts();
  }
  
  updateSort(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortBy.set(target.value);
    this.updateFilteredTexts();
  }
  
  updateFilteredTexts() {
    let filtered = this.texts().filter(text => 
      text.key.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
      text.english.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
      text.georgian.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
    
    // Sort texts
    filtered.sort((a, b) => {
      switch (this.sortBy()) {
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
    
    this.filteredTexts.set(filtered);
    this.totalPages.set(Math.ceil(filtered.length / this.itemsPerPage()));
  }
  
  openAddDialog() {
    this.showDialog.set(true);
    this.isEditing.set(false);
    this.editingId.set(null);
    this.newKey.set('');
    this.newEnglishText.set('');
    this.newGeorgianText.set('');
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
    this.newKey.set('');
    this.newEnglishText.set('');
    this.newGeorgianText.set('');
  }
  
  submitNewText() {
    if (this.newKey().trim() && this.newEnglishText().trim() && this.newGeorgianText().trim()) {
      if (this.isEditing()) {
        // Update existing text
        const editingId = this.editingId();
        if (editingId) {
          this.texts.set(this.texts().map(text => 
            text.id === editingId 
              ? { ...text, key: this.newKey().trim(), english: this.newEnglishText().trim(), georgian: this.newGeorgianText().trim() }
              : text
          ));
        }
      } else {
        // Add new text
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
      
      this.updateFilteredTexts();
      this.closeDialog();
    }
  }
  
  private generateNextId(): number {
    const current = this.texts();
    return current.length > 0 ? Math.max(...current.map(text => text.id)) + 1 : 1;
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
  
  selectText(text: TextItem) {
    console.log('Selected text:', text);
  }
  
  deleteText(text: TextItem) {
    this.texts.set(this.texts().filter(t => t.id !== text.id));
    this.updateFilteredTexts();
  }
} 