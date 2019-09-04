/* eslint-disable no-unused-vars */

// We are loading resources
const PROXY_STATE_LOADING = "loading";

// We are offline.
const PROXY_STATE_OFFLINE = "offline";

// The user is not authenticated, the proxy is not configured.
const PROXY_STATE_UNAUTHENTICATED = "unauthenticated";

// The user is registered, the proxy has been disabled.
const PROXY_STATE_INACTIVE = "inactive";

// The user is registered, the proxy is active.
const PROXY_STATE_ACTIVE = "active";

// The proxy has been configured. We want to check if it works correctly.
const PROXY_STATE_CONNECTING = "connecting";

// There is another proxy in use.
const PROXY_STATE_OTHERINUSE = "otherInUse";

// Generic proxy error.
const PROXY_STATE_PROXYERROR = "proxyError";

// The proxy rejects the current user token.
const PROXY_STATE_PROXYAUTHFAILED = "proxyAuthFailed";

// Authentication failed
const PROXY_STATE_AUTHFAILURE = "authFailure";

// FXA network error code.
const FXA_ERR_NETWORK = "networkError";

// FXA authentication failed error code.
const FXA_ERR_AUTH = "authFailed";

// FXA all good!
const FXA_OK = "ok";

// Testing URL. This request is sent with the proxy settings when we are in
// connecting state. If this succeeds, we go to active state.
const CONNECTING_HTTP_REQUEST = "http://test.factor11.cloudflareclient.com/";

// Proxy configuration
const DEFAULT_PROXY_URL = "https://firefox.factor11.cloudflareclient.com:2486";

// Token expiration time
const DEFAULT_FXA_EXPIRATION_TIME = 21600; // 6 hours

// How early we want to re-generate the tokens (in secs)
const DEFAULT_FXA_EXPIRATION_DELTA = 3600; // 1 hour


const ConfigUtils = {
  async setProxyURL(proxyURL) {
    await browser.storage.local.set({proxyURL});
  },

  async getProxyURL() {
    return new URL(await this.getStorageKey("proxyURL") || DEFAULT_PROXY_URL);
  },

  async setDebuggingEnabled(debuggingEnabled) {
    await browser.storage.local.set({debuggingEnabled});
  },

  async getDebuggingEnabled() {
    return await this.getStorageKey("debuggingEnabled") || false;
  },

  async setFxaExpirationTime(fxaExpirationTime) {
    await browser.storage.local.set({fxaExpirationTime});
  },

  async getFxaExpirationTime() {
    return parseInt(await this.getStorageKey("fxaExpirationTime"), 10) || DEFAULT_FXA_EXPIRATION_TIME;
  },

  async setFxaExpirationDelta(fxaExpirationDelta) {
    await browser.storage.local.set({fxaExpirationDelta});
  },

  async getFxaExpirationDelta() {
    return parseInt(await this.getStorageKey("fxaExpirationDelta"), 10) || DEFAULT_FXA_EXPIRATION_DELTA;
  },

  async getCurrentConfig() {
    let self = await browser.management.getSelf();

    return {
      version: self.version,
      proxyURL: await this.getProxyURL(),
      debuggingEnabled: await this.getDebuggingEnabled(),
      fxaExpirationTime: await this.getFxaExpirationTime(),
      fxaExpirationDelta: await this.getFxaExpirationDelta(),
    };
  },

  async getStorageKey(key) {
    let data = await browser.storage.local.get([key]);
    return data[key];
  }
};

// Enable debugging
let debuggingMode = false;
// We don't want to block log's from happening so use then()
ConfigUtils.getDebuggingEnabled().then((debugging) => {
  debuggingMode = debugging;
});
function log(msg, ...rest) {
  if (debuggingMode) {
    console.log("*** secure-proxy *** - " + msg, ...rest);
  }
}
