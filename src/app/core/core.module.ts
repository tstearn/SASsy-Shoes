import {NgModule} from "@angular/core";
import {GuidService} from "./services/guid.service";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {NavBarComponent} from "./components/navbar/navbar.component";
import {PendingChangesGuard} from "./services/pending-changes.guard";
import {ProductGenerationService} from "./services/product-generation.service";
import {ProductMemoryService} from "./services/product-memory.service";
import {ProductService} from "./services/product.service";


@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    ProductGenerationService,
    {provide: ProductService, useClass: ProductMemoryService},
    GuidService,
    PendingChangesGuard
  ],
  exports: [
    NavBarComponent
  ]
})
export class CoreModule { }
