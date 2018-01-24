import {Route} from "@angular/router";
import {ProductListComponent} from "./shop/product-list/product-list.component";
import {ProductDetailComponent} from "./shop/product-detail/product-detail.component";
import {InventoryModule} from "./inventory/inventory.module";
import {ProductLoaderResolver} from "./core/services/product-loader.resolver";

export const appRoutes: Route[] = [
  {path: '', component: ProductListComponent, resolve: {numLoadedDocs: ProductLoaderResolver}},
  {path: 'products/:sku',component: ProductDetailComponent, resolve: {numLoadedDocs: ProductLoaderResolver}},
  //Lazily load the inventory path - assume most users are shoppers and inventory only shown to admins
  {path: 'inventory',loadChildren: 'app/inventory/inventory.module#InventoryModule'}
];
