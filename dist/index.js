import { property } from 'hybrids';
import { camelToDash } from 'hybrids/src/utils';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function getType(value) {
  switch (_typeof(value)) {
    case "undefined":
      return undefined;

    case "number":
      return Number;

    case "boolean":
      return Boolean;

    case "object":
      if (value === null) return null;
      if (Array.isArray(value)) return Array;
      return Object;

    case "function":
      return Function;

    case "string":
    default:
      return String;
  }
}
function coerceToType(value, type) {
  switch (type) {
    case String:
    case Number:
      if (value == undefined) return;
      return type(value);

    case Boolean:
      if (value === "false" || !value && value !== "") return false;
      return true;

    case Array:
      if (Array.isArray(value)) return value;

      if (typeof value === "string") {
        return /^\[.*\]$/.test(value) ? JSON.parse(value) : [];
      }

      if (value) return type(value);
      return [];

    case Object:
      return JSON.parse(value);

    case Function:
      return undefined;

    default:
      return undefined;
  }
}
function setAttr(host, attrName, type, val, oldValue) {
  if (val !== oldValue) {
    switch (type) {
      case null:
      case undefined:
        break;

      case Boolean:
        if (val) {
          host.setAttribute(attrName, "");
        } else {
          host.removeAttribute(attrName);
        }

        break;

      case Array:
        if (val === undefined || val === null || val.length === 0) {
          host.removeAttribute(attrName);
        } else {
          host.setAttribute(attrName, JSON.stringify(val));
        }

        break;

      case Object:
        if (val === undefined || val === null || Object.keys(val).length === 0) {
          host.removeAttribute(attrName);
        } else {
          host.setAttribute(attrName, JSON.stringify(val));
        }

        break;

      case Function:
        break;

      case String:
        if (val === "" || val === undefined || val === null) {
          host.removeAttribute(attrName);
        } else {
          host.setAttribute(attrName, val);
        }

        break;

      case Number:
      default:
        if (val === undefined || val === null) {
          host.removeAttribute(attrName);
        } else {
          host.setAttribute(attrName, val);
        }

        break;
    }
  }
}

var hosts = new WeakMap(); // Keep track of all reflected attributes, by component tag name.

var reflectedAttributes = new Map();
function reflect(value) {
  var methods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type;
  var attrName;
  var observer;
  var reflectedValue = value;

  var properties = _objectSpread2({}, property(reflectedValue, function connect(host, key) {
    type = methods.type || getType(reflectedValue);
    attrName = camelToDash(key);
    var tagName = host.tagName; // Assign all reflected attributes to a map whose lookup is the tagName.

    var attrMap = reflectedAttributes.get(tagName) || new Map();
    reflectedAttributes.set(tagName, attrMap.set(attrName, {
      key: key,
      type: type
    })); // Set coerced value for key, as derived from attribute.

    var attrValue = host.getAttribute(attrName);

    if (attrValue !== null) {
      reflectedValue = coerceToType(attrValue, type);
      host[key] = reflectedValue;
    } // Only assign a single mutation observer to watch any single host, no matter how many reflected keys it has.


    var hasObserver = hosts.get(host);

    if (!hasObserver) {
      observer = new MutationObserver(function (mutations) {
        var watchedAttrs = reflectedAttributes.get(tagName);
        mutations.forEach(function (_ref) {
          var attributeName = _ref.attributeName,
              target = _ref.target;
          var watchedAttr = watchedAttrs.get(attributeName);

          if (watchedAttr) {
            var _key = watchedAttr.key,
                _type = watchedAttr.type;

            var _attrValue = target.getAttribute(attributeName);

            var _reflectedValue = coerceToType(_attrValue, _type);

            if (_reflectedValue != undefined && _reflectedValue !== host[_key]) {
              target[_key] = _reflectedValue;
            }
          }
        });
      });
      hosts.set(host, true);
      observer.observe(host, {
        attributes: true
      });
    } // Call any individually defined `connect` method the property may have.


    var disconnectFn;

    if (methods.connect) {
      disconnectFn = methods.connect(host, key);
    } // Once a host disconnects, stop watching it and remove it from WeakMap.
    // Only run code once no matter how many reflected keys it has.


    return function () {
      disconnectFn && disconnectFn();

      if (observer) {
        observer.disconnect();
        hosts.delete(host);
      }
    };
  }));

  var _get = properties.get;

  properties.get = function (host) {
    var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : value;
    return methods.get ? methods.get(host, val) : _get(host, val);
  };

  var _set = properties.set;

  properties.set = function (host, val, oldValue) {
    return methods.set ? methods.set(host, val, oldValue) : _set(host, val, oldValue);
  };

  properties.observe = function (host, val, oldValue) {
    setAttr(host, attrName, type, val, oldValue);
    if (methods.observe) methods.observe(host, val, oldValue);
  };

  return properties;
}

export default reflect;
export { coerceToType, getType };
//# sourceMappingURL=index.js.map
