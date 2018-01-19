import {Component, Input, OnInit} from "@angular/core";
@Component({
  selector: 'sassy-color-list',
  template: `
    <div *ngFor="let color of colors"
         [style.background]="color" 
         class="color-square">
    </div>
  `,
  styleUrls: ['color-list.component.less']
})
export class ColorListComponent{
  @Input() colors: string[];
  @Input() readOnly: boolean;
}
