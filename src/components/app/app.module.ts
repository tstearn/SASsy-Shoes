import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {AppBootstrapModule} from "./app.bootstrap.module";
import {Footer} from "../footer/footer";
import {NavBar} from "../navbar/navbar";
import {SearchComponent} from "../search/search";
import {ProductList} from "../product-list/product-list";
import {RouterModule} from "@angular/router";
import {ProductService} from "../../services/product.service";
import {ProductDetailComponent} from "../product-detail/product-detail"
import {ProductBriefComponent} from "../product-brief/product-brief";
import StarsComponent from "../stars/stars";
import {ColorListComponent} from "../color-list/color-list";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SearchFacetComponent} from "../search/search-facet/search-facet";
import {InventoryComponent} from "../inventory/inventory";
import {GuidService} from "../../services/guid.service";
import {AlertModule, TypeaheadModule} from "ngx-bootstrap";


@NgModule({
  declarations: [
    AppComponent,
    Footer,
    NavBar,
    SearchComponent,
    SearchFacetComponent,
    ProductList,
    ProductBriefComponent,
    ProductDetailComponent,
    StarsComponent,
    ColorListComponent,
    InventoryComponent
  ],
  imports: [
    BrowserModule,
    AppBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: '', component: ProductList},
      {path: 'products/:sku',component: ProductDetailComponent},
      {path: 'inventory',component: InventoryComponent}
    ]),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  providers: [ProductService,GuidService],
  bootstrap: [AppComponent]
})
export class AppModule { }
