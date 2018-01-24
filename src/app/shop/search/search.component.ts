import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import * as _ from 'lodash';
import {SearchFacet} from "../../core/domain/models";
import {FacetFilter, ProductService} from "../../core/services/product.service";
import {FacetChangeEvent} from "./search-facet/search-facet.component";


@Component({
  selector: 'sassy-search',
  template: `
    <div>Search:</div>
    <input [formControl]="searchTextBox"
           minlength="3"/>
    <div *ngFor="let facet of facets">
      <sassy-search-facet [facet]="facet"
                          [closed]="false"
                          (select)="onFacetChange($event)">
      </sassy-search-facet>
    </div>
    
  `
})
export class SearchComponent implements OnInit{
  searchTextBox = new FormControl();
  searchText: string;
  facets: SearchFacet[];
  facetFilters: FacetFilter[] = [];

  constructor(fb: FormBuilder, private productService: ProductService) {
    this.productService.getSearchFacets().then((results)=>{
      this.facets = results;
    })
  }

  ngOnInit() {
    this.searchTextBox.valueChanges
      .subscribe(form =>{
        this.searchText = this.searchTextBox.value as string;
        this.search();
      });
  }

  onFacetChange(event: FacetChangeEvent) {
    var matchingFilter: FacetFilter = _.find(this.facetFilters, {name: event.facetName}) || {name: event.facetName, values: []};
    if(event.clearAll) {
      matchingFilter.values = [];
    }
    else {
      matchingFilter.values = _.reject(matchingFilter.values,{id: event.valueId});
      if(event.valueSelected) {
        matchingFilter.values.push({id: event.valueId, value: event.value});
      }
    }

    this.facetFilters = [..._.reject(this.facetFilters,{name: event.facetName}),matchingFilter];

    this.search();
  }

  private search() {
    this.productService.searchEvent.emit({
      searchText: this.searchText,
      facetFilters: this.facetFilters
    });
  }
}
