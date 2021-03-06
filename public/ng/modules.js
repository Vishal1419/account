angular.module('accountApp', ['ngRoute', 'effectApp', 'natureApp', 'groupApp', 'countryApp', 'stateApp', 'creditDebitApp', 'ledgerApp', 'unitApp', 'itemApp']);

angular.module('effectApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'LocalStorageModule'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueEffect'] = "Effect Name already exists.";
                errorMessages['requiredEffect'] = "Effect name is required";
           });
       })
       .config(function (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('lsEffect').setStorageCookieDomain('');
       });

angular.module('natureApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'LocalStorageModule'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueNature'] = "Nature Name already exists.";
                errorMessages['requiredNature'] = "Nature name is required";
           });
       })
       .config(function (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('lsNature').setStorageCookieDomain('');
       });

angular.module('groupApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'LocalStorageModule', 'ui.bootstrap'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueGroup'] = "Group name already exists.";
                errorMessages['requiredGroup'] = "Group name is required";
                errorMessages['requiredParentGroup'] = "Parent group is required";
                errorMessages['noGroupFound'] = "Choose group from the list";
                errorMessages['unMatchNameAndParent'] = "Group name and Parent group name should be different";
           });
       })
       .config(function (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('lsGroup').setStorageCookieDomain('');
       });

angular.module('countryApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'LocalStorageModule'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueCountry'] = "Country name already exists.";
                errorMessages['requiredCountry'] = "Country name is required";
                errorMessages['uniqueCountryCode'] = "Country code already exists.";
                errorMessages['requiredCountryCode'] = "Country code is required";
                errorMessages['unMatchNameAndCode'] = "Country name and Country code should be different";                
           });
       })
       .config(function (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('lsCountry').setStorageCookieDomain('');
       });

angular.module('stateApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'LocalStorageModule', 'ui.bootstrap'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueState'] = "State name already exists.";
                errorMessages['requiredState'] = "State name is required";
                errorMessages['noCountryFound'] = "Choose country from list";
                errorMessages['requiredCountry'] = "Country name is required";
                errorMessages['unMatchStateAndCountry'] = "State name and Country name should be different";
           });
       })
       .config(function (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('lsState').setStorageCookieDomain('');
       });

angular.module('creditDebitApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'LocalStorageModule'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueCreditDebit'] = "CreditDebit name already exists.";
                errorMessages['requiredCreditDebit'] = "CreditDebit name is required";
                errorMessages['uniqueCreditDebitCode'] = "CreditDebit code already exists.";
                errorMessages['requiredCreditDebitCode'] = "CreditDebit code is required";
                errorMessages['unMatchNameAndCode'] = "CreditDebit name and CreditDebit code should be different";                                
           });
       })
       .config(function (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('lsCreditDebit').setStorageCookieDomain('');
       });

angular.module('ledgerApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'LocalStorageModule', 'ui.bootstrap'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueLedger'] = "Ledger name already exists.";
                errorMessages['requiredLedger'] = "Ledger name is required";
                errorMessages['noGroupFound'] = "Choose parent group from list";
                errorMessages['requiredParentGroup'] = "Parent group is required";
                errorMessages['unMatchParentGroupAndLedger'] = "Parent name and Ledger name should be different";
                errorMessages['noCreditDebitFound'] = "Choose credit or debit from list";
           });
       })
       .config(function (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('lsLedger').setStorageCookieDomain('');
       });

angular.module('unitApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'LocalStorageModule'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueUnitName'] = "Unit Name already exists.";
                errorMessages['requiredUnitName'] = "Unit name is required";
                errorMessages['uniqueUnitSymbol'] = "Unit Symbol already exists.";
                errorMessages['requiredUnitSymbol'] = "Unit symbol is required";
                errorMessages['requiredUnitNumberOfDecimalPlaces'] = "Please enter number of decimal places.";
           });
       })
       .config(function (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('lsUnit').setStorageCookieDomain('');
       });

angular.module('itemApp', ['ngRoute', 'jcs-autoValidate', 'ngFlash', 'LocalStorageModule', 'ui.bootstrap'])
       .run(function(defaultErrorMessageResolver) {
           defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                errorMessages['uniqueItem'] = "Item name already exists.";
                errorMessages['requiredItem'] = "Item name is required";
                errorMessages['noStockGroupFound'] = "Choose stock group from list";
                errorMessages['requiredStockGroup'] = "Stock group is required";
                errorMessages['noUnitFound'] = "Choose unit from list";
           });
       })
       .config(function (localStorageServiceProvider) {
          localStorageServiceProvider.setPrefix('lsItem').setStorageCookieDomain('');
       });