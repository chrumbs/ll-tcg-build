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

  // src/index.ts
  init_live_reload();

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
  var DOMAIN = "shop.lostlevelsarcade.com";
  var TOKEN = "51611eac4adbd8d8496b9a639e0c3ef2";
  var API_VER = "2026-10";
  var client = createStorefrontApiClient({
    storeDomain: DOMAIN,
    apiVersion: API_VER,
    publicAccessToken: TOKEN
  });
  async function getProductsByIDs(ids) {
    if (!ids || ids.length === 0) return [];
    const formattedIds = ids.map((id) => formatProductId(id));
    try {
      const { data, errors } = await client.request(
        `
        query ($ids: [ID!]!) {
        nodes(ids: $ids) {
            ... on Product {
              id
              handle
              title
              gameType:  metafield(namespace:"custom", key:"game_type"){ value }
              startTime: metafield(namespace:"custom", key:"start_time"){ value }
              duration:  metafield(namespace:"custom", key:"duration"){ value }
              format:    metafield(namespace:"custom", key:"format"){ value }
              totalCap:  metafield(namespace:"custom", key:"total_cap"){ value }
              variants(first: 50) {
                edges { node {
                  id
                  price { amount }
                  quantityAvailable
                  selectedOptions { name value }
                }}
              }
            }
          }
        }
      `,
        { variables: { ids: formattedIds } }
      );
      if (errors) {
        throw new Error(errors.graphQLErrors?.[0]?.message || errors.message);
      }
      return data.nodes;
    } catch (error) {
      console.error("Error fetching products by IDs:", error);
      return [];
    }
  }

  // src/home/renderGlobe.ts
  init_live_reload();
  var renderGlobe = (canvas) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { cos, sin, sqrt, acos, atan2, abs, PI } = Math;
    const clamp = (a, b, x) => x < a ? a : x > b ? b : x;
    const NB_SECTIONS = 12;
    const LINE_WIDTH = 1;
    const SCALE = devicePixelRatio;
    const BASE_SPEED = 2e4;
    function updateCanvasDimensions() {
      const rect = canvas.getBoundingClientRect();
      const { width: width2, height: height2 } = rect;
      canvas.width = width2 * SCALE;
      canvas.height = height2 * SCALE;
      canvas.style.width = `${width2}px`;
      canvas.style.height = `${height2}px`;
      const RADIUS2 = Math.min(width2, height2) / 2;
      return { width: width2, height: height2, RADIUS: RADIUS2 };
    }
    let { width, height, RADIUS } = updateCanvasDimensions();
    const vec = (x = 0, y = 0, z = 0) => ({ x, y, z });
    vec.set = (o, x = 0, y = 0, z = 0) => {
      o.x = x;
      o.y = y;
      o.z = z;
      return o;
    };
    const Z = vec(0, 0, 1);
    let theta, phi;
    function project(o, { x, y, z }) {
      const ct = cos(theta), st = sin(theta);
      const cp = cos(phi), sp = sin(phi);
      const a = x * ct + y * st;
      return vec.set(o, y * ct - x * st, cp * z - sp * a, cp * a + sp * z);
    }
    const _p = vec();
    function draw_section(n, o = 0) {
      if (!ctx) return;
      const { x, y, z } = project(_p, n);
      const a = atan2(y, x);
      const ry = sqrt(1 - o * o);
      const rx = ry * abs(z);
      const W = sqrt(x * x + y * y);
      const sa = acos(clamp(-1, 1, o * (1 / W - W) / rx));
      const sb = z > 0 ? 2 * PI - sa : -sa;
      ctx.beginPath();
      ctx.ellipse(x * o * RADIUS, y * o * RADIUS, rx * RADIUS, ry * RADIUS, a, sa, sb, z <= 0);
      ctx.stroke();
    }
    const _n = vec();
    function draw_arcs() {
      for (let i = NB_SECTIONS; i--; ) {
        const a = i / NB_SECTIONS * Math.PI;
        draw_section(vec.set(_n, cos(a), sin(a)));
      }
      for (let i = NB_SECTIONS - 1; i--; ) {
        const a = (i + 1) / NB_SECTIONS * Math.PI;
        draw_section(Z, cos(a));
      }
    }
    ctx.lineCap = "round";
    function render() {
      if (!ctx) return;
      requestAnimationFrame(render);
      const newDimensions = updateCanvasDimensions();
      width = newDimensions.width;
      height = newDimensions.height;
      RADIUS = newDimensions.RADIUS;
      theta = performance.now() / BASE_SPEED * PI;
      phi = PI * 0.1;
      ctx.save();
      ctx.scale(SCALE, SCALE);
      ctx.clearRect(0, 0, width, height);
      ctx.translate(width / 2, height / 2);
      ctx.rotate(3 * PI / 180);
      ctx.scale(1, -1);
      ctx.strokeStyle = "#2b46f5";
      ctx.lineWidth = LINE_WIDTH;
      ctx.beginPath();
      ctx.arc(0, 0, RADIUS, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.lineWidth = LINE_WIDTH;
      ctx.strokeStyle = "#2b46f5";
      draw_arcs();
      ctx.restore();
    }
    requestAnimationFrame(render);
  };

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(async () => {
    pageTransition();
    const globeCanvas = document.querySelector('[data-role="globe-canvas"]');
    if (globeCanvas) renderGlobe(globeCanvas);
    const accordions = Array.from(document.querySelectorAll('[ll-selector="accordion"]'));
    if (accordions.length > 0) {
      renderAccordions(accordions);
    } else {
      console.info("No accordion elements found.");
    }
    const productCards = Array.from(document.querySelectorAll("[data-product-id]"));
    if (!productCards || productCards.length === 0) return;
    const productIds = [
      ...new Set(productCards.map((card) => card.getAttribute("data-product-id")).filter(Boolean))
    ];
    const data = await getProductsByIDs(productIds);
    const productMap = /* @__PURE__ */ new Map();
    const productsArray = Array.isArray(data) ? data : [];
    productsArray.forEach((p) => {
      if (!p) {
        console.error("Invalid product data:", p);
        return;
      }
      const variants = (p.variants?.edges || []).map((e) => {
        const n = e.node;
        const options = Object.fromEntries((n.selectedOptions || []).map((o) => [o.name, o.value]));
        return {
          id: n.id,
          qty: Number(n.quantityAvailable ?? 0),
          price: Number(n.price?.amount ?? 0),
          options
        };
      });
      const seatsLeft = variants.reduce((sum, v) => sum + (v.qty || 0), 0);
      const prices = variants.map((v) => v.price).filter((n) => Number.isFinite(n));
      const minPrice = prices.length ? Math.min(...prices) : null;
      const maxPrice = prices.length ? Math.max(...prices) : null;
      const info = {
        id: p.id,
        handle: p.handle,
        title: p.title,
        gameType: p.gameType?.value || "",
        start: p.startTime?.value ? new Date(p.startTime.value) : null,
        durationMin: p.duration?.value ? Number(p.duration.value) : null,
        format: p.format?.value || null,
        totalCap: p.totalCap?.value ? Number(p.totalCap.value) : null,
        variants,
        seatsLeft,
        minPrice,
        maxPrice,
        currency: variants[0]?.price ? p.variants?.edges?.[0]?.node?.price?.currencyCode || "USD" : "USD"
      };
      productMap.set(info.id, info);
    });
    productCards.forEach((card) => {
      const productId = card.getAttribute("data-product-id");
      if (!productId) {
        console.error(`Product ID not found for card: ${card}`);
        return;
      }
      const productData = productMap.get(formatProductId(productId));
      if (!productData) {
        console.error(`Product not found: ${productId}`);
        return;
      }
      if (productData.minPrice != null) {
        let priceText = "";
        if (productData.maxPrice != null && productData.maxPrice !== productData.minPrice) {
          priceText = `${moneyFormatter(productData.minPrice, productData.currency)} \u2014 ${moneyFormatter(productData.maxPrice, productData.currency)}`;
        } else {
          priceText = productData.minPrice === 0 ? "Free" : moneyFormatter(productData.minPrice, productData.currency);
        }
        setTextByAttr(card, "price", priceText);
      }
      setTextByAttr(card, "gameType", productData.gameType || "");
      setTextByAttr(card, "format", productData.format || "");
      setTextByAttr(
        card,
        "duration",
        productData.durationMin ? `${productData.durationMin} MINS` : ""
      );
      if (productData.start) {
        setTextByAttr(card, "date", dateFormatter(productData.start));
        setTextByAttr(card, "time", timeFormatter(productData.start));
      }
      const now = /* @__PURE__ */ new Date();
      const isEventPast = productData.start ? productData.start < now : false;
      const hasSeatsAvailable = productData.seatsLeft > 0;
      const clickable = hasSeatsAvailable && !isEventPast;
      let seatsText = "";
      if (isEventPast) {
        seatsText = "Past Event";
      } else if (!hasSeatsAvailable) {
        seatsText = "Sold Out";
      } else {
        seatsText = `${productData.seatsLeft} ${productData.totalCap && productData.totalCap > 0 ? `/ ${productData.totalCap} Open` : "Open"}`;
      }
      setTextByAttr(card, "seats", seatsText);
      card.classList.toggle("active", clickable);
      const overlayLink = card.querySelector('[data-role="link"]');
      if (overlayLink) {
        if (clickable) {
          overlayLink.style.display = "block";
          overlayLink.removeAttribute("aria-hidden");
          overlayLink.removeAttribute("tabindex");
        } else {
          overlayLink.style.display = "none";
          overlayLink.setAttribute("aria-hidden", "true");
          overlayLink.setAttribute("tabindex", "-1");
        }
        if (!overlayLink.getAttribute("aria-label")) {
          overlayLink.setAttribute("aria-label", productData.title || "View event");
        }
      }
      if (!clickable) {
        card.classList.add("inactive");
        card.setAttribute("aria-disabled", "true");
        if (isEventPast) {
          card.classList.add("past-event");
        }
        if (!hasSeatsAvailable && !isEventPast) {
          card.classList.add("sold-out");
        }
      } else {
        card.classList.remove("inactive", "past-event", "sold-out");
        card.removeAttribute("aria-disabled");
      }
    });
  });
})();
//# sourceMappingURL=index.js.map
