import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppBootstrapModule} from "./app.bootstrap.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

import { AppComponent } from './app.component';
import {CoreModule} from "./core/core.module";
import {ShopModule} from "./shop/shop.module";
import {SharedModule} from "./shared/shared.module";
import {AlertModule, TypeaheadModule} from "ngx-bootstrap";
import {appRoutes} from "./app-routing.module";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppBootstrapModule,
    RouterModule.forRoot(appRoutes),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ShopModule,
    SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
