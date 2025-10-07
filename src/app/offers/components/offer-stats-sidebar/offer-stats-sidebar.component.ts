import { Component, ChangeDetectionStrategy, signal, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Offer } from '../../offers.component';


@Component({
  selector: 'ib-offer-stats-sidebar',
  templateUrl: './offer-stats-sidebar.component.html',
  styleUrl: './offer-stats-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferStatsSidebarComponent {
  readonly offer = input.required<Offer>();
  readonly isOpen = input(signal(false));
  readonly close = output<void>();

  private sanitizer = inject(DomSanitizer);

  getSafeIframeUrl(): SafeResourceUrl | null {
    const offer = this.offer();
    if (!offer?.statsIframe) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(offer.statsIframe);
  }


  closeSidebar(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.close.emit();
  }
}
