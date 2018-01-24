import {Component, Input, Output, EventEmitter} from "@angular/core";
import * as _ from 'lodash';
import {SearchFacet, SearchFacetValue} from "../../../core/domain/models";

export interface FacetChangeEvent {
  facetName: string;
  valueId?: string;
  valueSelected?: boolean;
  value?: any;
  clearAll?: boolean;
}

@Component({
  selector: 'sassy-search-facet',
  template: `
    <div>
        <h3 [ngClass]="{'closed': closed}"
            (click)="closed = !closed">
          <span class="facetLabel">{{facet.label}}</span>
        </h3>
        <span class="clearFacet" 
               [hidden]="facetValueSelectCount == 0"
               (click)="clearFilters()">
               (clear)
        </span>
        <div [hidden]="closed"
             class="filter-controls">
          <ul *ngFor="let facetValue of facet.values">
            <li class="filter-control"
                [attr.data-facet-name]="facet.name"
                [attr.data-facet-value]="facetValue.value"
                (click)="facetValueSelected(facetValue)"
                [ngClass]="{'selected': facetValue.selected}">
              {{facetValue.label}}
            </li>
          </ul>     
        </div> 
    </div>
  `,
  styleUrls: ['search-facet.component.less']
})
export class SearchFacetComponent {
  @Input()  facet: SearchFacet;
  @Input()  closed: boolean;
  @Output() select: EventEmitter<FacetChangeEvent> = new EventEmitter();
  facetValueSelectCount = 0;

  facetValueSelected(facetValue: SearchFacetValue) {
    facetValue.selected = !facetValue.selected;
    this.select.emit({
      facetName: this.facet.name,
      valueId: facetValue.id,
      valueSelected: facetValue.selected,
      value: facetValue.value
    });

    if(facetValue.selected) this.facetValueSelectCount++;
    else this.facetValueSelectCount--;
  }

  clearFilters() {
      this.facet.values = _.map(this.facet.values,value=>{
          value.selected = false;
          return value;
      });
      this.facetValueSelectCount = 0;

      this.select.emit({
        facetName: this.facet.name,
        clearAll: true
      });
  }

}
