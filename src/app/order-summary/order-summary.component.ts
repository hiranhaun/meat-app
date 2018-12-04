import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mt-order-summary',
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent implements OnInit {

  rated: boolean;

  constructor() { }

  ngOnInit() {
  }

  rate() {
    console.log('123');
    this.rated = true;
  }
}
