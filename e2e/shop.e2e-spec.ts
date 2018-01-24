import {ShopPage} from "./shop.po";
import {browser, protractor} from "protractor";

describe("Shop Page",()=>{
  let allProductsCount = 22;
  let page: ShopPage;

  beforeEach(()=>{
    page = new ShopPage();
    page.navigateTo();
  });

  function productBriefCountEqual(expectedCount: number) {
    expect(page.getProductBriefs().count()).toEqual(expectedCount);
  }

  it('should show all products when navigate to shop page with no filters',()=>{
    productBriefCountEqual(allProductsCount);
  });

  describe('searchText tests',()=>{
    it('should show 3 products when search by "toe"',()=>{
      page.enterSearchText('toe');
      productBriefCountEqual(3);
    });
    it('should show all products when only one character in searchText since this is less than minLength',()=>{
      page.enterSearchText('t');
      productBriefCountEqual(allProductsCount);
    });
    it('should show all products after search text entered then removed',()=>{
      page.enterSearchText('toe');
      productBriefCountEqual(3);
      page.enterSearchText(protractor.Key.BACK_SPACE.repeat(3));
      productBriefCountEqual(allProductsCount);
    });
  });

  describe('style facet tests',()=>{
    it('should show 5 products when selecting single style facet value "Flat"',()=>{
      page.selectStyleFacetValues(["Flat"]);
      productBriefCountEqual(5);
    });
    it('should show 12 products when selecting multiple style facet values ["Flat","Sandle"]',()=>{
      page.selectStyleFacetValues(["Flat","Sandle"]);
      productBriefCountEqual(12);
    });
  });

  describe('combined searchText/facet tests',()=>{
    it('should shoe 3 products when search by "co" and select style facet values ["Flat","Sandle"]',()=>{
      page.enterSearchText('co');
      page.selectStyleFacetValues(["Flat","Sandle"]);
      productBriefCountEqual(3);
    });
  });
});
