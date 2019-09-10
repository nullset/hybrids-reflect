# Hybrids-Reflect

Reflected properties for [hybrids.js](https://github.com/hybridsjs/hybrids).

By default Hybrids does not reflect changes in its data model to attributes, and attributes which are set after component initialization are not reflected in the component's data model.

This plugin exposes a `reflect` factory that allows the developer to define individual properties as "reflected" properties, meaning that updates to a component's property will result in an update to the assoctiated DOM attribute, and any change to a reflected DOM attribute will update the associated component's property.

### Prerequisites

[hybrids.js](https://github.com/hybridsjs/hybrids).

### Installing

`npm install @nullset/hybrids-reflect`

or

`yarn add @nullset/hybrids-reflect`

### Usage notes

This plugin enables the developer to reflect `String`, `Number`, `Boolean`, `Array`, and `Object` data types to the DOM. The representation of that data in the DOM attribute is determined by its data type. As such, any reflected property must have a default value.

```
const MyComponent = {
  myStringProp: reflect('Hello world'),
  myEmptyStringProp: reflect(''),
  myNumberProp: reflect(42),
  myBooleanProp: reflect(false),
  myArrayProp: reflect([1,2,3]),
  myEmptyArrayProp: reflect([]),
  myObjectProp: reflect({foo: "bar"}),
  myEmptyObjectProp: reflect({}),
}

define('my-component', MyComponent);
```

Any property which essentially works out to a null/undefined/empty value (ex. null, undefined, false, `[]`, `{}`) has its associated DOM attribute entirely removed from the component until such time as it returns a "populated" value. Inspiration for this behavior is taken from the DOM's handling of boolean attributes, wherein a "false" value should not be displayed in an attribute at all.

The plugin also enables the developer to add additional `get`, `set`, `connect`, and `observe` properties to enhance the reflected value via lifecycle methods.

```
const MyComponent = {
  ...
  myEnhancedProp: reflect('Hello world', {
    get: (host, lastValue) => { ... },
    set: (host, value, lastValue) => { ... },
    connect: (host, key, invalidate) => {
      ...
      // disconnect
      return () => { ... };
    },
    observe: (host, value, lastValue) => { ... },
  })
  ...
}
```

## Running the tests

Currently untested, this will change shortly. :)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Big hat tip to [smalluban](https://github.com/hybridsjs/hybrids/commits?author=smalluban) for Hybrids, as well as his [inspiration](https://github.com/hybridsjs/hybrids/pull/63#issuecomment-529217781) in creating this plugin.
