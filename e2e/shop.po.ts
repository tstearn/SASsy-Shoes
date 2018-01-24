import {browser, by, element} from "protractor";

export class MinMaxFacetValue {
  min: number;
  max: number;
}

export class ShopPage {
  navigateTo() {
    return browser.get("/");
  }

  getProductBriefs() {
    return element.all(by.css('.product-item'))
  }

  getSearchTextBox() {
    return element(by.css('.search-box'))
  }

  enterSearchText(searchText: string) {
   this.getSearchTextBox().sendKeys(searchText);
  }

  selectStyleFacetValues(values: string[]) {
    values.forEach((value)=>{
      let styleFacetLI = element(by.css(`li[data-facet-name="style"][data-facet-value="${value}"]`));
      styleFacetLI.click();
    });
  }
}
