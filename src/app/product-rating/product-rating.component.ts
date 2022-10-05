import {Component, Input} from '@angular/core';
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-product-rating',
  templateUrl: './product-rating.component.html',
  styleUrls: ['./product-rating.component.css'],
  providers: [NgbRatingConfig]
})
export class ProductRatingComponent {
  @Input() rating!: number;
  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }
}
