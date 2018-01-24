import {Injectable} from "@angular/core";
import {FacetFilter, ProductSearchRequest, ProductService} from "./product.service";
import {Observable} from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import {SearchFacet, Product, ProductBrief} from "../domain/models";
import {ElasticConfigService} from "./elastic-config.service";
import {HttpClient} from "@angular/common/http";
import {ProductGenerationService} from "./product-generation.service";
import * as _ from 'lodash';
import {GuidService} from "./guid.service";

@Injectable()
export class ProductElasticService extends ProductService {

  constructor(private elasticConfig: ElasticConfigService,
              private productGenerator: ProductGenerationService,
              private http: HttpClient,
              private guidService: GuidService){
   super();
  }

  getAllProductBriefs(): Observable<ProductBrief[]> {
    let searchConfig = {
      query: {
        match_all: {},
      },
      size: 100,
      _source: ["sku","description","colors","price","rating"]
    };
    return this.http.post(`${this.elasticConfig.productsTypeUrl}/_search`,searchConfig)
      .map((resp:any)=> {
        return _.map(resp.hits.hits,(hit:any)=> hit._source);
      });
  }

  getProduct(sku: string): Promise<Product> {
    return this.http.get(`${this.elasticConfig.productsTypeUrl}/${sku}`)
      .map((resp:any)=> resp._source)
      .toPromise();
  }

  searchProducts(searchRequest: ProductSearchRequest): Observable<ProductBrief[]> {
    let req = {
      query: {
        bool: {
          must: []
        }
      }
    };

    if(searchRequest.searchText) {
      req.query.bool.must.push({
       wildcard: {
         description: `*${searchRequest.searchText}*`
       }
      });
    }
    let facets = <FacetFilter[]>_.filter(searchRequest.facetFilters,facetFilter=> facetFilter.values.length > 0);
    this.updateQueryReqWithFacets(req,facets);

    return this.http.post(`${this.elasticConfig.productsTypeUrl}/_search`,req)
      .map((resp: any)=> {
        return _.map(resp.hits.hits,(hit:any)=> hit._source)
      });
  }

  private updateQueryReqWithFacets(req: any, facets: FacetFilter[]) {
    _.each(facets, (facet: FacetFilter)=>{
      switch(facet.name) {
        case "style":
          req.query.bool.must.push({
            terms: {style: facet.values}
          });
          break;
        case "price":
          let {min, max} = this.getNumberFacetMinMax(facet);
          req.query.bool.must.push({
            range: {
              price: {
                gte: min,
                lte: max
              }
            }
          });
          break;
      }
    })
  }

  private getNumberFacetMinMax(facet: FacetFilter) {
    let min = _.min(_.map(facet.values,entry => entry.value.min));
    let max = _.max(_.map(facet.values,entry => entry.value.max));
    return {
      min: min,
      max: max
    }
  }

  upsertProduct(product: Product): Promise<Product> {
    //Existing product - update
    if(product.sku) {
      return this.http.post(`${this.elasticConfig.productsTypeUrl}/${product.sku}/_update`,{doc: product})
        .map((resp)=> {
          return product
        })
        .toPromise();
    }
    //Create new product
    else {
      product.sku = this.guidService.generateUUID();
      return this.http.put(`${this.elasticConfig.productsTypeUrl}/${product.sku}`,product)
        .map((resp)=> {
          return product
        })
        .toPromise();
    }
  }

  deleteProduct(sku: string): Promise<any> {
    return this.http.delete(`${this.elasticConfig.productsTypeUrl}/${sku}`)
      .toPromise();
  }

  getProductVariableDomains(): Promise<any> {
    let uniqValReqs: any[]= _.map(["style","sizes"],prop=>{
      let query = {
        size: 0,
        aggs : {
          "uniq_value" : {
            "terms" : { "field" : prop }
          }
        }
      };
      return this.http.post(`${this.elasticConfig.productsTypeUrl}/_search`,query);
    });
    return forkJoin(uniqValReqs)
      .map((resp: any[])=>{
        return {
          colorMap: this.createColorMap(),
          styles: _.map(resp[0].aggregations.uniq_value.buckets,"key"),
          sizes: _.map(resp[1].aggregations.uniq_value.buckets,"key")
        }
      })
      .toPromise();
  }

  private createColorMap() {
    let retArray = [];
    _.each(_.zipObject(this.productGenerator.colors,["Black","White","Red","Brown","Grey"]),(value,key)=>retArray.push({code: key, desc: value}));
    return retArray;
  }

  getSearchFacets(): Promise<SearchFacet[]> {
    return of(this.productGenerator.facets).toPromise();
  }
}
