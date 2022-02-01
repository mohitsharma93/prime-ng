// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // API_ENDPOINT: 'https://localhost:44310/'
  // API_ENDPOINT: 'http://192.168.1.135:5252/',

  API_ENDPOINT:'http://192.168.1.101:7890/',
  // API_ENDPOINT:'http://localhost:4000/',
  API_ENDPOINT_PROXY: 'api/sellerDashboard/ShopOverview'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.