import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRatingComponent } from './product-rating.component';

describe('ProductRatingComponent', () => {
  let component: ProductRatingComponent;
  let fixture: ComponentFixture<ProductRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
