import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Offer } from '../../offers.component';


@Component({
  selector: 'ib-offer-stats-sidebar',
  templateUrl: './offer-stats-sidebar.component.html',
  styleUrl: './offer-stats-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferStatsSidebarComponent {
  private sanitizer = inject(DomSanitizer);

  readonly offer = input.required<Offer>();
  readonly isOpen = input(false);
  readonly close = output<void>();

  getSafeIframeUrl(): SafeResourceUrl | null {
    const offer = this.offer();
    if (!offer?.statsIframe) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(offer.statsIframe);
  }

  closeSidebar(): void {
    this.close.emit();
  }
}
