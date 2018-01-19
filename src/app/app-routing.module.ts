import {Route} from "@angular/router";
import {ProductListComponent} from "./shop/product-list/product-list.component";
import {ProductDetailComponent} from "./shop/product-detail/product-detail.component";
import {InventoryModule} from "./inventory/inventory.module";

export const appRoutes: Route[] = [
  {path: '', component: ProductListComponent},
  {path: 'products/:sku',component: ProductDetailComponent},
  //Lazily load the inventory path - assume most users are shoppers and inventory only shown to admins
  {path: 'inventory',loadChildren: 'app/inventory/inventory.module#InventoryModule'}
];
