import { property } from "hybrids";
import { camelToDash } from "hybrids/src/utils";
import { getType, coerceToType, setAttr } from "./utils";

// Keep track of any instances of any components that use reflected attributes.
const hosts = new WeakMap();

// Keep track of all reflected attributes, by component tag name.
const reflectedAttributes = new Map();

export default function reflect(value, methods = {}) {
  let type;
  let attrName;
  let observer;
  let reflectedValue = value;
  const properties = {
    ...property(reflectedValue, function connect(host, key) {
      type = methods.type || getType(reflectedValue);
      attrName = camelToDash(key);
      const tagName = host.tagName;

      // Assign all reflected attributes to a map whose lookup is the tagName.
      const attrMap = reflectedAttributes.get(tagName) || new Map();
      reflectedAttributes.set(tagName, attrMap.set(attrName, { key, type }));

      // Set coerced value for key, as derived from attribute.
      const attrValue = host.getAttribute(attrName);
      if (attrValue !== null) {
        reflectedValue = coerceToType(attrValue, type);
        host[key] = reflectedValue;
      }

      // Only assign a single mutation observer to watch any single host, no matter how many reflected keys it has.
      const hasObserver = hosts.get(host);
      if (!hasObserver) {
        observer = new MutationObserver((mutations) => {
          const watchedAttrs = reflectedAttributes.get(tagName);
          mutations.forEach(({ attributeName, target }) => {
            const watchedAttr = watchedAttrs.get(attributeName);
            if (watchedAttr) {
              const { key, type } = watchedAttr;
              const attrValue = target.getAttribute(attributeName);
              const reflectedValue = coerceToType(attrValue, type);
              if (reflectedValue != undefined && reflectedValue !== host[key]) {
                target[key] = reflectedValue;
              }
            }
          });
        });
        hosts.set(host, true);
        observer.observe(host, { attributes: true });
      }

      // Call any individually defined `connect` method the property may have.
      let disconnectFn;
      if (methods.connect) {
        disconnectFn = methods.connect(host, key);
      }

      // Once a host disconnects, stop watching it and remove it from WeakMap.
      // Only run code once no matter how many reflected keys it has.
      return () => {
        disconnectFn && disconnectFn();
        if (observer) {
          observer.disconnect();
          hosts.delete(host);
        }
      };
    }),
  };
  const _get = properties.get;
  properties.get = (host, val = value) => {
    return methods.get ? methods.get(host, val) : _get(host, val);
  };
  const _set = properties.set;
  properties.set = (host, val, oldValue) => {
    return methods.set
      ? methods.set(host, val, oldValue)
      : _set(host, val, oldValue);
  };
  properties.observe = (host, val, oldValue) => {
    setAttr(host, attrName, type, val, oldValue);
    if (methods.observe) methods.observe(host, val, oldValue);
  };
  return properties;
}

export { getType, coerceToType };
