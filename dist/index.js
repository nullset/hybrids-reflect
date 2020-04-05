import{property as e}from"hybrids";import{camelToDash as t}from"hybrids/src/utils";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function u(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(r,!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(r).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e){switch(r(e)){case"undefined":return;case"number":return Number;case"boolean":return Boolean;case"object":return null===e?null:Array.isArray(e)?Array:Object;case"function":return Function;case"string":default:return String}}function i(e,t){switch(t){case String:case Number:return t(e);case Boolean:return!("false"===e||!e&&""!==e);case Array:return Array.isArray(e)?e:"string"==typeof e?/^\[.*\]$/.test(e)?JSON.parse(e):[]:e?t(e):[];case Object:return JSON.parse(e);case Function:default:return}}function a(e,t,r,n,o){if(n!==o)switch(r){case null:case void 0:break;case Boolean:n?e.setAttribute(t,""):e.removeAttribute(t);break;case Array:null==n||0===n.length?e.removeAttribute(t):e.setAttribute(t,JSON.stringify(n));break;case Object:null==n||0===Object.keys(n).length?e.removeAttribute(t):e.setAttribute(t,JSON.stringify(n));break;case Function:break;case String:""===n||null==n?e.removeAttribute(t):e.setAttribute(t,n);break;case Number:default:null==n?e.removeAttribute(t):e.setAttribute(t,n)}}var s=new WeakMap,b=new Map;export default function(r){var n,o,f,l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},y=r,p=u({},e(y,(function(e,r){n=l.type||c(y),o=t(r);var u=e.tagName,a=b.get(u)||new Map;b.set(u,a.set(o,{key:r,type:n}));var p,g=e.getAttribute(o);return null!==g&&(y=i(g,n),e[r]=y),s.get(e)||(f=new MutationObserver((function(t){var r=b.get(u);t.forEach((function(t){var n=t.attributeName,o=t.target,u=r.get(n);if(u){var c=u.key,a=u.type,s=i(o.getAttribute(n),a);s!==e[c]&&(o[c]=s)}}))})),s.set(e,!0),f.observe(e,{attributes:!0})),l.connect&&(p=l.connect(e,r)),function(){p&&p(),f&&(f.disconnect(),s.delete(e))}}))),g=p.get;p.get=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:r;return l.get?l.get(e,t):g(e,t)};var v=p.set;return p.set=function(e,t,r){return l.set?l.set(e,t,r):v(e,t,r)},p.observe=function(e,t,r){a(e,o,n,t,r),l.observe&&l.observe(e,t,r)},p}export{i as coerceToType,c as getType};
//# sourceMappingURL=index.js.map
