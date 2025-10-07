import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfferCardComponent } from './components/offer-card/offer-card.component';
import { OfferDialogComponent } from './components/offer-dialog/offer-dialog.component';
import { OfferStatsSidebarComponent } from './components/offer-stats-sidebar/offer-stats-sidebar.component';
import { AuthService } from '../login/auth.service';

export interface Offer {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  author: string;
  statsIframe?: string;
}

export interface OfferForm {
  title: string;
  description: string;
  imageUrl: string;
  statsIframe?: string;
}

@Component({
  selector: 'ib-offers',
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, OfferCardComponent, OfferDialogComponent, OfferStatsSidebarComponent]
})
export class OffersComponent {
  readonly offers = signal<Offer[]>([]);
  readonly isDialogOpen = signal(false);
  readonly dialogForm = signal<OfferForm>({ title: '', description: '', imageUrl: '', statsIframe: '' });
  readonly dialogType = signal<'add' | 'edit'>('add');
  readonly editingOfferId = signal<number | null>(null);
  readonly draggedOffer = signal<Offer | null>(null);
  readonly isStatsSidebarOpen = signal(false);
  readonly selectedOfferForStats = signal<Offer | null>(null);

  private authService = inject(AuthService);

  constructor() {
    this.offers.set([
      {
        id: 1,
        title: 'Special Discount',
        description: 'Get 20% off on all products this week!',
        imageUrl: 'https://picsum.photos/300/200?random=1',
        createdAt: new Date('2024-01-15'),
        author: 'admin',
        statsIframe: 'https://eu.posthog.com/shared/OvTht1LV7gDaz-Ca5X4UFimMF1qsfQ',
      },
      {
        id: 2,
        title: 'Free Shipping',
        description: 'Free shipping on orders over $50',
        imageUrl: 'https://picsum.photos/300/200?random=2',
        createdAt: new Date('2024-01-14'),
        author: 'admin'
      },
      {
        id: 3,
        title: 'Limited Time Deal',
        description: 'Flash sale! 50% off selected items for the next 24 hours only.',
        imageUrl: 'https://picsum.photos/300/200?random=3',
        createdAt: new Date('2024-01-13'),
        author: 'admin'
      },
      {
        id: 4,
        title: 'Buy One Get One',
        description: 'Buy any item and get a second one absolutely free!',
        imageUrl: 'https://picsum.photos/300/200?random=4',
        createdAt: new Date('2024-01-12'),
        author: 'admin'
      },
      {
        id: 5,
        title: 'Student Discount',
        description: 'Students get 15% off with valid student ID. Valid on all purchases.',
        imageUrl: 'https://picsum.photos/300/200?random=5',
        createdAt: new Date('2024-01-11'),
        author: 'admin'
      },
      {
        id: 6,
        title: 'Loyalty Rewards',
        description: 'Earn points on every purchase and redeem for exclusive rewards.',
        imageUrl: 'https://picsum.photos/300/200?random=6',
        createdAt: new Date('2024-01-10'),
        author: 'admin'
      },
      {
        id: 7,
        title: 'Seasonal Clearance',
        description: 'Up to 70% off on seasonal items. Limited quantities available.',
        imageUrl: 'https://picsum.photos/300/200?random=7',
        createdAt: new Date('2024-01-09'),
        author: 'admin'
      }
    ]);
  }

  openAddDialog(): void {
    this.dialogType.set('add');
    this.dialogForm.set({ title: '', description: '', imageUrl: '', statsIframe: '' });
    this.editingOfferId.set(null);
    this.isDialogOpen.set(true);
  }

  openEditDialog(offer: Offer): void {
    this.dialogType.set('edit');
    this.dialogForm.set({
      title: offer.title,
      description: offer.description,
      imageUrl: offer.imageUrl,
      statsIframe: offer.statsIframe || ''
    });
    this.editingOfferId.set(offer.id);
    this.isDialogOpen.set(true);
  }

  closeDialog(): void {
    this.isDialogOpen.set(false);
    this.editingOfferId.set(null);
  }

  saveOffer(form: OfferForm): void {
    if (this.dialogType() === 'add') {
      const currentUser = this.authService.getCurrentUser();
      const newOffer: Offer = {
        id: this.generateNextId(),
        title: form.title,
        description: form.description,
        imageUrl: form.imageUrl,
        createdAt: new Date(),
        author: currentUser?.username || 'admin',
        statsIframe: form.statsIframe?.trim() || undefined
      };
      this.offers.set([newOffer, ...this.offers()]);
    } else {
      const currentOffers = this.offers();
      const updatedOffers = currentOffers.map(offer => 
        offer.id === this.editingOfferId() 
          ? { ...offer, title: form.title, description: form.description, imageUrl: form.imageUrl, statsIframe: form.statsIframe?.trim() || undefined }
          : offer
      );
      this.offers.set(updatedOffers);
    }
    this.closeDialog();
  }

  deleteOffer(offerId: number): void {
    this.offers.set(this.offers().filter(offer => offer.id !== offerId));
  }

  onDragStart(event: DragEvent, offer: Offer) {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', offer.id.toString());
      this.draggedOffer.set(offer);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  onDrop(event: DragEvent, targetOffer: Offer) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
    
    const draggedOffer = this.draggedOffer();
    if (!draggedOffer || draggedOffer.id === targetOffer.id) {
      this.draggedOffer.set(null);
      return;
    }

    const currentOffers = this.offers();
    const draggedIndex = currentOffers.findIndex(o => o.id === draggedOffer.id);
    const targetIndex = currentOffers.findIndex(o => o.id === targetOffer.id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const reorderedOffers = [...currentOffers];
      const [removed] = reorderedOffers.splice(draggedIndex, 1);
      reorderedOffers.splice(targetIndex, 0, removed);
      this.offers.set(reorderedOffers);
    }

    this.draggedOffer.set(null);
  }

  onDragEnd(event: DragEvent) {
    this.draggedOffer.set(null);
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  showOfferStats(offer: Offer): void {
    this.selectedOfferForStats.set(offer);
    this.isStatsSidebarOpen.set(true);
  }

  closeStatsSidebar(): void {
    this.isStatsSidebarOpen.set(false);
    this.selectedOfferForStats.set(null);
  }

  private generateNextId(): number {
    const current = this.offers();
    return current.length > 0 ? Math.max(...current.map(offer => offer.id)) + 1 : 1;
  }
} 