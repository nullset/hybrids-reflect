export function getType(value) {
  switch (typeof value) {
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

export function coerceToType(value, type) {
  switch (type) {
    case String:
    case Number:
      if (value == undefined) return;
      return type(value);
    case Boolean:
      if (value === "false" || (!value && value !== "")) return false;
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

export function setAttr(host, attrName, type, val, oldValue) {
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
        if (
          val === undefined ||
          val === null ||
          Object.keys(val).length === 0
        ) {
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
