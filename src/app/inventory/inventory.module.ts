import {NgModule} from "@angular/core";
import {InventoryComponent} from "./inventory.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {PendingChangesGuard} from "../core/services/pending-changes.guard";

@NgModule({
  declarations: [
    InventoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {path: '', component: InventoryComponent, canDeactivate: [PendingChangesGuard]}
    ]),
    SharedModule
  ],
})
export class InventoryModule { }
