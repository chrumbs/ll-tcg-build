"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // bin/live-reload.js
  var init_live_reload = __esm({
    "bin/live-reload.js"() {
      "use strict";
      new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());
    }
  });

  // node_modules/.pnpm/accordion-js@3.4.1/node_modules/accordion-js/dist/accordion.min.js
  var require_accordion_min = __commonJS({
    "node_modules/.pnpm/accordion-js@3.4.1/node_modules/accordion-js/dist/accordion.min.js"(exports, module) {
      "use strict";
      init_live_reload();
      !function(e) {
        let t = 0;
        const s = function(e2, n) {
          const i = "js-enabled", o = this;
          let r = false;
          if (Array.isArray(e2)) return !!e2.length && e2.map((e3) => new s(e3, n));
          const l = { init() {
            this.options = Object.assign({ duration: 500, ariaEnabled: true, collapse: true, showMultiple: false, onlyChildNodes: true, openOnInit: [], elementClass: "ac", triggerClass: "ac-trigger", panelClass: "ac-panel", activeClass: "is-active", beforeOpen: () => {
            }, onOpen: () => {
            }, beforeClose: () => {
            }, onClose: () => {
            } }, n);
            const t2 = "string" == typeof e2;
            this.container = t2 ? document.querySelector(e2) : e2, this.createDefinitions(), o.attachEvents();
          }, createDefinitions() {
            const { elementClass: e3, openOnInit: s2, onlyChildNodes: n2 } = this.options, o2 = n2 ? this.container.childNodes : this.container.querySelectorAll(a(e3));
            this.elements = Array.from(o2).filter((t2) => t2.classList && t2.classList.contains(e3)), this.firstElement = this.elements[0], this.lastElement = this.elements[this.elements.length - 1], this.elements.filter((e4) => !e4.classList.contains(i)).forEach((e4) => {
              e4.classList.add(i), this.generateIDs(e4), this.setARIA(e4), this.setTransition(e4);
              const n3 = this.elements.indexOf(e4);
              t++, s2.includes(n3) ? this.showElement(e4, false) : this.closeElement(e4, false);
            });
          }, setTransition(e3) {
            let t2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            const { duration: s2, panelClass: n2 } = this.options;
            e3.querySelector(a(n2)).style.transitionDuration = t2 ? null : "".concat(s2, "ms");
          }, generateIDs(e3) {
            const { triggerClass: s2, panelClass: n2 } = this.options, i2 = e3.querySelector(a(s2)), o2 = e3.querySelector(a(n2));
            e3.setAttribute("id", e3.id || "ac-".concat(t)), i2.setAttribute("id", i2.id || "ac-trigger-".concat(t)), o2.setAttribute("id", o2.id || "ac-panel-".concat(t));
          }, removeIDs(e3) {
            const { triggerClass: t2, panelClass: s2 } = this.options, n2 = e3.querySelector(a(t2)), i2 = e3.querySelector(a(s2));
            e3.id.startsWith("ac-") && e3.removeAttribute("id"), n2.id.startsWith("ac-") && n2.removeAttribute("id"), i2.id.startsWith("ac-") && i2.removeAttribute("id");
          }, setARIA(e3) {
            const { ariaEnabled: t2, triggerClass: s2, panelClass: n2 } = this.options;
            if (!t2) return;
            const i2 = e3.querySelector(a(s2)), o2 = e3.querySelector(a(n2));
            i2.setAttribute("role", "button"), i2.setAttribute("aria-controls", o2.id), i2.setAttribute("aria-disabled", false), i2.setAttribute("aria-expanded", false), o2.setAttribute("role", "region"), o2.setAttribute("aria-labelledby", i2.id);
          }, updateARIA(e3, t2) {
            let { ariaExpanded: s2, ariaDisabled: n2 } = t2;
            const { ariaEnabled: i2, triggerClass: o2 } = this.options;
            if (!i2) return;
            const r2 = e3.querySelector(a(o2));
            r2.setAttribute("aria-expanded", s2), r2.setAttribute("aria-disabled", n2);
          }, removeARIA(e3) {
            const { ariaEnabled: t2, triggerClass: s2, panelClass: n2 } = this.options;
            if (!t2) return;
            const i2 = e3.querySelector(a(s2)), o2 = e3.querySelector(a(n2));
            i2.removeAttribute("role"), i2.removeAttribute("aria-controls"), i2.removeAttribute("aria-disabled"), i2.removeAttribute("aria-expanded"), o2.removeAttribute("role"), o2.removeAttribute("aria-labelledby");
          }, focus(e3, t2) {
            e3.preventDefault();
            const { triggerClass: s2 } = this.options;
            t2.querySelector(a(s2)).focus();
          }, focusFirstElement(e3) {
            this.focus(e3, this.firstElement), this.currFocusedIdx = 0;
          }, focusLastElement(e3) {
            this.focus(e3, this.lastElement), this.currFocusedIdx = this.elements.length - 1;
          }, focusNextElement(e3) {
            const t2 = this.currFocusedIdx + 1;
            if (t2 > this.elements.length - 1) return this.focusFirstElement(e3);
            this.focus(e3, this.elements[t2]), this.currFocusedIdx = t2;
          }, focusPrevElement(e3) {
            const t2 = this.currFocusedIdx - 1;
            if (t2 < 0) return this.focusLastElement(e3);
            this.focus(e3, this.elements[t2]), this.currFocusedIdx = t2;
          }, showElement(e3) {
            let t2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
            const { panelClass: s2, activeClass: n2, collapse: i2, beforeOpen: o2 } = this.options;
            t2 && o2(e3);
            const r2 = e3.querySelector(a(s2)), l2 = r2.scrollHeight;
            e3.classList.add(n2), requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                r2.style.height = t2 ? "".concat(l2, "px") : "auto";
              });
            }), this.updateARIA(e3, { ariaExpanded: true, ariaDisabled: !i2 });
          }, closeElement(e3) {
            let t2 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
            const { panelClass: s2, activeClass: n2, beforeClose: i2 } = this.options, o2 = e3.querySelector(a(s2)), r2 = o2.scrollHeight;
            e3.classList.remove(n2), t2 ? (i2(e3), requestAnimationFrame(() => {
              o2.style.height = "".concat(r2, "px"), requestAnimationFrame(() => {
                o2.style.height = 0;
              });
            })) : o2.style.height = 0, this.updateARIA(e3, { ariaExpanded: false, ariaDisabled: false });
          }, toggleElement(e3) {
            const { activeClass: t2, collapse: s2 } = this.options, n2 = e3.classList.contains(t2);
            if (!n2 || s2) return n2 ? this.closeElement(e3) : this.showElement(e3);
          }, closeElements() {
            const { activeClass: e3, showMultiple: t2 } = this.options;
            t2 || this.elements.forEach((t3, s2) => {
              t3.classList.contains(e3) && s2 !== this.currFocusedIdx && this.closeElement(t3);
            });
          }, handleClick(e3) {
            const t2 = e3.currentTarget;
            this.elements.forEach((s2, n2) => {
              s2.contains(t2) && "A" !== e3.target.nodeName && (this.currFocusedIdx = n2, this.closeElements(), this.focus(e3, s2), this.toggleElement(s2));
            });
          }, handleKeydown(e3) {
            switch (e3.key) {
              case "ArrowUp":
                return this.focusPrevElement(e3);
              case "ArrowDown":
                return this.focusNextElement(e3);
              case "Home":
                return this.focusFirstElement(e3);
              case "End":
                return this.focusLastElement(e3);
              default:
                return null;
            }
          }, handleFocus(e3) {
            const t2 = e3.currentTarget, s2 = this.elements.find((e4) => e4.contains(t2));
            this.currFocusedIdx = this.elements.indexOf(s2);
          }, handleTransitionEnd(e3) {
            if (e3.stopPropagation(), "height" !== e3.propertyName) return;
            const { onOpen: t2, onClose: s2 } = this.options, n2 = e3.currentTarget, i2 = parseInt(n2.style.height), o2 = this.elements.find((e4) => e4.contains(n2));
            i2 > 0 ? (n2.style.height = "auto", t2(o2)) : s2(o2);
          } };
          this.attachEvents = () => {
            if (r) return;
            const { triggerClass: e3, panelClass: t2 } = l.options;
            l.handleClick = l.handleClick.bind(l), l.handleKeydown = l.handleKeydown.bind(l), l.handleFocus = l.handleFocus.bind(l), l.handleTransitionEnd = l.handleTransitionEnd.bind(l), l.elements.forEach((s2) => {
              const n2 = s2.querySelector(a(e3)), i2 = s2.querySelector(a(t2));
              n2.addEventListener("click", l.handleClick), n2.addEventListener("keydown", l.handleKeydown), n2.addEventListener("focus", l.handleFocus), i2.addEventListener("transitionend", l.handleTransitionEnd);
            }), r = true;
          }, this.detachEvents = () => {
            if (!r) return;
            const { triggerClass: e3, panelClass: t2 } = l.options;
            l.elements.forEach((s2) => {
              const n2 = s2.querySelector(a(e3)), i2 = s2.querySelector(a(t2));
              n2.removeEventListener("click", l.handleClick), n2.removeEventListener("keydown", l.handleKeydown), n2.removeEventListener("focus", l.handleFocus), i2.removeEventListener("transitionend", l.handleTransitionEnd);
            }), r = false;
          }, this.toggle = (e3) => {
            const t2 = l.elements[e3];
            t2 && l.toggleElement(t2);
          }, this.open = (e3) => {
            const t2 = l.elements[e3];
            t2 && l.showElement(t2);
          }, this.openAll = () => {
            const { activeClass: e3, onOpen: t2 } = l.options;
            l.elements.forEach((s2) => {
              s2.classList.contains(e3) || (l.showElement(s2, false), t2(s2));
            });
          }, this.close = (e3) => {
            const t2 = l.elements[e3];
            t2 && l.closeElement(t2);
          }, this.closeAll = () => {
            const { activeClass: e3, onClose: t2 } = l.options;
            l.elements.forEach((s2) => {
              s2.classList.contains(e3) && (l.closeElement(s2, false), t2(s2));
            });
          }, this.destroy = () => {
            this.detachEvents(), this.openAll(), l.elements.forEach((e3) => {
              l.removeIDs(e3), l.removeARIA(e3), l.setTransition(e3, true), e3.classList.remove(i);
            }), r = true;
          }, this.update = () => {
            l.createDefinitions(), this.detachEvents(), this.attachEvents();
          };
          const a = (e3) => ".".concat(CSS.escape(e3));
          l.init();
        };
        "undefined" != typeof module && void 0 !== module.exports ? module.exports = s : e.Accordion = s;
      }(window);
    }
  });

  // src/events/index.ts
  init_live_reload();

  // src/utils/errorHandler.ts
  init_live_reload();
  var showError = (message, timeout = 8e3) => {
    const errBox = document.querySelector('[data-role="error"]');
    if (errBox) {
      errBox.textContent = message;
      errBox.classList.remove("hide");
      setTimeout(() => {
        errBox.classList.add("hide");
      }, timeout);
    }
  };

  // src/utils/formatters.ts
  init_live_reload();
  var TZ = "America/Los_Angeles";
  var dateFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: TZ
  });
  var timeFmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ
  });
  var dateFormatter = (rawDate) => {
    const date = new Date(rawDate);
    return dateFmt.format(date);
  };
  var timeFormatter = (rawDate) => {
    const date = new Date(rawDate);
    return timeFmt.format(date);
  };
  var moneyFormatter = (amount, currency = "USD") => amount == null ? "" : new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(amount);

  // src/utils/pageTransition.ts
  init_live_reload();
  function pageTransition() {
    const introDurationMS = 1300;
    const exitDurationMS = 800;
    const excludedSelector = ".no-transition";
    const loader = document.querySelector('[ll-selector="loader"]');
    if (!loader) return;
    loader.style.opacity = "1";
    loader.style.display = "flex";
    loader.style.transition = `opacity ${introDurationMS}ms ease`;
    const hideLoader = () => {
      if (!loader) return;
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, introDurationMS);
    };
    const showLoader = () => {
      if (!loader) return;
      loader.style.display = "flex";
      void loader.offsetWidth;
      loader.style.opacity = "1";
    };
    document.body.classList.add("no-scroll-transition");
    setTimeout(() => {
      hideLoader();
      document.body.classList.remove("no-scroll-transition");
    }, 500);
    document.addEventListener("click", (e) => {
      const target = e.target;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (anchor.hostname !== window.location.hostname || // External link
      !href || // No href attribute
      href.includes("#") || // Any hash link (like #visit)
      href.endsWith("/") && href.indexOf("#") !== -1 || // Hash with trailing slash (like /#visit)
      anchor.matches(excludedSelector) || // Excluded class
      anchor.getAttribute("target") === "_blank" || // New tab
      anchor.getAttribute("download") !== null) {
        return;
      }
      e.preventDefault();
      const transitionURL = anchor.getAttribute("href");
      if (!transitionURL) return;
      document.body.classList.add("no-scroll-transition");
      showLoader();
      setTimeout(() => {
        window.location.href = transitionURL;
      }, exitDurationMS);
    });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        hideLoader();
        document.body.classList.remove("no-scroll-transition");
      }
    });
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (loader) loader.style.display = "none";
      }, 50);
    });
  }

  // src/utils/renderAccordions.ts
  init_live_reload();
  var import_accordion_js = __toESM(require_accordion_min(), 1);
  var renderAccordions = function(elements) {
    new import_accordion_js.default(elements, {
      showMultiple: true
      // openOnInit: [0],
    });
  };

  // src/utils/setText.ts
  init_live_reload();
  var setTextByAttr = (element, attr, text) => {
    const el = element.querySelector(`[data-field="${attr}"]`);
    if (!el) {
      console.warn(`Element with data-field="${attr}" not found`);
      return;
    }
    el.textContent = text;
  };

  // src/utils/shopify.ts
  init_live_reload();

  // node_modules/.pnpm/@shopify+storefront-api-client@1.0.9/node_modules/@shopify/storefront-api-client/dist/index.mjs
  init_live_reload();

  // node_modules/.pnpm/@shopify+storefront-api-client@1.0.9/node_modules/@shopify/storefront-api-client/dist/storefront-api-client.mjs
  init_live_reload();

  // node_modules/.pnpm/@shopify+graphql-client@1.4.1/node_modules/@shopify/graphql-client/dist/index.mjs
  init_live_reload();

  // node_modules/.pnpm/@shopify+graphql-client@1.4.1/node_modules/@shopify/graphql-client/dist/graphql-client/graphql-client.mjs
  init_live_reload();

  // node_modules/.pnpm/@shopify+graphql-client@1.4.1/node_modules/@shopify/graphql-client/dist/graphql-client/http-fetch.mjs
  init_live_reload();

  // node_modules/.pnpm/@shopify+graphql-client@1.4.1/node_modules/@shopify/graphql-client/dist/graphql-client/constants.mjs
  init_live_reload();
  var CLIENT = "GraphQL Client";
  var MIN_RETRIES = 0;
  var MAX_RETRIES = 3;
  var GQL_API_ERROR = "An error occurred while fetching from the API. Review 'graphQLErrors' for details.";
  var UNEXPECTED_CONTENT_TYPE_ERROR = "Response returned unexpected Content-Type:";
  var NO_DATA_OR_ERRORS_ERROR = "An unknown error has occurred. The API did not return a data object or any errors in its response.";
  var CONTENT_TYPES = {
    json: "application/json",
    multipart: "multipart/mixed"
  };
  var SDK_VARIANT_HEADER = "X-SDK-Variant";
  var SDK_VERSION_HEADER = "X-SDK-Version";
  var DEFAULT_SDK_VARIANT = "shopify-graphql-client";
  var DEFAULT_CLIENT_VERSION = "1.4.1";
  var RETRY_WAIT_TIME = 1e3;
  var RETRIABLE_STATUS_CODES = [429, 503];
  var DEFER_OPERATION_REGEX = /@(defer)\b/i;
  var NEWLINE_SEPARATOR = "\r\n";
  var BOUNDARY_HEADER_REGEX = /boundary="?([^=";]+)"?/i;
  var HEADER_SEPARATOR = NEWLINE_SEPARATOR + NEWLINE_SEPARATOR;

  // node_modules/.pnpm/@shopify+graphql-client@1.4.1/node_modules/@shopify/graphql-client/dist/graphql-client/utilities.mjs
  init_live_reload();
  function formatErrorMessage(message, client2 = CLIENT) {
    return message.startsWith(`${client2}`) ? message : `${client2}: ${message}`;
  }
  function getErrorMessage(error) {
    return error instanceof Error ? error.message : JSON.stringify(error);
  }
  function getErrorCause(error) {
    return error instanceof Error && error.cause ? error.cause : void 0;
  }
  function combineErrors(dataArray) {
    return dataArray.flatMap(({ errors }) => {
      return errors ?? [];
    });
  }
  function validateRetries({ client: client2, retries }) {
    if (retries !== void 0 && (typeof retries !== "number" || retries < MIN_RETRIES || retries > MAX_RETRIES)) {
      throw new Error(`${client2}: The provided "retries" value (${retries}) is invalid - it cannot be less than ${MIN_RETRIES} or greater than ${MAX_RETRIES}`);
    }
  }
  function getKeyValueIfValid(key, value) {
    return value && (typeof value !== "object" || Array.isArray(value) || typeof value === "object" && Object.keys(value).length > 0) ? { [key]: value } : {};
  }
  function buildDataObjectByPath(path, data) {
    if (path.length === 0) {
      return data;
    }
    const key = path.pop();
    const newData = {
      [key]: data
    };
    if (path.length === 0) {
      return newData;
    }
    return buildDataObjectByPath(path, newData);
  }
  function combineObjects(baseObject, newObject) {
    return Object.keys(newObject || {}).reduce((acc, key) => {
      if ((typeof newObject[key] === "object" || Array.isArray(newObject[key])) && baseObject[key]) {
        acc[key] = combineObjects(baseObject[key], newObject[key]);
        return acc;
      }
      acc[key] = newObject[key];
      return acc;
    }, Array.isArray(baseObject) ? [...baseObject] : { ...baseObject });
  }
  function buildCombinedDataObject([initialDatum, ...remainingData]) {
    return remainingData.reduce(combineObjects, { ...initialDatum });
  }

  // node_modules/.pnpm/@shopify+graphql-client@1.4.1/node_modules/@shopify/graphql-client/dist/graphql-client/http-fetch.mjs
  function generateHttpFetch({ clientLogger, customFetchApi = fetch, client: client2 = CLIENT, defaultRetryWaitTime = RETRY_WAIT_TIME, retriableCodes = RETRIABLE_STATUS_CODES }) {
    const httpFetch = async (requestParams, count, maxRetries) => {
      const nextCount = count + 1;
      const maxTries = maxRetries + 1;
      let response;
      try {
        response = await customFetchApi(...requestParams);
        clientLogger({
          type: "HTTP-Response",
          content: {
            requestParams,
            response
          }
        });
        if (!response.ok && retriableCodes.includes(response.status) && nextCount <= maxTries) {
          throw new Error();
        }
        const deprecationNotice = response?.headers.get("X-Shopify-API-Deprecated-Reason") || "";
        if (deprecationNotice) {
          clientLogger({
            type: "HTTP-Response-GraphQL-Deprecation-Notice",
            content: {
              requestParams,
              deprecationNotice
            }
          });
        }
        return response;
      } catch (error) {
        if (nextCount <= maxTries) {
          const retryAfter = response?.headers.get("Retry-After");
          await sleep(retryAfter ? parseInt(retryAfter, 10) : defaultRetryWaitTime);
          clientLogger({
            type: "HTTP-Retry",
            content: {
              requestParams,
              lastResponse: response,
              retryAttempt: count,
              maxRetries
            }
          });
          return httpFetch(requestParams, nextCount, maxRetries);
        }
        throw new Error(formatErrorMessage(`${maxRetries > 0 ? `Attempted maximum number of ${maxRetries} network retries. Last message - ` : ""}${getErrorMessage(error)}`, client2));
      }
    };
    return httpFetch;
  }
  async function sleep(waitTime) {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  // node_modules/.pnpm/@shopify+graphql-client@1.4.1/node_modules/@shopify/graphql-client/dist/graphql-client/graphql-client.mjs
  function createGraphQLClient({ headers, url, customFetchApi = fetch, retries = 0, logger }) {
    validateRetries({ client: CLIENT, retries });
    const config = {
      headers,
      url,
      retries
    };
    const clientLogger = generateClientLogger(logger);
    const httpFetch = generateHttpFetch({
      customFetchApi,
      clientLogger,
      defaultRetryWaitTime: RETRY_WAIT_TIME
    });
    const fetchFn = generateFetch(httpFetch, config);
    const request = generateRequest(fetchFn);
    const requestStream = generateRequestStream(fetchFn);
    return {
      config,
      fetch: fetchFn,
      request,
      requestStream
    };
  }
  function generateClientLogger(logger) {
    return (logContent) => {
      if (logger) {
        logger(logContent);
      }
    };
  }
  async function processJSONResponse(response) {
    const { errors, data, extensions } = await response.json();
    return {
      ...getKeyValueIfValid("data", data),
      ...getKeyValueIfValid("extensions", extensions),
      headers: response.headers,
      ...errors || !data ? {
        errors: {
          networkStatusCode: response.status,
          message: formatErrorMessage(errors ? GQL_API_ERROR : NO_DATA_OR_ERRORS_ERROR),
          ...getKeyValueIfValid("graphQLErrors", errors),
          response
        }
      } : {}
    };
  }
  function generateFetch(httpFetch, { url, headers, retries }) {
    return async (operation, options = {}) => {
      const { variables, headers: overrideHeaders, url: overrideUrl, retries: overrideRetries, keepalive, signal } = options;
      const body = JSON.stringify({
        query: operation,
        variables
      });
      validateRetries({ client: CLIENT, retries: overrideRetries });
      const flatHeaders = Object.entries({
        ...headers,
        ...overrideHeaders
      }).reduce((headers2, [key, value]) => {
        headers2[key] = Array.isArray(value) ? value.join(", ") : value.toString();
        return headers2;
      }, {});
      if (!flatHeaders[SDK_VARIANT_HEADER] && !flatHeaders[SDK_VERSION_HEADER]) {
        flatHeaders[SDK_VARIANT_HEADER] = DEFAULT_SDK_VARIANT;
        flatHeaders[SDK_VERSION_HEADER] = DEFAULT_CLIENT_VERSION;
      }
      const fetchParams = [
        overrideUrl ?? url,
        {
          method: "POST",
          headers: flatHeaders,
          body,
          signal,
          keepalive
        }
      ];
      return httpFetch(fetchParams, 1, overrideRetries ?? retries);
    };
  }
  function generateRequest(fetchFn) {
    return async (...props) => {
      if (DEFER_OPERATION_REGEX.test(props[0])) {
        throw new Error(formatErrorMessage("This operation will result in a streamable response - use requestStream() instead."));
      }
      let response = null;
      try {
        response = await fetchFn(...props);
        const { status, statusText } = response;
        const contentType = response.headers.get("content-type") || "";
        if (!response.ok) {
          return {
            errors: {
              networkStatusCode: status,
              message: formatErrorMessage(statusText),
              response
            }
          };
        }
        if (!contentType.includes(CONTENT_TYPES.json)) {
          return {
            errors: {
              networkStatusCode: status,
              message: formatErrorMessage(`${UNEXPECTED_CONTENT_TYPE_ERROR} ${contentType}`),
              response
            }
          };
        }
        return await processJSONResponse(response);
      } catch (error) {
        return {
          errors: {
            message: getErrorMessage(error),
            ...response == null ? {} : {
              networkStatusCode: response.status,
              response
            }
          }
        };
      }
    };
  }
  async function* getStreamBodyIterator(response) {
    const decoder = new TextDecoder();
    if (response.body[Symbol.asyncIterator]) {
      for await (const chunk of response.body) {
        yield decoder.decode(chunk);
      }
    } else {
      const reader = response.body.getReader();
      let readResult;
      try {
        while (!(readResult = await reader.read()).done) {
          yield decoder.decode(readResult.value);
        }
      } finally {
        reader.cancel();
      }
    }
  }
  function readStreamChunk(streamBodyIterator, boundary) {
    return {
      async *[Symbol.asyncIterator]() {
        try {
          let buffer = "";
          for await (const textChunk of streamBodyIterator) {
            buffer += textChunk;
            if (buffer.indexOf(boundary) > -1) {
              const lastBoundaryIndex = buffer.lastIndexOf(boundary);
              const fullResponses = buffer.slice(0, lastBoundaryIndex);
              const chunkBodies = fullResponses.split(boundary).filter((chunk) => chunk.trim().length > 0).map((chunk) => {
                const body = chunk.slice(chunk.indexOf(HEADER_SEPARATOR) + HEADER_SEPARATOR.length).trim();
                return body;
              });
              if (chunkBodies.length > 0) {
                yield chunkBodies;
              }
              buffer = buffer.slice(lastBoundaryIndex + boundary.length);
              if (buffer.trim() === `--`) {
                buffer = "";
              }
            }
          }
        } catch (error) {
          throw new Error(`Error occured while processing stream payload - ${getErrorMessage(error)}`);
        }
      }
    };
  }
  function createJsonResponseAsyncIterator(response) {
    return {
      async *[Symbol.asyncIterator]() {
        const processedResponse = await processJSONResponse(response);
        yield {
          ...processedResponse,
          hasNext: false
        };
      }
    };
  }
  function getResponseDataFromChunkBodies(chunkBodies) {
    return chunkBodies.map((value) => {
      try {
        return JSON.parse(value);
      } catch (error) {
        throw new Error(`Error in parsing multipart response - ${getErrorMessage(error)}`);
      }
    }).map((payload) => {
      const { data, incremental, hasNext, extensions, errors } = payload;
      if (!incremental) {
        return {
          data: data || {},
          ...getKeyValueIfValid("errors", errors),
          ...getKeyValueIfValid("extensions", extensions),
          hasNext
        };
      }
      const incrementalArray = incremental.map(({ data: data2, path, errors: errors2 }) => {
        return {
          data: data2 && path ? buildDataObjectByPath(path, data2) : {},
          ...getKeyValueIfValid("errors", errors2)
        };
      });
      return {
        data: incrementalArray.length === 1 ? incrementalArray[0].data : buildCombinedDataObject([
          ...incrementalArray.map(({ data: data2 }) => data2)
        ]),
        ...getKeyValueIfValid("errors", combineErrors(incrementalArray)),
        hasNext
      };
    });
  }
  function validateResponseData(responseErrors, combinedData) {
    if (responseErrors.length > 0) {
      throw new Error(GQL_API_ERROR, {
        cause: {
          graphQLErrors: responseErrors
        }
      });
    }
    if (Object.keys(combinedData).length === 0) {
      throw new Error(NO_DATA_OR_ERRORS_ERROR);
    }
  }
  function createMultipartResponseAsyncInterator(response, responseContentType) {
    const boundaryHeader = (responseContentType ?? "").match(BOUNDARY_HEADER_REGEX);
    const boundary = `--${boundaryHeader ? boundaryHeader[1] : "-"}`;
    if (!response.body?.getReader && !response.body?.[Symbol.asyncIterator]) {
      throw new Error("API multipart response did not return an iterable body", {
        cause: response
      });
    }
    const streamBodyIterator = getStreamBodyIterator(response);
    let combinedData = {};
    let responseExtensions;
    return {
      async *[Symbol.asyncIterator]() {
        try {
          let streamHasNext = true;
          for await (const chunkBodies of readStreamChunk(streamBodyIterator, boundary)) {
            const responseData = getResponseDataFromChunkBodies(chunkBodies);
            responseExtensions = responseData.find((datum) => datum.extensions)?.extensions ?? responseExtensions;
            const responseErrors = combineErrors(responseData);
            combinedData = buildCombinedDataObject([
              combinedData,
              ...responseData.map(({ data }) => data)
            ]);
            streamHasNext = responseData.slice(-1)[0].hasNext;
            validateResponseData(responseErrors, combinedData);
            yield {
              ...getKeyValueIfValid("data", combinedData),
              ...getKeyValueIfValid("extensions", responseExtensions),
              hasNext: streamHasNext
            };
          }
          if (streamHasNext) {
            throw new Error(`Response stream terminated unexpectedly`);
          }
        } catch (error) {
          const cause = getErrorCause(error);
          yield {
            ...getKeyValueIfValid("data", combinedData),
            ...getKeyValueIfValid("extensions", responseExtensions),
            errors: {
              message: formatErrorMessage(getErrorMessage(error)),
              networkStatusCode: response.status,
              ...getKeyValueIfValid("graphQLErrors", cause?.graphQLErrors),
              response
            },
            hasNext: false
          };
        }
      }
    };
  }
  function generateRequestStream(fetchFn) {
    return async (...props) => {
      if (!DEFER_OPERATION_REGEX.test(props[0])) {
        throw new Error(formatErrorMessage("This operation does not result in a streamable response - use request() instead."));
      }
      try {
        const response = await fetchFn(...props);
        const { statusText } = response;
        if (!response.ok) {
          throw new Error(statusText, { cause: response });
        }
        const responseContentType = response.headers.get("content-type") || "";
        switch (true) {
          case responseContentType.includes(CONTENT_TYPES.json):
            return createJsonResponseAsyncIterator(response);
          case responseContentType.includes(CONTENT_TYPES.multipart):
            return createMultipartResponseAsyncInterator(response, responseContentType);
          default:
            throw new Error(`${UNEXPECTED_CONTENT_TYPE_ERROR} ${responseContentType}`, { cause: response });
        }
      } catch (error) {
        return {
          async *[Symbol.asyncIterator]() {
            const response = getErrorCause(error);
            yield {
              errors: {
                message: formatErrorMessage(getErrorMessage(error)),
                ...getKeyValueIfValid("networkStatusCode", response?.status),
                ...getKeyValueIfValid("response", response)
              },
              hasNext: false
            };
          }
        };
      }
    };
  }

  // node_modules/.pnpm/@shopify+graphql-client@1.4.1/node_modules/@shopify/graphql-client/dist/api-client-utilities/validations.mjs
  init_live_reload();
  function validateDomainAndGetStoreUrl({ client: client2, storeDomain }) {
    try {
      if (!storeDomain || typeof storeDomain !== "string") {
        throw new Error();
      }
      const trimmedDomain = storeDomain.trim();
      const protocolUrl = trimmedDomain.match(/^https?:/) ? trimmedDomain : `https://${trimmedDomain}`;
      const url = new URL(protocolUrl);
      url.protocol = "https";
      return url.origin;
    } catch (error) {
      throw new Error(`${client2}: a valid store domain ("${storeDomain}") must be provided`, { cause: error });
    }
  }
  function validateApiVersion({ client: client2, currentSupportedApiVersions, apiVersion, logger }) {
    const versionError = `${client2}: the provided apiVersion ("${apiVersion}")`;
    const supportedVersion = `Currently supported API versions: ${currentSupportedApiVersions.join(", ")}`;
    if (!apiVersion || typeof apiVersion !== "string") {
      throw new Error(`${versionError} is invalid. ${supportedVersion}`);
    }
    const trimmedApiVersion = apiVersion.trim();
    if (!currentSupportedApiVersions.includes(trimmedApiVersion)) {
      if (logger) {
        logger({
          type: "Unsupported_Api_Version",
          content: {
            apiVersion,
            supportedApiVersions: currentSupportedApiVersions
          }
        });
      } else {
        console.warn(`${versionError} is likely deprecated or not supported. ${supportedVersion}`);
      }
    }
  }

  // node_modules/.pnpm/@shopify+graphql-client@1.4.1/node_modules/@shopify/graphql-client/dist/api-client-utilities/api-versions.mjs
  init_live_reload();
  function getQuarterMonth(quarter) {
    const month = quarter * 3 - 2;
    return month === 10 ? month : `0${month}`;
  }
  function getPrevousVersion(year, quarter, nQuarter) {
    const versionQuarter = quarter - nQuarter;
    if (versionQuarter <= 0) {
      return `${year - 1}-${getQuarterMonth(versionQuarter + 4)}`;
    }
    return `${year}-${getQuarterMonth(versionQuarter)}`;
  }
  function getCurrentApiVersion() {
    const date = /* @__PURE__ */ new Date();
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();
    const quarter = Math.floor(month / 3 + 1);
    return {
      year,
      quarter,
      version: `${year}-${getQuarterMonth(quarter)}`
    };
  }
  function getCurrentSupportedApiVersions() {
    const { year, quarter, version: currentVersion } = getCurrentApiVersion();
    const nextVersion = quarter === 4 ? `${year + 1}-01` : `${year}-${getQuarterMonth(quarter + 1)}`;
    return [
      getPrevousVersion(year, quarter, 3),
      getPrevousVersion(year, quarter, 2),
      getPrevousVersion(year, quarter, 1),
      currentVersion,
      nextVersion,
      "unstable"
    ];
  }

  // node_modules/.pnpm/@shopify+graphql-client@1.4.1/node_modules/@shopify/graphql-client/dist/api-client-utilities/utilities.mjs
  init_live_reload();
  function generateGetHeaders(config) {
    return (customHeaders) => {
      return { ...customHeaders ?? {}, ...config.headers };
    };
  }
  function generateGetGQLClientParams({ getHeaders, getApiUrl }) {
    return (operation, options) => {
      const props = [operation];
      if (options && Object.keys(options).length > 0) {
        const { variables, apiVersion: propApiVersion, headers, retries, signal } = options;
        props.push({
          ...variables ? { variables } : {},
          ...headers ? { headers: getHeaders(headers) } : {},
          ...propApiVersion ? { url: getApiUrl(propApiVersion) } : {},
          ...retries ? { retries } : {},
          ...signal ? { signal } : {}
        });
      }
      return props;
    };
  }

  // node_modules/.pnpm/@shopify+storefront-api-client@1.0.9/node_modules/@shopify/storefront-api-client/dist/constants.mjs
  init_live_reload();
  var DEFAULT_CONTENT_TYPE = "application/json";
  var DEFAULT_SDK_VARIANT2 = "storefront-api-client";
  var DEFAULT_CLIENT_VERSION2 = "1.0.9";
  var PUBLIC_ACCESS_TOKEN_HEADER = "X-Shopify-Storefront-Access-Token";
  var PRIVATE_ACCESS_TOKEN_HEADER = "Shopify-Storefront-Private-Token";
  var SDK_VARIANT_HEADER2 = "X-SDK-Variant";
  var SDK_VERSION_HEADER2 = "X-SDK-Version";
  var SDK_VARIANT_SOURCE_HEADER = "X-SDK-Variant-Source";
  var CLIENT2 = "Storefront API Client";

  // node_modules/.pnpm/@shopify+storefront-api-client@1.0.9/node_modules/@shopify/storefront-api-client/dist/validations.mjs
  init_live_reload();
  function validatePrivateAccessTokenUsage(privateAccessToken) {
    if (privateAccessToken && typeof window !== "undefined") {
      throw new Error(`${CLIENT2}: private access tokens and headers should only be used in a server-to-server implementation. Use the public API access token in nonserver environments.`);
    }
  }
  function validateRequiredAccessTokens(publicAccessToken, privateAccessToken) {
    if (!publicAccessToken && !privateAccessToken) {
      throw new Error(`${CLIENT2}: a public or private access token must be provided`);
    }
    if (publicAccessToken && privateAccessToken) {
      throw new Error(`${CLIENT2}: only provide either a public or private access token`);
    }
  }

  // node_modules/.pnpm/@shopify+storefront-api-client@1.0.9/node_modules/@shopify/storefront-api-client/dist/storefront-api-client.mjs
  function createStorefrontApiClient({ storeDomain, apiVersion, publicAccessToken, privateAccessToken, clientName, retries = 0, customFetchApi, logger }) {
    const currentSupportedApiVersions = getCurrentSupportedApiVersions();
    const storeUrl = validateDomainAndGetStoreUrl({
      client: CLIENT2,
      storeDomain
    });
    const baseApiVersionValidationParams = {
      client: CLIENT2,
      currentSupportedApiVersions,
      logger
    };
    validateApiVersion({ ...baseApiVersionValidationParams, apiVersion });
    validateRequiredAccessTokens(publicAccessToken, privateAccessToken);
    validatePrivateAccessTokenUsage(privateAccessToken);
    const apiUrlFormatter = generateApiUrlFormatter(storeUrl, apiVersion, baseApiVersionValidationParams);
    const config = {
      storeDomain: storeUrl,
      apiVersion,
      ...publicAccessToken ? { publicAccessToken } : {
        privateAccessToken
      },
      headers: {
        "Content-Type": DEFAULT_CONTENT_TYPE,
        Accept: DEFAULT_CONTENT_TYPE,
        [SDK_VARIANT_HEADER2]: DEFAULT_SDK_VARIANT2,
        [SDK_VERSION_HEADER2]: DEFAULT_CLIENT_VERSION2,
        ...clientName ? { [SDK_VARIANT_SOURCE_HEADER]: clientName } : {},
        ...publicAccessToken ? { [PUBLIC_ACCESS_TOKEN_HEADER]: publicAccessToken } : { [PRIVATE_ACCESS_TOKEN_HEADER]: privateAccessToken }
      },
      apiUrl: apiUrlFormatter(),
      clientName
    };
    const graphqlClient = createGraphQLClient({
      headers: config.headers,
      url: config.apiUrl,
      retries,
      customFetchApi,
      logger
    });
    const getHeaders = generateGetHeaders(config);
    const getApiUrl = generateGetApiUrl(config, apiUrlFormatter);
    const getGQLClientParams = generateGetGQLClientParams({
      getHeaders,
      getApiUrl
    });
    const client2 = {
      config,
      getHeaders,
      getApiUrl,
      fetch: (...props) => {
        return graphqlClient.fetch(...getGQLClientParams(...props));
      },
      request: (...props) => {
        return graphqlClient.request(...getGQLClientParams(...props));
      },
      requestStream: (...props) => {
        return graphqlClient.requestStream(...getGQLClientParams(...props));
      }
    };
    return Object.freeze(client2);
  }
  function generateApiUrlFormatter(storeUrl, defaultApiVersion, baseApiVersionValidationParams) {
    return (apiVersion) => {
      if (apiVersion) {
        validateApiVersion({
          ...baseApiVersionValidationParams,
          apiVersion
        });
      }
      const urlApiVersion = (apiVersion ?? defaultApiVersion).trim();
      return `${storeUrl}/api/${urlApiVersion}/graphql.json`;
    };
  }
  function generateGetApiUrl(config, apiUrlFormatter) {
    return (propApiVersion) => {
      return propApiVersion ? apiUrlFormatter(propApiVersion) : config.apiUrl;
    };
  }

  // src/utils/shopify.ts
  function formatProductId(id) {
    if (!id) {
      throw new Error("Invalid product ID");
    }
    if (id.startsWith("gid://")) {
      return id;
    }
    return `gid://shopify/Product/${id}`;
  }
  function formatVariantId(id) {
    if (!id) {
      throw new Error("Invalid variant ID");
    }
    if (id.startsWith("gid://")) {
      return id;
    }
    return `gid://shopify/ProductVariant/${id}`;
  }
  var DOMAIN = "shop.lostlevelsarcade.com";
  var TOKEN = "51611eac4adbd8d8496b9a639e0c3ef2";
  var API_VER = "2026-10";
  var client = createStorefrontApiClient({
    storeDomain: DOMAIN,
    apiVersion: API_VER,
    publicAccessToken: TOKEN
  });
  async function getEventByID(id) {
    try {
      const formattedId = formatProductId(id);
      const { data, errors } = await client.request(
        `
      query EventByID($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          description
          gameType:  metafield(namespace:"custom", key:"game_type") { value }
          startTime: metafield(namespace:"custom", key:"start_time") { value }
          duration:  metafield(namespace:"custom", key:"duration") { value }
          format:    metafield(namespace:"custom", key:"format") { value }
          totalCap:  metafield(namespace:"custom", key:"total_cap") { value }
          complementaryProducts: metafield(namespace:"shopify--discovery--product_recommendation", key:"complementary_products") {
            references(first: 20) {
              edges { node { ... on Product { 
                id 
                title
                variants(first: 4) {
                  edges { node {
                    id 
                    title 
                    quantityAvailable
                    price { amount currencyCode }
                  }}
                }
              }}}
            }
          }
          variants(first: 50) {
            edges { node {
              id
              title
              quantityAvailable
              price { amount currencyCode }
              selectedOptions { name value }
            } }
          }
        }
      }
      `,
        { variables: { id: formattedId } }
      );
      if (errors) {
        throw new Error(errors.graphQLErrors?.[0]?.message || errors.message);
      }
      return data.product;
    } catch (error) {
      console.error(`Error fetching event product with ID ${id}:`, error);
      return null;
    }
  }
  async function getEventByHandle(handle) {
    try {
      const { data, errors } = await client.request(
        `
      query EventByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          gameType:  metafield(namespace:"custom", key:"game_type") { value }
          startTime: metafield(namespace:"custom", key:"start_time") { value }
          duration:  metafield(namespace:"custom", key:"duration") { value }
          format:    metafield(namespace:"custom", key:"format") { value }
          totalCap:  metafield(namespace:"custom", key:"total_cap") { value }
          complementaryProducts: metafield(namespace:"shopify--discovery--product_recommendation", key:"complementary_products") {
            references(first: 20) {
              edges { node { ... on Product { 
                id 
                title
                variants(first: 4) {
                  edges { node {
                    id 
                    title 
                    quantityAvailable
                    price { amount currencyCode }
                  }}
                }
              }}}
            }
          }
          variants(first: 50) {
            edges { node {
              id
              title
              quantityAvailable
              price { amount currencyCode }
              selectedOptions { name value }
            } }
          }
        }
      }
      `,
        { variables: { handle } }
      );
      if (errors) {
        throw new Error(errors.graphQLErrors?.[0]?.message || errors.message);
      }
      return data.productByHandle;
    } catch (error) {
      console.error(`Error fetching event product with handle ${handle}:`, error);
      return null;
    }
  }
  async function createCartWithLines(lines) {
    try {
      const formatted = lines.map((l) => ({
        merchandiseId: formatVariantId(l.merchandiseId),
        quantity: l.quantity,
        attributes: l.attributes || []
      }));
      const { data, errors } = await client.request(
        `
      mutation cartCreate($input: CartInput) {
        cartCreate(input: $input) {
          cart { id checkoutUrl }
          userErrors { field message }
        }
      }
      `,
        { variables: { input: { lines: formatted } } }
      );
      if (errors) {
        throw new Error(errors.graphQLErrors?.[0]?.message || errors.message);
      }
      const userErrors = data?.cartCreate?.userErrors;
      if (userErrors?.length) {
        throw new Error(userErrors[0]?.message || "Cart create failed");
      }
      return data?.cartCreate?.cart;
    } catch (error) {
      console.error("Error creating cart with lines:", error);
      throw error;
    }
  }

  // src/events/cart/cartDisplay.ts
  init_live_reload();
  var CartDisplay = class {
    cartEl;
    cartManager;
    constructor(cartManager, cartElement) {
      this.cartManager = cartManager;
      this.cartEl = cartElement;
      this.hideCartItemTemplate();
    }
    update(currency = "USD") {
      if (!this.cartEl) {
        console.error("Cart element not found");
        return;
      }
      const cartItemsContainer = this.cartEl.querySelector('[data-field="cart-items"]');
      const subtotalEl = this.cartEl.querySelector('[data-field="cart-subtotal"]');
      const cartItemTemplate = document.querySelector('[data-field="cart-line-item"]');
      if (!cartItemsContainer || !subtotalEl || !cartItemTemplate) {
        console.error("Required cart elements not found");
        return;
      }
      console.info("Updating cart display");
      this.hideTemplate(cartItemTemplate);
      cartItemsContainer.innerHTML = "";
      const items = this.cartManager.getItems();
      const subtotal = this.cartManager.getSubtotal();
      items.forEach((item) => {
        const itemEl = this.createCartItemElement(cartItemTemplate, item, currency);
        cartItemsContainer.appendChild(itemEl);
      });
      subtotalEl.textContent = moneyFormatter(subtotal, currency);
    }
    hideTemplate(template) {
      template.classList.add("hide");
    }
    hideCartItemTemplate() {
      const cartItemTemplate = document.querySelector('[data-field="cart-line-item"]');
      if (cartItemTemplate) {
        cartItemTemplate.classList.add("hide");
      }
    }
    createCartItemElement(template, item, currency) {
      const itemEl = template.cloneNode(true);
      itemEl.classList.remove("hide");
      const titleEl = itemEl.querySelector('[data-field="cart-line-title"]');
      if (titleEl) {
        const displayTitle = item.quantity && item.quantity > 1 ? `${item.title} (${item.quantity}x)` : item.title;
        titleEl.textContent = displayTitle;
      }
      const variantEl = itemEl.querySelector('[data-field="cart-line-variant"]');
      if (variantEl) variantEl.textContent = item.variant;
      const priceEl = itemEl.querySelector('[data-field="cart-line-price"]');
      if (priceEl) priceEl.textContent = moneyFormatter(item.price, currency);
      const removeBtn = itemEl.querySelector('[data-role="cart-line-clear"]');
      if (item.id !== "event" && removeBtn) {
        removeBtn.classList.remove("hide");
        removeBtn.addEventListener("click", () => this.cartManager.removeItem(item.id));
      } else if (removeBtn) {
        removeBtn.classList.add("hide");
      }
      return itemEl;
    }
  };

  // src/events/cart/cartManager.ts
  init_live_reload();
  var CartManager = class {
    items = [];
    onUpdateCallback;
    constructor(onUpdate) {
      this.onUpdateCallback = onUpdate;
    }
    getItems() {
      return [...this.items];
    }
    getSubtotal() {
      return this.items.reduce((sum, item) => sum + item.price, 0);
    }
    updateEventItem(id, title, variant, price) {
      this.items = this.items.filter((item) => item.id !== "event");
      this.items.push({ id: "event", title, variant, price });
      this.triggerUpdate();
    }
    addUpsellItem(item) {
      const existingIndex = this.items.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        const existing = this.items[existingIndex];
        this.items[existingIndex] = {
          ...existing,
          quantity: (existing.quantity || 1) + (item.quantity || 1),
          price: item.price * ((existing.quantity || 1) + (item.quantity || 1))
        };
      } else {
        this.items.push(item);
      }
      this.triggerUpdate();
      return true;
    }
    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
      this.triggerUpdate();
    }
    triggerUpdate() {
      this.onUpdateCallback?.();
    }
  };

  // src/events/form/formManager.ts
  init_live_reload();
  var FormManager = class {
    constructor(product) {
      this.product = product;
      this.setupListeners();
      this.updateFieldVisibility();
    }
    state = {
      requirePlayerName: false,
      // Initialize all game-specific fields to false
      requireMtgAccount: false,
      requireTcgAccount: false,
      requireTcgUsername: false,
      requireRphAccount: false,
      requireRphUsername: false,
      requireRiftAccount: false,
      requireRiftUsername: false,
      requirePokemonAccount: false,
      requirePokemonId: false
    };
    getState() {
      return { ...this.state };
    }
    setupListeners() {
      this.setupAccountRadioListeners("mtg-account", "mtg-username");
      this.setupAccountRadioListeners("tcg-account", "tcg-username");
      this.setupAccountRadioListeners("rph-account", "rph-username");
      this.setupAccountRadioListeners("rift-account", "rift-username");
      this.setupAccountRadioListeners("pokemon-account", "pokemon-id");
    }
    setupAccountRadioListeners(accountRadioName, fieldsetToToggle) {
      const trueRadio = document.querySelector(
        `input[name="${accountRadioName}"][id="${accountRadioName}-true"]`
      );
      const falseRadio = document.querySelector(
        `input[name="${accountRadioName}"][id="${accountRadioName}-false"]`
      );
      const fieldset = document.querySelector(`[data-role="${fieldsetToToggle}"]`);
      if (trueRadio && falseRadio && fieldset) {
        const updateFieldVisibility = () => {
          const showField = trueRadio.checked;
          fieldset.classList.toggle("hide", !showField);
          const inputs = fieldset.querySelectorAll("input");
          inputs.forEach((input) => {
            input.required = showField;
          });
        };
        trueRadio.addEventListener("change", updateFieldVisibility);
        falseRadio.addEventListener("change", updateFieldVisibility);
        updateFieldVisibility();
      }
    }
    updateFieldVisibility() {
      this.updateGameSpecificFields();
      this.recheckAllAccountRadios();
    }
    recheckAllAccountRadios() {
      const accountTypes = [
        { radio: "mtg-account", field: "mtg-username" },
        { radio: "tcg-account", field: "tcg-username" },
        { radio: "rph-account", field: "rph-username" },
        { radio: "rift-account", field: "rift-username" },
        { radio: "pokemon-account", field: "pokemon-id" }
      ];
      accountTypes.forEach(({ radio, field }) => {
        if (this.state[`require${this.capitalizeFirst(radio.replace("-", ""))}`]) {
          const trueRadio = document.querySelector(
            `input[name="${radio}"][id="${radio}-true"]`
          );
          if (trueRadio?.checked) {
            const fieldset = document.querySelector(`[data-role="${field}"]`);
            if (fieldset) {
              fieldset.classList.remove("hide");
              const inputs = fieldset.querySelectorAll("input");
              inputs.forEach((input) => {
                input.required = true;
              });
            }
          }
        }
      });
    }
    // Helper method to capitalize first letter
    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    updateGameSpecificFields() {
      const gameType = (this.product.gameType?.value || "").toLowerCase();
      this.hideAllGameFields();
      this.state.requireMtgAccount = false;
      this.state.requireTcgAccount = false;
      this.state.requireTcgUsername = false;
      this.state.requireRphAccount = false;
      this.state.requireRphUsername = false;
      this.state.requireRiftAccount = false;
      this.state.requireRiftUsername = false;
      this.state.requirePokemonAccount = false;
      this.state.requirePokemonId = false;
      if (gameType === "magic") {
        this.showMtgFields();
      } else if (gameType === "gundam" || gameType === "one piece") {
        this.showTcgFields();
      } else if (gameType === "lorcana") {
        this.showRphFields();
      } else if (gameType === "riftbound") {
        this.showRiftFields();
      } else if (gameType === "pokemon") {
        this.showPokemonFields();
      } else {
        console.info(`Game type '${gameType}' doesn't require specific account fields`);
      }
    }
    hideAllGameFields() {
      const fieldSets = [
        "mtg-account",
        "tcg-account",
        "tcg-username",
        "rph-account",
        "rph-username",
        "rift-account",
        "rift-username",
        "pokemon-account",
        "pokemon-id"
      ];
      fieldSets.forEach((fieldSet) => {
        const section = document.querySelector(`[data-role="${fieldSet}"]`);
        if (section) {
          section.classList.add("hide");
          const inputs = section.querySelectorAll(
            "input, select"
          );
          inputs.forEach((input) => {
            input.required = false;
          });
        }
      });
    }
    showMtgFields() {
      const mtgAccountSection = document.querySelector('[data-role="mtg-account"]');
      if (mtgAccountSection) {
        mtgAccountSection.classList.remove("hide");
        this.state.requireMtgAccount = true;
      }
    }
    showTcgFields() {
      const tcgAccountSection = document.querySelector('[data-role="tcg-account"]');
      if (tcgAccountSection) {
        tcgAccountSection.classList.remove("hide");
        this.state.requireTcgAccount = true;
        this.state.requireTcgUsername = true;
        const trueRadio = document.querySelector(
          'input[name="tcg-account"][id="tcg-account-true"]'
        );
        if (trueRadio?.checked) {
          const usernameSection = document.querySelector('[data-role="tcg-username"]');
          if (usernameSection) {
            usernameSection.classList.remove("hide");
            const inputs = usernameSection.querySelectorAll("input");
            inputs.forEach((input) => {
              input.required = true;
            });
          }
        }
      }
    }
    showRphFields() {
      const rphAccountSection = document.querySelector('[data-role="rph-account"]');
      if (rphAccountSection) {
        rphAccountSection.classList.remove("hide");
        this.state.requireRphAccount = true;
        this.state.requireRphUsername = true;
        const trueRadio = document.querySelector(
          'input[name="rph-account"][id="rph-account-true"]'
        );
        if (trueRadio?.checked) {
          const usernameSection = document.querySelector('[data-role="rph-username"]');
          if (usernameSection) {
            usernameSection.classList.remove("hide");
            const inputs = usernameSection.querySelectorAll("input");
            inputs.forEach((input) => {
              input.required = true;
            });
          }
        }
      }
    }
    showRiftFields() {
      const riftAccountSection = document.querySelector('[data-role="rift-account"]');
      this.state.requireRiftAccount = true;
      this.state.requireRiftUsername = true;
      if (riftAccountSection) {
        riftAccountSection.classList.remove("hide");
        const trueRadio = document.querySelector(
          'input[name="rift-account"][id="rift-account-true"]'
        );
        if (trueRadio?.checked) {
          const usernameSection = document.querySelector('[data-role="rift-username"]');
          if (usernameSection) {
            usernameSection.classList.remove("hide");
            const inputs = usernameSection.querySelectorAll("input");
            inputs.forEach((input) => {
              input.required = true;
            });
          }
        }
      }
    }
    showPokemonFields() {
      const pokemonAccountSection = document.querySelector(
        '[data-role="pokemon-account"]'
      );
      if (pokemonAccountSection) {
        pokemonAccountSection.classList.remove("hide");
        this.state.requirePokemonAccount = true;
        this.state.requirePokemonId = true;
        const trueRadio = document.querySelector(
          'input[name="pokemon-account"][id="pokemon-account-true"]'
        );
        if (trueRadio?.checked) {
          const idSection = document.querySelector('[data-role="pokemon-id"]');
          if (idSection) {
            idSection.classList.remove("hide");
            const inputs = idSection.querySelectorAll("input");
            inputs.forEach((input) => {
              input.required = true;
            });
          }
        }
      }
    }
    validate() {
      const firstName = this.getFormValue("field-first-name");
      const lastName = this.getFormValue("field-last-name");
      if (!firstName) {
        const error = "Please enter the player's first name.";
        this.showError(error);
        return { valid: false, error };
      }
      if (!lastName) {
        const error = "Please enter the player's last name.";
        this.showError(error);
        return { valid: false, error };
      }
      const phone = this.getFormValue("field-phone");
      if (!phone) {
        const error = "Please enter the player's phone number.";
        this.showError(error);
        return { valid: false, error };
      }
      const bday = this.getFormValue("field-bday");
      if (!bday) {
        const error = "Please enter the player's date of birth.";
        this.showError(error);
        return { valid: false, error };
      }
      const bdayDate = new Date(bday);
      const today = /* @__PURE__ */ new Date();
      if (bdayDate >= today) {
        const error = "Date of birth must be in the past.";
        this.showError(error);
        return { valid: false, error };
      }
      const minAge = 12;
      const minBirthDate = /* @__PURE__ */ new Date();
      minBirthDate.setFullYear(today.getFullYear() - minAge);
      if (bdayDate > minBirthDate) {
        const error = `Player must be at least ${minAge} years old.`;
        this.showError(error);
        return { valid: false, error };
      }
      if (this.state.requireMtgAccount) {
        const hasMtgAccount = document.querySelector(
          'input[name="mtg-account"]:checked'
        );
        if (!hasMtgAccount) {
          const error = "Please indicate if you have the MTG Companion App.";
          this.showError(error);
          return { valid: false, error };
        }
        if (hasMtgAccount.id === "mtg-account-false") {
          const error = "You need the MTG Companion App to participate in this event.";
          this.showError(error);
          return { valid: false, error };
        }
      }
      if (this.state.requireTcgAccount) {
        const hasTcgAccount = document.querySelector(
          'input[name="tcg-account"]:checked'
        );
        if (!hasTcgAccount) {
          const error = "Please indicate if you have a TCG Plus account.";
          this.showError(error);
          return { valid: false, error };
        }
        if (hasTcgAccount.id === "tcg-account-false") {
          const error = "You need a TCG Plus account to participate in this event.";
          this.showError(error);
          return { valid: false, error };
        }
      }
      if (this.state.requireTcgUsername) {
        const tcgUsername = this.getFormValue("field-tcg-username");
        if (!tcgUsername) {
          const error = "Please enter your TCG Plus username.";
          this.showError(error);
          return { valid: false, error };
        }
      }
      if (this.state.requireRphAccount) {
        const hasRphAccount = document.querySelector(
          'input[name="rph-account"]:checked'
        );
        if (!hasRphAccount) {
          const error = "Please indicate if you have a Ravensburger Play Hub account.";
          this.showError(error);
          return { valid: false, error };
        }
        if (hasRphAccount.id === "rph-account-false") {
          const error = "You need a Ravensburger Play Hub account to participate in this event.";
          this.showError(error);
          return { valid: false, error };
        }
      }
      if (this.state.requireRphUsername) {
        const rphUsername = this.getFormValue("field-rph-username");
        if (!rphUsername) {
          const error = "Please enter your Ravensburger Play Hub username.";
          this.showError(error);
          return { valid: false, error };
        }
      }
      if (this.state.requireRiftAccount) {
        const hasRiftAccount = document.querySelector(
          'input[name="rift-account"]:checked'
        );
        if (!hasRiftAccount) {
          const error = "Please indicate if you have a Riftbound account.";
          this.showError(error);
          return { valid: false, error };
        }
        if (hasRiftAccount.id === "rift-account-false") {
          const error = "You need a Riftbound account to participate in this event.";
          this.showError(error);
          return { valid: false, error };
        }
      }
      if (this.state.requireRiftUsername) {
        const riftUsername = this.getFormValue("field-rift-username");
        if (!riftUsername) {
          const error = "Please enter your Riftbound username.";
          this.showError(error);
          return { valid: false, error };
        }
      }
      if (this.state.requirePokemonAccount) {
        const hasPokemonAccount = document.querySelector(
          'input[name="pokemon-account"]:checked'
        );
        if (!hasPokemonAccount) {
          const error = "Please indicate if you have a Pok\xE9mon ID.";
          this.showError(error);
          return { valid: false, error };
        }
        if (hasPokemonAccount.id === "pokemon-account-false") {
          const error = "You need a Pok\xE9mon ID to participate in this event.";
          this.showError(error);
          return { valid: false, error };
        }
      }
      if (this.state.requirePokemonId) {
        const pokemonId = this.getFormValue("field-pokemon-id");
        if (!pokemonId) {
          const error = "Please enter your Pok\xE9mon ID.";
          this.showError(error);
          return { valid: false, error };
        }
      }
      return { valid: true };
    }
    showError(message) {
      showError(message);
    }
    getFormValue(selector) {
      return (document.querySelector(`[data-role="${selector}"]`)?.value || "").trim();
    }
  };

  // src/events/form/formSubmission.ts
  init_live_reload();
  var FormSubmission = class {
    constructor(product, cartManager, formManager, getChosenVariantId) {
      this.product = product;
      this.cartManager = cartManager;
      this.formManager = formManager;
      this.getChosenVariantId = getChosenVariantId;
      this.form = document.querySelector('[data-role="event-form"]');
      this.submitBtn = document.querySelector('[data-role="submit"]');
      this.errBox = document.querySelector('[data-role="error"]');
      this.setupButtonStateManagement();
    }
    form;
    submitBtn;
    errBox;
    setupFormHandler() {
      if (!this.form) {
        console.error("Form not found");
        return;
      }
      this.form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleFormSubmission();
      });
    }
    async handleFormSubmission() {
      this.clearErrors();
      const validation = this.validateForm();
      if (!validation.valid) {
        showError(validation.error || "Validation error");
        return;
      }
      this.disableSubmitButton();
      try {
        const cart = await this.createEventCart();
        const url = cart?.checkoutUrl;
        if (!url) throw new Error("Could not create checkout.");
        window.location.href = url;
      } catch (err) {
        console.error("[events] checkout error", err);
        showError("Something went wrong. Please try again.");
        this.enableSubmitButton();
      }
    }
    validateForm() {
      const chosenVariantId = this.getChosenVariantId();
      if (!chosenVariantId) {
        const error = "This event is sold out.";
        showError(error);
        return { valid: false, error };
      }
      return this.formManager.validate();
    }
    // In the createEventCart method:
    async createEventCart() {
      const formState = this.formManager.getState();
      const firstName = this.getFormValue("field-first-name");
      const lastName = this.getFormValue("field-last-name");
      const playerName = `${firstName} ${lastName}`.trim();
      const phone = this.getFormValue("field-phone");
      const bday = this.getFormValue("field-bday");
      const mtgAccountStatus = formState.requireMtgAccount ? this.getRadioValue("mtg-account") : "";
      const tcgAccountStatus = formState.requireTcgAccount ? this.getRadioValue("tcg-account") : "";
      const tcgUsername = formState.requireTcgUsername ? this.getFormValue("field-tcg-username") : "";
      const rphAccountStatus = formState.requireRphAccount ? this.getRadioValue("rph-account") : "";
      const rphUsername = formState.requireRphUsername ? this.getFormValue("field-rph-username") : "";
      const riftAccountStatus = formState.requireRiftAccount ? this.getRadioValue("rift-account") : "";
      const riftUsername = formState.requireRiftUsername ? this.getFormValue("field-rift-username") : "";
      const pokemonAccountStatus = formState.requirePokemonAccount ? this.getRadioValue("pokemon-id") : "";
      const pokemonId = formState.requirePokemonId ? this.getFormValue("field-pokemon-id") : "";
      const lines = [
        {
          merchandiseId: this.getChosenVariantId(),
          quantity: 1,
          attributes: [
            { key: "Game", value: this.product.gameType?.value || "" },
            { key: "Format", value: this.product.format?.value || "" },
            { key: "Player Name", value: playerName },
            { key: "Phone Number", value: phone },
            { key: "Date of Birth", value: bday }
          ]
        }
      ];
      if (mtgAccountStatus) {
        lines[0].attributes.push({ key: "MTG Companion App", value: mtgAccountStatus });
      }
      if (tcgAccountStatus) {
        lines[0].attributes.push({ key: "TCG Plus Account", value: tcgAccountStatus });
      }
      if (tcgUsername) {
        lines[0].attributes.push({ key: "TCG Plus Username", value: tcgUsername });
      }
      if (rphAccountStatus) {
        lines[0].attributes.push({ key: "Ravensburger Play Hub Account", value: rphAccountStatus });
      }
      if (rphUsername) {
        lines[0].attributes.push({ key: "Ravensburger Play Hub Username", value: rphUsername });
      }
      if (riftAccountStatus) {
        lines[0].attributes.push({ key: "Riftbound Account", value: riftAccountStatus });
      }
      if (riftUsername) {
        lines[0].attributes.push({ key: "Riftbound Username", value: riftUsername });
      }
      if (pokemonAccountStatus) {
        lines[0].attributes.push({ key: "Pok\xE9mon ID Account", value: pokemonAccountStatus });
      }
      if (pokemonId) {
        lines[0].attributes.push({ key: "Pok\xE9mon ID", value: pokemonId });
      }
      const cartItems = this.cartManager.getItems();
      cartItems.forEach((item) => {
        if (item.id !== "event" && item.variantId) {
          lines.push({
            merchandiseId: item.variantId,
            quantity: item.quantity || 1,
            attributes: []
          });
        }
      });
      return createCartWithLines(lines);
    }
    setupButtonStateManagement() {
      this.enableSubmitButton();
      if (this.form) {
        this.form.addEventListener("input", () => this.enableSubmitButton());
        this.form.addEventListener("change", () => this.enableSubmitButton());
      }
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          this.enableSubmitButton();
        }
      });
      window.addEventListener("focus", () => this.enableSubmitButton());
    }
    enableSubmitButton() {
      if (this.submitBtn && this.submitBtn.disabled) {
        this.submitBtn.disabled = false;
      }
    }
    disableSubmitButton() {
      if (this.submitBtn) {
        this.submitBtn.disabled = true;
      }
    }
    clearErrors() {
      if (this.errBox) {
        this.errBox.textContent = "";
        this.errBox.classList.add("hide");
      }
    }
    getFormValue(selector) {
      return (document.querySelector(`[data-role="${selector}"]`)?.value || "").trim();
    }
    getRadioValue(name) {
      const trueRadio = document.querySelector(
        `input[name="${name}"][id="${name}-true"]`
      );
      const falseRadio = document.querySelector(
        `input[name="${name}"][id="${name}-false"]`
      );
      if (trueRadio?.checked) return "Yes";
      if (falseRadio?.checked) return "No";
      return "";
    }
  };

  // src/events/tickets/ticketManager.ts
  init_live_reload();

  // src/utils/debounce.ts
  init_live_reload();
  var debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // src/events/tickets/ticketManager.ts
  var TicketManager = class {
    constructor(product, cartManager) {
      this.product = product;
      this.cartManager = cartManager;
      this.variants = (product.variants?.edges || []).map((e) => e.node);
      this.currency = this.variants[0]?.price?.currencyCode || "USD";
      this.totalCap = product.totalCap?.value ? Number(product.totalCap.value) : null;
    }
    variants = [];
    chosenVariantId = null;
    hasSelectedVariant = false;
    currency;
    totalCap = null;
    async render() {
      const ticketTemplate = document.querySelector('[data-role="ticket"]');
      const ticketsContainer = ticketTemplate?.parentElement || null;
      if (!ticketsContainer || !ticketTemplate) {
        console.error("Ticket template or container not found");
        this.chosenVariantId = this.variants[0]?.id || null;
        return;
      }
      ticketTemplate.classList.add("hide");
      ticketsContainer.innerHTML = "";
      const sortedVariants = [...this.variants].sort((a, b) => {
        const priceA = Number(a.price?.amount || "0");
        const priceB = Number(b.price?.amount || "0");
        return priceA - priceB;
      });
      sortedVariants.forEach((variant) => {
        this.createTicketElement(variant, ticketTemplate, ticketsContainer);
      });
    }
    getChosenVariantId() {
      return this.chosenVariantId;
    }
    createTicketElement(variant, template, container) {
      const variantTitle = this.getVariantTitle(variant);
      if (variantTitle === "Default Title" && this.variants.length > 1) {
        return;
      }
      const finalTitle = variantTitle === "Default Title" ? "Single Entry" : variantTitle;
      const qty = variant.quantityAvailable || 0;
      const price = Number(variant.price?.amount || "0");
      const ticketEl = template.cloneNode(true);
      ticketEl.classList.remove("hide");
      this.setTicketData(ticketEl, finalTitle, qty, price);
      if (qty <= 0) {
        this.setupSoldOutTicket(ticketEl);
      } else {
        this.setupAvailableTicket(ticketEl, variant, finalTitle);
      }
      container.appendChild(ticketEl);
    }
    getVariantTitle(variant) {
      let variantTitle = variant.title;
      if (variant.selectedOptions && variant.selectedOptions.length > 0) {
        const meaningfulOption = variant.selectedOptions.find(
          (opt) => opt.name.toLowerCase() !== "title" && opt.value !== "Default Title"
        );
        if (meaningfulOption) {
          variantTitle = meaningfulOption.value;
        } else {
          const titleOption = variant.selectedOptions.find(
            (opt) => opt.name.toLowerCase() === "title" && opt.value !== "Default Title"
          );
          if (titleOption) {
            variantTitle = titleOption.value;
          }
        }
      }
      return variantTitle;
    }
    setTicketData(ticketEl, title, qty, price) {
      const titleEl = ticketEl.querySelector('[data-field="variant-title"]');
      const seatsEl = ticketEl.querySelector('[data-field="seats"]');
      const priceEl = ticketEl.querySelector('[data-field="price"]');
      if (titleEl) titleEl.textContent = title;
      if (seatsEl)
        seatsEl.textContent = qty > 0 ? `${qty} ${this.totalCap && this.totalCap > 0 ? `/ ${this.totalCap} Open` : "Open"}` : "Sold out";
      if (priceEl) priceEl.textContent = price === 0 ? "Free" : moneyFormatter(price, this.currency);
    }
    setupSoldOutTicket(ticketEl) {
      ticketEl.classList.add("sold-out");
      ticketEl.setAttribute("tabindex", "-1");
      ticketEl.setAttribute("aria-disabled", "true");
    }
    setupAvailableTicket(ticketEl, variant, title) {
      ticketEl.dataset.variantId = variant.id;
      ticketEl.setAttribute("aria-pressed", "false");
      const debouncedCartUpdate = debounce(() => {
        this.updateEventInCart(variant, title);
      }, 150);
      this.addTicketEventListeners(ticketEl, variant, title, debouncedCartUpdate);
      if (!this.hasSelectedVariant) {
        this.chosenVariantId = variant.id;
        this.setActiveTicket(ticketEl);
        this.updateEventInCart(variant, title);
        this.hasSelectedVariant = true;
      }
    }
    addTicketEventListeners(ticketEl, variant, title, debouncedUpdate) {
      const qty = variant.quantityAvailable || 0;
      ticketEl.addEventListener("click", () => {
        if (qty <= 0) return;
        this.chosenVariantId = variant.id;
        this.setActiveTicket(ticketEl);
        debouncedUpdate();
      });
      ticketEl.addEventListener("keydown", (e) => {
        if (qty <= 0) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.chosenVariantId = variant.id;
          this.setActiveTicket(ticketEl);
          debouncedUpdate();
        }
      });
    }
    setActiveTicket(activeTicketEl) {
      document.querySelectorAll('[data-role="ticket"]').forEach((ticket) => {
        ticket.querySelector('[data-field="checkbox"]')?.classList.remove("is-active");
        ticket.setAttribute("aria-pressed", "false");
      });
      activeTicketEl.querySelector('[data-field="checkbox"]')?.classList.add("is-active");
      activeTicketEl.setAttribute("aria-pressed", "true");
    }
    updateEventInCart(variant, title) {
      const price = Number(variant.price?.amount || "0");
      this.cartManager.updateEventItem("event", this.product.title, title, price);
    }
    // private createFallbackTicket(template: HTMLElement, container: HTMLElement): void {
    //   console.info('Creating fallback ticket');
    //   const firstVariant = this.variants[0];
    //   // Use the same title logic as createTicketElement
    //   const variantTitle = this.getVariantTitle(firstVariant);
    //   const finalTitle = variantTitle === 'Default Title' ? 'Single Entry' : variantTitle;
    //   this.chosenVariantId = firstVariant.id;
    //   template.classList.add('hide');
    //   const ticketEl = template.cloneNode(true) as HTMLElement;
    //   ticketEl.classList.remove('hide');
    //   ticketEl.classList.add('sold-out');
    //   const titleEl = ticketEl.querySelector('[data-field="variant-title"]');
    //   const seatsEl = ticketEl.querySelector('[data-field="seats"]');
    //   const priceEl = ticketEl.querySelector('[data-field="price"]');
    //   // Use the processed title instead of firstVariant.title
    //   if (titleEl) titleEl.textContent = finalTitle;
    //   if (seatsEl) seatsEl.textContent = 'Sold out';
    //   const price = Number(firstVariant.price?.amount || '0');
    //   if (priceEl) priceEl.textContent = price === 0 ? 'Free' : moneyFormatter(price, this.currency);
    //   container.appendChild(ticketEl);
    // }
  };

  // src/events/upsells/upsellManager.ts
  init_live_reload();
  var UpsellManager = class {
    constructor(product, cartManager) {
      this.product = product;
      this.cartManager = cartManager;
      this.extractUpsells();
    }
    upsellProducts = [];
    async render() {
      const upsellTemplate = document.querySelector('[data-role="upsell"]');
      const upsellContainer = upsellTemplate?.parentElement;
      if (!this.upsellProducts.length || !upsellContainer || !upsellTemplate) {
        if (upsellContainer?.parentElement) {
          upsellContainer.parentElement.classList.add("hide");
        }
        return;
      }
      upsellTemplate.classList.add("hide");
      upsellContainer.innerHTML = "";
      this.upsellProducts.forEach((upsellProduct) => {
        this.createUpsellElement(upsellProduct, upsellTemplate, upsellContainer);
      });
    }
    extractUpsells() {
      this.upsellProducts = (this.product.complementaryProducts?.references?.edges || []).map((e) => e.node).filter((product) => !!product?.id).map((product) => ({
        id: product?.id,
        title: product?.title || "Add-on",
        variants: (product?.variants?.edges || []).map((variantEdge) => variantEdge.node).filter((variant) => !!variant?.id).map((variant) => ({
          id: variant?.id,
          title: variant?.title ?? "Untitled Variant",
          price: variant?.price,
          quantityAvailable: variant?.quantityAvailable || 0,
          selectedOptions: variant?.selectedOptions || []
        }))
      })).filter((product) => product.variants.length > 0);
    }
    createUpsellElement(upsellProduct, template, container) {
      const upsellEl = template.cloneNode(true);
      upsellEl.classList.remove("hide");
      this.setProductTitle(upsellEl, upsellProduct.title);
      const defaultVariant = this.findDefaultVariant(upsellProduct.variants);
      let selectedVariant = defaultVariant;
      if (upsellProduct.variants.length > 1) {
        this.createVariantSelector(upsellEl, upsellProduct.variants, (variant) => {
          selectedVariant = variant;
          this.updateUpsellDisplay(upsellEl, variant);
          this.setupUpsellControls(upsellEl, upsellProduct.title, variant);
        });
      } else {
        this.hideVariantSelector(upsellEl);
      }
      if (selectedVariant) {
        this.updateUpsellDisplay(upsellEl, selectedVariant);
        this.setupUpsellControls(upsellEl, upsellProduct.title, selectedVariant);
      }
      container.appendChild(upsellEl);
    }
    setProductTitle(upsellEl, title) {
      setTextByAttr(upsellEl, "upsell-title", title);
    }
    findDefaultVariant(variants) {
      const availableVariants = variants.filter((v) => v.quantityAvailable > 0);
      const variantsToSort = availableVariants.length > 0 ? availableVariants : variants;
      return variantsToSort.sort((a, b) => {
        const priceA = Number(a.price?.amount || "0");
        const priceB = Number(b.price?.amount || "0");
        return priceA - priceB;
      })[0] || null;
    }
    createVariantSelector(upsellEl, variants, onVariantChange) {
      const variantsContainer = upsellEl.querySelector('[data-field="upsell-variants"]');
      const variantTemplate = upsellEl.querySelector('[data-field="upsell-variant-item"]');
      if (!variantsContainer || !variantTemplate) return;
      variantTemplate.classList.add("hide");
      variantsContainer.innerHTML = "";
      variants.forEach((variant, index) => {
        const variantEl = variantTemplate.cloneNode(true);
        variantEl.classList.remove("hide");
        const variantText = this.getVariantOptionText(variant);
        const textEl = variantEl.querySelector("div");
        if (textEl) textEl.textContent = variantText;
        variantEl.classList.add("variant-option");
        variantEl.setAttribute("role", "button");
        variantEl.setAttribute("tabindex", "0");
        if (index === 0) {
          variantEl.classList.add("selected");
          variantEl.setAttribute("aria-pressed", "true");
        } else {
          variantEl.setAttribute("aria-pressed", "false");
        }
        const selectVariant = () => {
          variantsContainer.querySelectorAll(".variant-option").forEach((option) => {
            option.classList.remove("selected");
            option.setAttribute("aria-pressed", "false");
          });
          variantEl.classList.add("selected");
          variantEl.setAttribute("aria-pressed", "true");
          onVariantChange(variant);
        };
        variantEl.addEventListener("click", selectVariant);
        variantEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectVariant();
          }
        });
        variantsContainer.appendChild(variantEl);
      });
    }
    getVariantOptionText(variant) {
      const meaningfulOptions = variant.selectedOptions?.filter(
        (option) => option.value !== "Default Title" && option.name.toLowerCase() !== "title"
      ) || [];
      if (meaningfulOptions.length > 0) {
        return meaningfulOptions.map((option) => option.value).join(" / ");
      }
      return variant.title === "Default Title" ? "Standard" : variant.title;
    }
    hideVariantSelector(upsellEl) {
      const variantsContainer = upsellEl.querySelector('[data-field="upsell-variants"]');
      if (variantsContainer) {
        variantsContainer.classList.add("hide");
      }
    }
    updateUpsellDisplay(upsellEl, variant) {
      const price = Number(variant.price?.amount || "0");
      const currency = variant.price?.currencyCode || "USD";
      const stock = variant.quantityAvailable;
      setTextByAttr(upsellEl, "upsell-price", moneyFormatter(price, currency));
      setTextByAttr(upsellEl, "upsell-stock-count", stock.toString());
      const stockEl = upsellEl.querySelector('[data-field="upsell-stock"]');
      if (stockEl) {
        if (stock > 0 && stock <= 5) {
          stockEl.classList.remove("hide");
        } else {
          stockEl.classList.add("hide");
        }
      }
      if (stock <= 0) {
        upsellEl.classList.add("sold-out");
      } else {
        upsellEl.classList.remove("sold-out");
      }
    }
    setupUpsellControls(upsellEl, productTitle, variant) {
      const price = Number(variant.price?.amount || "0");
      const stock = variant.quantityAvailable;
      const maxQuantity = Math.min(10, stock);
      const upsellId = `upsell_${variant.id.split("/").pop()}`;
      const variantText = this.getVariantOptionText(variant);
      const fullTitle = `${productTitle} - ${variantText}`;
      const addBtn = upsellEl.querySelector('[data-field="upsell-add"]');
      const qtyUpBtn = upsellEl.querySelector('[data-field="upsell-qty-up"]');
      const qtyDownBtn = upsellEl.querySelector(
        '[data-field="upsell-qty-down"]'
      );
      let currentQty = 1;
      setTextByAttr(upsellEl, "upsell-qty-count", currentQty.toString());
      if (addBtn) {
        const newAddBtn2 = addBtn.cloneNode(true);
        addBtn.parentNode?.replaceChild(newAddBtn2, addBtn);
      }
      if (qtyUpBtn) {
        const newQtyUpBtn2 = qtyUpBtn.cloneNode(true);
        qtyUpBtn.parentNode?.replaceChild(newQtyUpBtn2, qtyUpBtn);
      }
      if (qtyDownBtn) {
        const newQtyDownBtn2 = qtyDownBtn.cloneNode(true);
        qtyDownBtn.parentNode?.replaceChild(newQtyDownBtn2, qtyDownBtn);
      }
      const newAddBtn = upsellEl.querySelector('[data-field="upsell-add"]');
      const newQtyUpBtn = upsellEl.querySelector('[data-field="upsell-qty-up"]');
      const newQtyDownBtn = upsellEl.querySelector(
        '[data-field="upsell-qty-down"]'
      );
      if (stock <= 0) {
        this.disableUpsellControls(upsellEl);
        return;
      }
      newAddBtn?.classList.remove("disabled");
      const buttonText = newAddBtn?.querySelector(".button-text");
      if (buttonText) buttonText.textContent = "Add to Cart";
      newQtyUpBtn?.addEventListener("click", () => {
        if (currentQty < maxQuantity) {
          currentQty++;
          setTextByAttr(upsellEl, "upsell-qty-count", currentQty.toString());
        }
      });
      newQtyDownBtn?.addEventListener("click", () => {
        if (currentQty > 1) {
          currentQty--;
          setTextByAttr(upsellEl, "upsell-qty-count", currentQty.toString());
        }
      });
      const debouncedAddUpsell = debounce(() => {
        this.addUpsellToCart(upsellId, fullTitle, price, currentQty, variant);
      }, 300);
      newAddBtn?.addEventListener("click", () => {
        if (!newAddBtn.classList.contains("disabled")) {
          newAddBtn.classList.add("processing");
          debouncedAddUpsell();
          setTimeout(() => {
            newAddBtn.classList.remove("processing");
          }, 350);
        }
      });
    }
    disableUpsellControls(upsellEl) {
      const addBtn = upsellEl.querySelector('[data-field="upsell-add"]');
      const qtyWrap = upsellEl.querySelector('[data-field="upsell-qty-wrap"]');
      if (addBtn) {
        const buttonText = addBtn.querySelector(".button-text");
        if (buttonText) buttonText.textContent = "Out of Stock";
        addBtn.classList.add("disabled");
      }
      if (qtyWrap) qtyWrap.style.opacity = "0.5";
    }
    addUpsellToCart(upsellId, title, price, quantity, variant) {
      const currentItems = this.cartManager.getItems();
      const existingItem = currentItems.find((item) => item.id === upsellId);
      const currentCartQuantity = existingItem?.quantity || 0;
      const totalRequestedQuantity = currentCartQuantity + quantity;
      if (totalRequestedQuantity > variant.quantityAvailable) {
        const availableToAdd = variant.quantityAvailable - currentCartQuantity;
        if (availableToAdd <= 0) {
          showError(`${title}: This item is already at maximum quantity in your cart.`);
          return;
        }
        showError(
          `${title}: Only ${availableToAdd} more available. ${variant.quantityAvailable} total in stock.`
        );
        return;
      }
      const success = this.cartManager.addUpsellItem({
        id: upsellId,
        title,
        variant: "",
        price: price * quantity,
        quantity,
        variantId: variant.id
      });
      if (success) {
        console.log(`Added ${quantity}x ${title} to cart`);
      }
    }
  };

  // src/events/index.ts
  window.Webflow ||= [];
  window.Webflow.push(async () => {
    pageTransition();
    const accordions = Array.from(document.querySelectorAll('[ll-selector="accordion"]'));
    if (accordions.length > 0) {
      renderAccordions(accordions);
    } else {
      console.info("No accordion elements found.");
    }
    const metaEl = document.querySelector("#event-meta");
    const cmsHandle = metaEl?.getAttribute("data-handle") || void 0;
    const cmsID = metaEl?.getAttribute("data-id") || void 0;
    const urlHandle = location.pathname.split("/").filter(Boolean).pop();
    const handle = cmsHandle || urlHandle || "";
    let product = await getEventByHandle(handle);
    if (handle) {
      console.info("[events] Fetching by handle:", handle);
      product = await getEventByHandle(handle);
    }
    if (!product && cmsID) {
      console.info("[events] Handle failed, trying CMS ID:", cmsID);
      try {
        product = await getEventByID(cmsID);
        if (product) {
          console.info("[events] Successfully fetched by ID:", product.title);
        } else {
          console.info("[events] No product found for ID:", cmsID);
        }
      } catch (error) {
        console.error("[events] Failed to fetch by ID:", error);
      }
    }
    if (!product) {
      eventNotFound();
      console.error("[events] No product found for handle:", handle, "or ID:", cmsID);
      showError("Event not found.");
      return;
    }
    const start = product.startTime?.value ? new Date(product.startTime.value) : null;
    const now = /* @__PURE__ */ new Date();
    const isEventPast = start ? start < now : false;
    if (isEventPast) {
      setProductInfo(product);
      eventPassed();
      return;
    }
    const variants = product.variants?.edges?.map((e) => e.node) || [];
    const totalSeatsAvailable = variants.reduce(
      (sum, variant) => sum + (variant.quantityAvailable || 0),
      0
    );
    if (totalSeatsAvailable <= 0) {
      setProductInfo(product);
      eventSoldOut();
      return;
    }
    const cartEl = document.querySelector('[data-role="cart"]');
    const cartManager = new CartManager();
    const cartDisplay = new CartDisplay(cartManager, cartEl);
    cartManager["onUpdateCallback"] = () => {
      const currency = product.variants?.edges?.[0]?.node?.price?.currencyCode || "USD";
      cartDisplay.update(currency);
    };
    const formManager = new FormManager(product);
    const ticketManager = new TicketManager(product, cartManager);
    const upsellManager = new UpsellManager(product, cartManager);
    const formSubmission = new FormSubmission(
      product,
      cartManager,
      formManager,
      () => ticketManager.getChosenVariantId()
    );
    setProductInfo(product);
    await ticketManager.render();
    await upsellManager.render();
    formSubmission.setupFormHandler();
  });
  function setProductInfo(product) {
    const start = product.startTime?.value ? new Date(product.startTime.value) : null;
    if (start) {
      setTextByAttr(document, "date", dateFormatter(start));
      setTextByAttr(document, "time", timeFormatter(start));
    }
    setTextByAttr(document, "gameType", product.gameType?.value || "");
    setTextByAttr(document, "format", product.format?.value || "");
    setTextByAttr(
      document,
      "duration",
      product.duration?.value ? `${Number(product.duration.value)} MINS` : ""
    );
  }
  function eventPassed() {
    const submitBtn = document.querySelector('[data-role="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }
    updateLayout();
    setTextByAttr(document, "seats", "Event Completed");
  }
  function eventNotFound() {
    const submitBtn = document.querySelector('[data-role="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }
    const eventContent = document.querySelector(".event_content_wrapper")?.childNodes;
    eventContent?.forEach((node, i) => {
      if (i > 3 && node instanceof HTMLElement) {
        node.classList.add("hide");
        node.setAttribute("aria-hidden", "true");
      }
    });
    const cartEl = document.querySelector('[data-role="cart"]');
    if (cartEl) {
      cartEl.classList.add("hide");
      cartEl.setAttribute("aria-hidden", "true");
    }
  }
  function eventSoldOut() {
    const submitBtn = document.querySelector('[data-role="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("disabled");
      submitBtn.textContent = "Sold Out";
    }
    const contentEl = document.querySelector(".event_content_passed");
    if (contentEl) {
      contentEl.classList.remove("w-condition-invisible");
      const message = contentEl.querySelector(".heading-style-h4");
      if (message) {
        message.textContent = "This event is sold out";
      }
    }
    updateLayout();
    setTextByAttr(document, "seats", "Sold Out");
  }
  function updateLayout() {
    const formEl = document.querySelector(".event_content_form");
    if (formEl) {
      formEl.classList.add("hide");
      formEl.setAttribute("aria-hidden", "true");
    }
    const ticketsEl = document.querySelectorAll('[data-role="ticket"]');
    if (ticketsEl) {
      ticketsEl.forEach((ticketEl) => {
        ticketEl.classList.add("sold-out");
      });
    }
    const upsellsEl = document.querySelector(".event_content_upsell");
    if (upsellsEl) {
      upsellsEl.classList.add("hide");
      upsellsEl.setAttribute("aria-hidden", "true");
    }
  }
})();
//# sourceMappingURL=index.js.map
