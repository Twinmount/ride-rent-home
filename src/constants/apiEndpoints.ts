export enum Slug {
  /****  homepage endpoints ****/
  GET_HOMEPAGE_BANNER = "/homepage-banners/list",
  GET_VEHICLE_CATEGORIES_LIST = "/vehicle-category/list",
  GET_VEHICLE_TYPES_LIST = "/vehicle-type/list",
  GET_HOMEPAGE_LIST = "/vehicle/home-page/list/v2",
  GET_HOMEPAGE_PROMOTIONS = "/ride-promotions/public",
  GET_TOP_BRANDS = "/vehicle-brand/top-brands",
  GET_STATES_LIST = "/states/list",
  // GET_HOMEPAGE_FAQ = "/state-faq/client/{stateValue}",
  GET_QUICK_LINKS = "/links/list",
  GET_HOMEPAGE_METADATA = "/metadata/homepage",

  /**** vehicle-details-page endpoints ****/
  GET_VEHICLE_DETAILS = "/vehicle/details",
  GET_SIMILAR_VEHICLES = "/vehicle/similar-cars",
  GET_VEHICLE_METADATA = "/metadata/vehicle",
  // GET_VEHICLE_DETAILS_DYNAMIC_FAQ = "/vehicle-faq/{vehicleCode}",

  /**** vehicle-listing-page endpoints  ****/
  GET_LISTING_PAGE_METADATA = "/metadata/listing",
  GET_LISTING_VEHICLES = "/vehicle/filter",
  GET_VEHICLE_BRANDS_LIST = "/vehicle-brand/list",

  /**** series-listing-page endpoints ****/
  GET_VEHICLE_SERIES_INFO = "/vehicle-series/info",
  GET_VEHICLE_SERIES_VEHICLE_LIST = "/vehicle/vehicle-series/list",
  GET_VEHICLE_SERIES_LIST_ALL = "/vehicle-series/list/all",
}
