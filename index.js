/**
 * @author Maikon Ferreira
 * @email mai.kon96@hotmail.com
 * @create date 2019-11-04 10:54:52
 * @modify date 2019-11-04 10:54:52
 * @desc Cache service.
 */

import { AsyncStorage } from "react-native";

const CACHE_NAME_KEY = "__cache__";

let storage = null;

export class CacheService {
  constructor() {
    storage = AsyncStorage;
  }

  async set(cacheKey, value, timeToExpire) {
    let cacheObject = await this._getCacheObject();

    timeToExpire = timeToExpire != null ? this._getExpireDate(timeToExpire) : 0;

    let initialInsertObject = [
      { key: cacheKey, data: value, expireWhen: timeToExpire }
    ];

    let insertObject = { key: cacheKey, data: value, expireWhen: timeToExpire };

    if (cacheObject == null) {
      await storage.setItem(CACHE_NAME_KEY, this.toJSON(initialInsertObject));
    } else {
      cacheObject = this.parse(cacheObject);

      let findObject = false;

      for (let k = 0; k < cacheObject.length; k++) {
        if (cacheObject[k].key == cacheKey) {
          cacheObject[k] = insertObject;

          findObject = true;
        }
      }

      if (!findObject) {
        cacheObject.push(insertObject);
      }

      await storage.setItem(CACHE_NAME_KEY, this.toJSON(cacheObject));
    }

    return true;
  }

  async get(cacheKey) {
    let cacheObject = await this._getCacheObject();

    if (cacheObject == null || cacheObject == undefined) return false;

    cacheObject = this.parse(cacheObject);

    for (let k = 0; k < cacheObject.length; k++) {
      this.verifyExpiredKeys(cacheObject[k].key);

      if (cacheObject[k].key == cacheKey) {
        return cacheObject[k].data;
      }
    }

    return false;
  }

  async getKeys() {
    let cacheObject = await this._getCacheObject();

    if (cacheObject == null || cacheObject == undefined) return null;

    cacheObject = this.parse(cacheObject);

    let cacheKeys = [];

    for (let k = 0; k < cacheObject.length; k++) {
      cacheKeys.push(cacheObject[k].key);
    }

    return cacheKeys;
  }

  async isExpired(cacheKey) {
    let cacheObject = await this._getCacheObject();

    if (cacheObject == null || cacheObject == undefined) return true;

    cacheObject = this.parse(cacheObject);

    let baseDate = new Date();
    let actualDate = new Date(
      baseDate.valueOf() - baseDate.getTimezoneOffset() * 60000
    );

    for (let k = 0; k < cacheObject.length; k++) {
      if (cacheObject[k].key == cacheKey) {
        if (cacheObject[k].expireWhen == 0) return false;

        if (new Date(cacheObject[k].expireWhen) > actualDate) {
          return false;
        }
      }
    }

    return true;
  }

  async removeKey(cacheKey) {
    let cacheObject = await this._getCacheObject();

    if (cacheObject == null || cacheObject == undefined) return false;

    cacheObject = this.parse(cacheObject);

    for (let k = 0; k < cacheObject.length; k++) {
      if (cacheObject[k].key == cacheKey) {
        cacheObject.splice(k, 1);
      }
    }

    await storage.setItem(CACHE_NAME_KEY, this.toJSON(cacheObject));

    return true;
  }

  verifyExpiredKeys(cacheKey) {
    if (this.isExpired(cacheKey)) {
      this.removeKey(cacheKey);
    }
  }

  async clear() {
    await storage.removeItem(CACHE_NAME_KEY);
  }

  _getExpireDate(minutesToExpire) {
    let baseDate = new Date();
    let date = new Date(
      baseDate.valueOf() - baseDate.getTimezoneOffset() * 60000
    );

    return new Date(date.getTime() + minutesToExpire * 60000).toISOString();
  }

  async _getCacheObject() {
    return await storage.getItem(CACHE_NAME_KEY);
  }

  parse(value) {
    return JSON.parse(value);
  }

  toJSON(value) {
    return JSON.stringify(value);
  }
}
