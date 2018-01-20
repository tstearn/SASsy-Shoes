import {Injectable} from "@angular/core";
import * as _ from "lodash";
import {FacetGroup, Product} from "../domain/models";
import {range} from "../utils/numberUtil";

@Injectable()
export class ProductGenerationService {
  products: Product[];
  colors: string[];
  styles: string[];
  sizes: number[];
  facets: FacetGroup[];

  constructor() {
    this.styles = ["Boot","Flat","Heel","Sandle"];
    this.sizes = [...range(5,10,.5),11,12,13];
    this.colors = ["#000000","#FFFFFF","#FF0000","#996633","#D3D3D3"];
    this.products = this.genProducts();
    this.facets = this.genFacets();
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
