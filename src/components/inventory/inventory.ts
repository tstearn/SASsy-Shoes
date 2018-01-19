import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../domain/models";
import {ProductService} from "../../services/product.service";
import * as _ from 'lodash';

@Component({
  selector: 'sassy-inventory',
  templateUrl: 'inventory.html',
  styleUrls: ['inventory.less']
})
export class InventoryComponent implements OnInit{
  productForm: FormGroup;
  showErrors = false;
  isNewProduct = true;
  productLookups: any[];
  selectedProductLookup: any;
  selectedProductSku: string;
  styles: string[];
  colorMap: any[];
  sizes: number[];
  notificationMsg = null;
  //Used to automatically focus
  @ViewChild("descInput") private descInput: ElementRef;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group(({
      description: ['', Validators.required],
      style: ['', Validators.required],
      price: ['', Validators.required],
      colors: ['', Validators.required],
      sizes: ['', Validators.required]
    }));
    this.productService.getProductVariableDomains().then((result)=>{
      this.styles = result.styles;
      this.colorMap = result.colorMap;
      this.sizes = result.sizes;
    });
  }

  ngOnInit() {
    this.descInput.nativeElement.focus();
  }

  setNewProduct(value: boolean) {
    this.isNewProduct = value;
    if(!this.isNewProduct && !this.productLookups) {
      this.setProductLookups();
    }
  }

  private setProductLookups() : Promise<any>{
    return this.productService.getAllProductBriefs().then((lookups)=>{
      this.productLookups = lookups;
    });
  }

  onProductSelect() {
    let productInfo = _.find(this.productLookups,{description: this.selectedProductLookup});
    this.productService.getProduct(productInfo.sku).then((product)=>{
      this.selectedProductSku = product.sku;
      //Set form fields equal to contents of retreived product
      this.productForm.setValue({
        description: product.description,
        style: product.style,
        price: product.price.toFixed(2),
        colors: product.colors,
        sizes: product.sizes
      });
    })
  }

  onSubmit() {
    console.log("In submit");
    if(this.productForm.valid) {
      let product: Product = {
        sku: this.selectedProductSku ? this.selectedProductSku : undefined,
        description: this.productForm.get("description").value,
        style: this.productForm.get("style").value,
        colors: this.productForm.get("colors").value,
        price: this.productForm.get("price").value,
        sizes: this.productForm.get("sizes").value
      };
      this.productService.upsertProduct(product).then(()=>{
        this.notificationMsg = "Saved product successfully";
        if(this.isNewProduct) {
          this.showErrors = false;
          this.productForm.reset();
        }
        //If existing product, refresh lookups to reflect changes in description
        else {
          this.setProductLookups().then(()=>{
            this.selectedProductLookup = product.description;
          });
        }
      });
    }
    else {
      this.showErrors = true;
    }
  }

  onDelete() {
    this.productService.deleteProduct(this.selectedProductSku).then(()=>{
      this.notificationMsg = "Deleted product successfully";
      this.selectedProductSku = undefined;
      this.selectedProductLookup = undefined;
      this.showErrors = false;
      this.productForm.reset();

      this.setProductLookups();
    })
  }
}
