import {HostListener} from "@angular/core";
import {ComponentCanDeactivate} from "./ComponentCanDeactivate";

export abstract class AbstractEditableComponent implements ComponentCanDeactivate{
  isDirty: boolean;

  constructor() {
    this.isDirty = false;
  }

  @HostListener('window:beforeunload')
  canDeactivate() : boolean {
    return !this.isDirty;
  }
}
