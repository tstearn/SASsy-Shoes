import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import * as _ from "lodash";
import {ProductGenerationService} from "./product-generation.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ElasticConfigService} from "./elastic-config.service";

@Injectable()
export class ProductLoaderResolver implements Resolve<Promise<any>>{

  constructor(private elasticConfig: ElasticConfigService,
              private productGenerator: ProductGenerationService,
              private http: HttpClient) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Promise<any> {
    return new Promise<any>((resolve,reject)=>{
      this.appIndexExists().subscribe((exists)=>{
        if(exists) {
          resolve(true)
        }
        //Otherwise, create/load index and configure it
        else {
          this.loadProductsToElastic().subscribe(()=>{
            this.configureIndex().subscribe(()=>{
              resolve(true);
            });
          });
        }
      });
    });
  }

  private appIndexExists() : Observable<boolean> {
    return this.http.get(`http://${this.elasticConfig.host}:${this.elasticConfig.port}/_cat/indices?format=json`)
      .map((resp: any[])=>{
        return _.some(resp,(indexStats: any) => indexStats.index === this.elasticConfig.appIndex && indexStats.status === "open");
      });
  }

  //Configures index to allow retrieving unique values for text fields
  //From what I've read, this isnt' recommended approach - just doing this for demo
  private configureIndex() : Observable<any> {
    let configReq = {
      properties: {
        colors: {
          type: "text",
          fielddata: true
        },
        style: {
          type: "text",
          fielddata: true
        }
      }
    };
    return this.http.put(`${this.elasticConfig.appIndexUrl}/_mapping/${this.elasticConfig.productType}`,configReq);
  }

  private loadProductsToElastic() : Observable<boolean>{
    let products = this.productGenerator.products;
    let loadReqs = [];
    _.each(products,product=>{
      var req = this.http.put(`${this.elasticConfig.productsTypeUrl}/${product.sku}`,product);
      loadReqs.push(req);
    });
    return forkJoin(loadReqs)
      .map((results:any) => true);
  }
}
