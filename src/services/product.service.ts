import {Injectable, EventEmitter} from "@angular/core";
import {Product, ProductBrief, ShoeWidth, FacetValue, FacetGroup} from "../domain/models";
import {range} from "../utils/numberUtil";
import * as _ from 'lodash';
import {Observable} from "rxjs";
import {GuidService} from "./guid.service";

export interface FacetFilter {
  name: string;
  values: any[];
}

export interface ProductSearchRequest {
  searchText: string;
  facetFilters: FacetFilter[];
}

@Injectable()
export class ProductService {
  private products: Product[];
  private colors: string[];
  private styles: string[];
  private sizes: number[];
  private facets: FacetGroup[];
  searchEvent: EventEmitter<ProductSearchRequest> = new EventEmitter();


  constructor(private guidService: GuidService) {
    this.styles = ["Boot","Flat","Heel","Sandle"];
    this.sizes = [...range(5,10,.5),11,12,13];
    this.colors = ["#000000","#FFFFFF","#FF0000","#996633","#D3D3D3"];
    this.products = this.genProducts();
    this.facets = this.genFacets();
  }

  getAllProductBriefs() : Promise<ProductBrief[]> {
    return Observable.of(_.map(this.products, product=>this.productToProductBrief(product)) as ProductBrief[]).toPromise();
  }

  getProduct(sku: string) : Promise<Product> {
    return Observable.of(_.find(this.products,{sku: sku})).toPromise();
  }

  getProductColors() {
    return this.colors;
  }

  getProductVariableDomains() : Promise<any> {
    return Observable.of({
      colorMap: this.createColorMap(),
      styles: this.styles,
      sizes: this.sizes
    }).toPromise()
  }

  searchProducts(searchRequest: ProductSearchRequest) : Promise<ProductBrief[]>  {
    let filteredProds = this.products;

    if(searchRequest.searchText) {
      filteredProds = <Product[]>_.filter(this.products,product => product.description.toLowerCase().includes(searchRequest.searchText.toLowerCase()));
    }

    let facets = <FacetFilter[]>_.filter(searchRequest.facetFilters,facetFilter=> facetFilter.values.length > 0);
    filteredProds= this.filterByFacets(filteredProds,facets);

    return Observable.of(_.map(filteredProds,this.productToProductBrief)).toPromise();
  }

  upsertProduct(product: Product) : Promise<Product>{
    if(product.sku) {
      this.products = [..._.reject(this.products, {sku: product.sku}),product]
    }
    else {
      product.sku = this.guidService.generateUUID();
      this.products.push(product);
    }

    return Observable.of(product).toPromise();
  }

  deleteProduct(sku: string) : Promise<any>{
    this.products = _.reject(this.products,{sku: sku});
    return Observable.of(null).toPromise();
  }

  getSearchFacets() : Promise<FacetGroup[]>{
    return Observable.of(this.facets).toPromise();
  }


  private createColorMap() {
    let retArray = [];
    _.each(_.zipObject(this.colors,["Black","White","Red","Brown","Grey"]),(value,key)=>retArray.push({code: key, desc: value}));
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

  private genRating = ()=>Math.floor(Math.random() * 5);

  private genPrice = () => Math.random() * 70;

  private getColors() {
    let numColors = Math.floor(Math.random()* this.colors.length);
    return _.take(this.colors,numColors ? numColors : 1);

  }

  private genSizes() {
    let numSkips = Math.floor(Math.random()) * 2;
    if(numSkips > 0) {
      let skipIdxs = _.map(range(1,numSkips),idx=> Math.floor(Math.random()) * (this.sizes.length -1));
      let skipValues = _.map(skipIdxs, idx => this.sizes[idx]);
      return _.filter(this.sizes,value=> !_.find(skipValues,value));
    }
    else {
      return this.sizes;
    }
  }

  private genProducts() : Product[]{
    let shoeDescStylesImages = {
      "Heel": [
        {description: "Karma Round-Toe Pump",images: []},
        {description: "Ivy Hooded Peep-Toe Pump",images: []},
        {description: "Kara Oxford Pump",images: []},
        {description: "Joan 2-Pc. Pump",images: []},
        {description: "Jeanne Pointed-Toe Pump",images: []},
        {description: "Habit Pointed Pump",images: []}
      ],
      "Boot": [
        {description: "Veronica Kitten-Heel Boots",images: []},
        {description: "Sylvia Modern Chelsea Boots",images: []},
        {description: "Wyles Boots",images: []},
        {description: "Steffany Lace-Up Boots",images: []}
      ],
      "Flat": [
        {description: "Grommet Flat",images: []},
        {description: "Annalee Ankle Tie Flat",images: []},
        {description: "Bette Slingback Flat",images: []},
        {description: "Andie Ankle Strap Wedge",images: []},
        {description: "Corey Hardware Flat",images: []}
      ],
      "Sandle": [
        {description: "Maree Hardware Flat Sandal",images: []},
        {description: "Violet Embellished Flat",images: []},
        {description: "Ruben Studded Flat Sandal",images: []},
        {description: "Slice Covered Wedge Sandal",images: []},
        {description: "Present Flat Sling",images: []},
        {description: "Weldon Caged Block Heel Sandal",images: []},
        {description: "Tosh Covered Block Heel Sandal",images: []}
      ]
    };

    let skuNum = 1;
    return _.chain(_.keys(shoeDescStylesImages))
      .flatMap(key => _.map(shoeDescStylesImages[key],item=> _.extend(item,{style: key})))
      .map(productRoot => _.extend(productRoot,{
        sku: String(skuNum++),
        colors: this.getColors(),
        sizes: this.genSizes(),
        price: this.genPrice(),
        rating: this.genRating()
      }))
      .value() as Product[];
  }

  private genFacets() {
    return [
      {
        name: "style",
        label: "Style",
        values: [
          {
            id: "heel",
            value: "Heel",
            label: "Heel"
          },
          {
            id: "boot",
            value: "Boot",
            label: "Boot"
          },
          {
            id: "flat",
            value: "Flat",
            label: "Flat"
          },
          {
            id: "sandle",
            value: "Sandle",
            label: "Sandle"
          }
        ]
      },
      {
        name: "price",
        label: "Price",
        values: [
          {
            id: "1",
            value: {min: 10, max: 19.99},
            label: "$10 - $20"
          },
          {
            id: "2",
            value: {min: 20, max: 29.99},
            label: "$20 - $30"
          },
          {
            id: "3",
            value: {min: 30, max: 39.99},
            label: "$30 - $40"
          },
          {
            id: "4",
            value: {min: 40, max: 49.99},
            label: "$40 - $50"
          },
          {
            id: "5",
            value: {min: 50, max: 59.99},
            label: "$50 - $60"
          },
          {
            id: "6",
            value: {min: 60, max: Number.MAX_VALUE},
            label: "$60+"
          }
        ]
      }
    ]
  }
}

