import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import StarsComponent from "./stars/stars.component";
import {AlertModule, TypeaheadModule} from "ngx-bootstrap";

@NgModule({
  declarations: [
    StarsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlertModule,
    TypeaheadModule
  ],
  exports: [
    StarsComponent,
    AlertModule,
    TypeaheadModule
  ]
})
export class SharedModule { }
