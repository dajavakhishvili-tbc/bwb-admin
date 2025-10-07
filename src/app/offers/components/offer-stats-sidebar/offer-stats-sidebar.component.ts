import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Offer } from '../../offers.component';


@Component({
  selector: 'ib-offer-stats-sidebar',
  templateUrl: './offer-stats-sidebar.component.html',
  styleUrl: './offer-stats-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferStatsSidebarComponent {
  @Input() offer!: Offer;
  @Input() isOpen = signal(false);
  @Output() close = new EventEmitter<void>();

  private sanitizer = inject(DomSanitizer);

  getSafeIframeUrl(): SafeResourceUrl | null {
    if (!this.offer?.statsIframe) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.offer.statsIframe);
  }


  closeSidebar(): void {
    this.close.emit();
  }
}
