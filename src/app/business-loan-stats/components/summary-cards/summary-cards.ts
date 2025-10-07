import { Component, input } from '@angular/core';

@Component({
  selector: 'ib-summary-cards',
  templateUrl: './summary-cards.html',
  styleUrls: ['./summary-cards.scss']
})
export class SummaryCardsComponent {
  totalAmount = input.required<string>();
  totalCount = input.required<number>();
  approvedAmount = input.required<string>();
  approvedCount = input.required<number>();
  pendingAmount = input.required<string>();
  pendingCount = input.required<number>();
}