import {Injectable, EventEmitter} from "@angular/core";
import {Product, ProductBrief, ShoeWidth, FacetValue, FacetGroup} from "../domain/models";
import * as _ from 'lodash';
import {Observable} from "rxjs";
import {GuidService} from "./guid.service";
import {ProductGenerationService} from "./product-generation.service";
import {FacetFilter, ProductService, ProductSearchRequest} from "./product.service";


@Injectable()
export class ProductMemoryService extends ProductService{
  constructor(private prodGenService: ProductGenerationService, private guidService: GuidService) {
    super();
  }

  getAllProductBriefs() : Observable<ProductBrief[]> {
    return Observable.of(_.map(this.prodGenService.products, product=>this.productToProductBrief(product)) as ProductBrief[]);
  }

  getProduct(sku: string) : Promise<Product> {
    return Observable.of(_.find(this.prodGenService.products,{sku: sku})).toPromise();
  }

  getProductColors() {
    return this.prodGenService.colors;
  }

  getProductVariableDomains() : Promise<any> {
    return Observable.of({
      colorMap: this.createColorMap(),
      styles: this.prodGenService.styles,
      sizes: this.prodGenService.sizes
    }).toPromise()
  }

  searchProducts(searchRequest: ProductSearchRequest) : Observable<ProductBrief[]>  {
    let filteredProds = this.prodGenService.products;

    if(searchRequest.searchText) {
      filteredProds = <Product[]>_.filter(this.prodGenService.products,product => product.description.toLowerCase().includes(searchRequest.searchText.toLowerCase()));
    }

    let facets = <FacetFilter[]>_.filter(searchRequest.facetFilters,facetFilter=> facetFilter.values.length > 0);
    filteredProds= this.filterByFacets(filteredProds,facets);

    return Observable.of(_.map(filteredProds,this.productToProductBrief));
  }

  upsertProduct(product: Product) : Promise<Product>{
    if(product.sku) {
      this.prodGenService.products = [..._.reject(this.prodGenService.products, {sku: product.sku}),product]
    }
    else {
      product.sku = this.guidService.generateUUID();
      this.prodGenService.products.push(product);
    }

    return Observable.of(product).toPromise();
  }

  deleteProduct(sku: string) : Promise<any>{
    this.prodGenService.products = _.reject(this.prodGenService.products,{sku: sku});
    return Observable.of(null).toPromise();
  }

  getSearchFacets() : Promise<FacetGroup[]>{
    return Observable.of(this.prodGenService.facets).toPromise();
  }


  private createColorMap() {
    let retArray = [];
    _.each(_.zipObject(this.prodGenService.colors,["Black","White","Red","Brown","Grey"]),(value,key)=>retArray.push({code: key, desc: value}));
    return retArray;
  }

  private filterByFacets(products: Product[], facetFilters: FacetFilter[]) {
    let filteredProducts = products;
    _.each(facetFilters,(filter: FacetFilter)=>{
      switch(filter.name) {
        case "style":
          filteredProducts = this.filterByStringListFacet(filteredProducts,filter.name,filter.values);
          break;
        case "price":
          filteredProducts = this.filterByRangeFacet(filteredProducts,filter.name,filter.values);
          break;
      }
    });
    return filteredProducts;
  }
  private filterByStringListFacet(products: Product[], prodProperty: string, filterValues: any[]) {
    let filterStrs: string[] = _.map(filterValues,"value");
    return _.filter(products, (product: Product)=> {
      return filterStrs.indexOf(product[prodProperty]) != -1;
    })
  }

  private filterByRangeFacet(products: Product[], prodProperty: string, filterValues: any[]) {
    let min = _.min(_.map(filterValues,entry => entry.value.min));
    let max = _.max(_.map(filterValues,entry => entry.value.max));
    return _.filter(products,(product: Product)=>product[prodProperty] >= min && product[prodProperty] <= max);
  }

  private productToProductBrief(product: Product) : ProductBrief {
    return _.pick(product,["sku","description","colors","price","rating"]) as ProductBrief;
  }
}

