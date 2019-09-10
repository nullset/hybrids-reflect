import { property, camelToDash } from 'hybrids';
import { getType, coerceToType, setAttr } from './utils';

// Keep track of any instances of any components that use reflected attributes.
const hosts = new WeakMap();

// Keep track of all reflected attributes, by component tag name.
const reflectedAttributes = new Map();

export default function reflect(value, methods = {}) {
  let type;
  let attrName;
  let observer;
  return {
    ...property(value, function connect(host, key) {
      type = getType(value);
      attrName = camelToDash(key);
      const tagName = host.tagName;

      // Assign all reflected attributes to a map whose lookup is the tagName.
      const attrMap = reflectedAttributes.get(tagName) || new Map();
      reflectedAttributes.set(tagName, attrMap.set(attrName, {key, type}));

      // Set coerced value for key, as derived from attribute.
      const attrValue = host.getAttribute(attrName);
      if (attrValue !== null) {
        value = coerceToType(attrValue, type);
        host[key] = value;
      }

      // Only assign a single mutation observer to watch any single host, no matter how many reflected keys it has.
      const hasObserver = hosts.get(host);
      if (!hasObserver) {
        observer = new MutationObserver((mutations) => {
          const watchedAttrs = reflectedAttributes.get(tagName);
          mutations.forEach(({ attributeName, target }) => {
            const watchedAttr = watchedAttrs.get(attributeName);
            if (watchedAttr) {
              const {key, type} = watchedAttr;
              const attrValue = target.getAttribute(attributeName);
              const value = coerceToType(attrValue, type);
              if (value !== host[key]) {
                target[key] = value;
              }
            }
          });
        });
        hosts.set(host, true);
        observer.observe(host, { attributes: true });
      }

      // Call any individually defined `connect` method the property may have.
      if (methods.connect) methods.connect(host, key);

      // Once a host disconnects, stop watching it and remove it from WeakMap.
      // Only run code once no matter how many reflected keys it has.
      return () => {
        if (observer) {
          observer.disconnect();
          hosts.delete(host);  
        }
      }
    }),
    observe: (host, value, oldValue) => {
      // If a reflected property changes, reflect that change to the attribute.
      setAttr(host, attrName, type, value, oldValue)

      // Call any individually defined `observe` method the property may have.
      if (methods.observe) methods.observe(host, value, oldValue);
    },
  }
}

export {
  getType,
  coerceToType,
}
