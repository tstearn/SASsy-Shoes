import {Component, Input} from "@angular/core";
import {SafeHtml, DomSanitizer} from "@angular/platform-browser";
import {ProductBrief} from "../../core/domain/models";

@Component({
  selector: 'sassy-product-brief',
  template: `
    <div class="thumbnail">
      <span [innerHTML]="imgHtml"></span>
      <div class="caption">
        <div><h4><a [routerLink]="['/products', product.sku]">{{ product.description }}</a></h4></div>
        <div><h4 class="h4-less-margin">{{ product.price | currency }}</h4></div>
      </div>
      <sassy-color-list [colors]="product.colors"
                        [readOnly]="true">
      </sassy-color-list>
      <div class="ratings">
        <sassy-stars [rating]="product.rating"></sassy-stars>
      </div>
    </div>
  `,
  styleUrls: ['./product-brief.component.less']
})
export class ProductBriefComponent {
  @Input() product: ProductBrief;

  imgHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.imgHtml = sanitizer.bypassSecurityTrustHtml(`
      <img src="http://placehold.it/320x150">`);
  }

}
