import {Injectable} from "@angular/core";

@Injectable()
export class ElasticConfigService {
  host = "localhost";
  port = 9200;
  appIndex = "sassyshooz";
  productType = "products";

  appIndexUrl = `http://${this.host}:${this.port}/${this.appIndex}`;
  productsTypeUrl = `http://${this.host}:${this.port}/${this.appIndex}/${this.productType}`;
}
