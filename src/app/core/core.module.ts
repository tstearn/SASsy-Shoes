import {NgModule} from "@angular/core";
import {GuidService} from "./services/guid.service";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {NavBarComponent} from "./components/navbar/navbar.component";
import {PendingChangesGuard} from "./services/pending-changes.guard";
import {ProductGenerationService} from "./services/product-generation.service";
import {ProductMemoryService} from "./services/product-memory.service";
import {ProductService} from "./services/product.service";
import {ElasticConfigService} from "./services/elastic-config.service";
import {ProductElasticService} from "./services/product-elastic.service";
import {HttpClientModule} from "@angular/common/http";
import {ProductLoaderResolver} from "./services/product-loader.resolver";


@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    ProductGenerationService,
    ElasticConfigService,
    {provide: ProductService, useClass: ProductElasticService},
    ProductLoaderResolver,
    GuidService,
    PendingChangesGuard,
  ],
  exports: [
    NavBarComponent
  ]
})
export class CoreModule { }
