# Changelog

## 0.1.0 (2022-09-01)

This is the first version of JS library of Blossom!

The library knows all required DOM events to communicate with Blossom that supports already
- defining dApp ID # this is the identification of the dApp in Blossom; this ID is the key for the Context within which dApps can perform Blossom actions.
- use fdp-storage functionalities # the FDP Storage Object is a [Proxy Object underneath](https://github.com/fairDataSociety/blossom/issues/19) that only 
	communicates with Blossom to retreive FDP Storage responses.
- can ping the extension # to check whether the user has Blossom extension in the browser.
- close connection # if there is no need for the Blossom functionalities for the dApp anymore.

### Features

* add option to check if pod exists from library ([#72](https://github.com/fairDataSociety/blossom/issues/72)) ([aa917db](https://github.com/fairDataSociety/blossom/commit/aa917db701cbf6f4d7771d7cc7adbf014790a479))
* fdp storage ([#53](https://github.com/fairDataSociety/blossom/issues/53)) ([04eaa25](https://github.com/fairDataSociety/blossom/commit/04eaa250ed2823067001f8a923d3db74c10f426d))
* login ([#9](https://github.com/fairDataSociety/blossom/issues/9)) ([8cc7514](https://github.com/fairDataSociety/blossom/commit/8cc75140e38bc341d2c6edaa7bf4203500d35e22))


### Bug Fixes

* several library fixes ([#56](https://github.com/fairDataSociety/blossom/issues/56), [#57](https://github.com/fairDataSociety/blossom/issues/57)) ([#62](https://github.com/fairDataSociety/blossom/issues/62)) ([fe66aac](https://github.com/fairDataSociety/blossom/commit/fe66aac75528684017fd7e74a735af5011d07f91))


### Miscellaneous Chores

* release 0.1.0 ([24372f3](https://github.com/fairDataSociety/blossom/commit/24372f31cf9237902129ca9ed2e0588423e0cb9e))