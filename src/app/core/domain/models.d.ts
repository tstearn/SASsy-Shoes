type ShoeWidth = "Regular" | "Wide";

export interface ProductBrief {
  sku?: string;
  description: string;
  colors: string[];
  price: number;
  rating?: number;
}

export interface Product extends ProductBrief{
  style: string;
  sizes: number[];
  images?: string[];
}

export interface ProductInventoryItem {
  id: string;
  productSku: string;
}

export interface SearchFacet {
  name: string;
  label: string;
  values: SearchFacetValue[];
}

export interface SearchFacetValue {
  id: string;
  label: string;
  value: any;
  count?: number;
  selected?: boolean;
}
