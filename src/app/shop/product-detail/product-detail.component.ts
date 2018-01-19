import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
@Component({
  selector: "sassy-product-detail",
  templateUrl: 'product-detail.component.html'
})
export class ProductDetailComponent {
  productSku: string;

  constructor(route: ActivatedRoute) {
    this.productSku = route.snapshot.params.sku;
  }
}
