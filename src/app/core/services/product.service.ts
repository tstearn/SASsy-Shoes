import {FacetGroup, Product, ProductBrief} from "../domain/models";
import {Observable} from "rxjs/Rx";
import {EventEmitter, Injectable} from "@angular/core";

export interface FacetFilter {
  name: string;
  values: any[];
}

export interface ProductSearchRequest {
  searchText: string;
  facetFilters: FacetFilter[];
}

@Injectable()
export abstract class ProductService {
  searchEvent: EventEmitter<ProductSearchRequest> = new EventEmitter();

  abstract getAllProductBriefs() : Observable<ProductBrief[]>;
  abstract getProduct(sku: string) : Promise<Product>;
  abstract searchProducts(searchRequest: ProductSearchRequest) : Observable<ProductBrief[]>;
  abstract upsertProduct(product: Product) : Promise<Product>;
  abstract deleteProduct(sku: string) : Promise<any>;
  abstract getProductColors();
  abstract getProductVariableDomains() : Promise<any>;
  abstract getSearchFacets() : Promise<FacetGroup[]>;
}



