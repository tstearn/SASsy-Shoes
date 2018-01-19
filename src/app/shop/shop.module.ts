import {NgModule} from "@angular/core";
import {ProductListComponent} from "./product-list/product-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {SearchComponent} from "./search/search.component";
import {SearchFacetComponent} from "./search/search-facet/search-facet.component";
import {ColorListComponent} from "./color-list/color-list.component";
import {ProductBriefComponent} from "./product-brief/product-brief.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";


@NgModule({
  declarations: [
    ColorListComponent,
    ProductBriefComponent,
    ProductListComponent,
    ProductDetailComponent,
    SearchComponent,
    SearchFacetComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
})
export class ShopModule { }
