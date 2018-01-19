import {Component, OnInit} from "@angular/core";
import {ProductService, ProductSearchRequest} from "../../services/product.service";
import {ProductBrief} from "../../domain/models";
import {Observable} from "rxjs";

@Component({
  selector: 'sassy-product-list',
  template: `
    <div class="row">
        <div class="col-md-2">
          <sassy-search></sassy-search>
        </div>
        <div class="col-md-10 product-list">
            <div *ngFor="let product of products" class="product-item">
              <sassy-product-brief [product]="product"></sassy-product-brief>
            </div>
         </div>
    </div>     
  `,
  styleUrls: ['product-list.less']
})
export class ProductList implements OnInit{
  products: ProductBrief[];

  constructor(private productService: ProductService) {
    productService.getAllProductBriefs().then((briefs)=>{
      this.products = briefs;
    });
  }

  ngOnInit() {
    this.productService.searchEvent.subscribe((searchReq: ProductSearchRequest)=>{
     this.productService.searchProducts(searchReq).then((briefs)=>{
       this.products = briefs;
     })
    });
  }
}
