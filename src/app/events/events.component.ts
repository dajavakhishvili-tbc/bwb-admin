import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface EventItem {
  id: number;
  posthogKey: string;
  posthogEvent: string;
  createdAt: string;
}

@Component({
  selector: 'ib-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  readonly events = signal<EventItem[]>([
    { id: 1, posthogKey: 'user_signup', posthogEvent: 'User signed up', createdAt: '2024-01-15 14:30' },
    { id: 2, posthogKey: 'page_view', posthogEvent: 'Page viewed', createdAt: '2024-01-14 09:15' },
    { id: 3, posthogKey: 'button_click', posthogEvent: 'Button clicked', createdAt: '2024-01-13 16:45' },
    { id: 4, posthogKey: 'form_submit', posthogEvent: 'Form submitted', createdAt: '2024-01-12 11:20' },
    { id: 5, posthogKey: 'purchase', posthogEvent: 'Purchase completed', createdAt: '2024-01-11 13:55' },
  ]);
  
  readonly searchTerm = signal('');
  readonly sortBy = signal('createdAt');
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(5);
  
  readonly filteredEvents = signal<EventItem[]>([]);
  readonly totalPages = signal(1);
  
  // Dialog state
  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly newPosthogKey = signal('');
  readonly newPosthogEvent = signal('');
  
  constructor() {
    this.updateFilteredEvents();
  }
  
  updateSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.currentPage.set(1);
    this.updateFilteredEvents();
  }
  
  updateSort(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortBy.set(target.value);
    this.updateFilteredEvents();
  }
  
  updateFilteredEvents() {
    let filtered = this.events().filter(event => 
      event.posthogKey.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
      event.posthogEvent.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
    
    // Sort events
    filtered.sort((a, b) => {
      switch (this.sortBy()) {
        case 'posthogKey':
          return a.posthogKey.localeCompare(b.posthogKey);
        case 'posthogEvent':
          return a.posthogEvent.localeCompare(b.posthogEvent);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
    
    this.filteredEvents.set(filtered);
    this.totalPages.set(Math.ceil(filtered.length / this.itemsPerPage()));
  }
  
  openAddDialog() {
    this.showDialog.set(true);
    this.isEditing.set(false);
    this.editingId.set(null);
    this.newPosthogKey.set('');
    this.newPosthogEvent.set('');
  }
  
  openEditDialog(event: EventItem) {
    this.showDialog.set(true);
    this.isEditing.set(true);
    this.editingId.set(event.id);
    this.newPosthogKey.set(event.posthogKey);
    this.newPosthogEvent.set(event.posthogEvent);
  }
  
  closeDialog() {
    this.showDialog.set(false);
    this.isEditing.set(false);
    this.editingId.set(null);
    this.newPosthogKey.set('');
    this.newPosthogEvent.set('');
  }
  
  submitNewEvent() {
    if (this.newPosthogKey().trim() && this.newPosthogEvent().trim()) {
      if (this.isEditing()) {
        // Update existing event
        const editingId = this.editingId();
        if (editingId) {
          this.events.set(this.events().map(event => 
            event.id === editingId 
              ? { ...event, posthogKey: this.newPosthogKey().trim(), posthogEvent: this.newPosthogEvent().trim() }
              : event
          ));
        }
      } else {
        // Add new event
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10);
        const formattedTime = now.toTimeString().slice(0, 5);
        const createdAt = `${formattedDate} ${formattedTime}`;
        
        const newEvent: EventItem = {
          id: this.generateNextId(),
          posthogKey: this.newPosthogKey().trim(),
          posthogEvent: this.newPosthogEvent().trim(),
          createdAt,
        };
        
        this.events.set([newEvent, ...this.events()]);
      }
      
      this.updateFilteredEvents();
      this.closeDialog();
    }
  }
  
  private generateNextId(): number {
    const current = this.events();
    return current.length > 0 ? Math.max(...current.map(event => event.id)) + 1 : 1;
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
  
  selectEvent(event: EventItem) {
    console.log('Selected event:', event);
  }
  
  deleteEvent(event: EventItem) {
    this.events.set(this.events().filter(e => e.id !== event.id));
    this.updateFilteredEvents();
  }

  onPosthogKeyInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newPosthogKey.set(target.value);
  }

  onPosthogEventInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newPosthogEvent.set(target.value);
  }
} 