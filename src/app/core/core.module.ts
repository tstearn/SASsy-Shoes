import {AlertModule, TypeaheadModule} from "ngx-bootstrap";
import {NgModule} from "@angular/core";
import {ProductService} from "./services/product.service";
import {GuidService} from "./services/guid.service";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {NavBarComponent} from "./components/navbar/navbar.component";

@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [ProductService,GuidService],
  exports: [
    NavBarComponent
  ]
})
export class CoreModule { }
