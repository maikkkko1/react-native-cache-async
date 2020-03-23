# React Native Cache Service

Key-value based cache service for React Native.

## Getting started

#### Install the package

```
npm i --save react-native-cache-async
```

#### Import the module

```
import { CacheService } from "react-native-cache-async";
```

### Available methods

##### set(cacheKey, value, timeToExpire) - Inserts a value into the cache object.
##### get(cacheKey) - Returns a key from the cache object.
##### getKeys() - Returns all keys from the cache object.
##### isExpired(cacheKey) - Checks if the key is expired based on timeToExpire.
##### removeKey(cacheKey) - Removes a key from the cache object.
##### clear() - Clear the cache object.

### Usage example

```
import { CacheService } from "react-native-cache-async";

class MyApp {
  constructor() {
    this.cacheService = new CacheService();
  }
  
  async insertCacheValue() {
    const userData = {
      name: 'Maikon',
      age: 23
    }
  
    // Means that if now is 8:30 PM, will expire at 8:35PM
    const timeToExpire = 5;
  
    await this.cacheService.set('userData', userData, timeToExpire);
  }
  
  async getCacheValue() {
    const isExpired = await this.cacheService.isExpired('userData');
    
    if (!isExpired) {
      // If exists returns the object, else returns false.
      return await this.cacheService.get('userData');
    }
    
    return 'Expired key!';
  }
  
  async removeCacheKey() {
    return await this.cacheService.removeKey('userData');
  }
}
```
