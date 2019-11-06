module.exports = {
  "presets": [
    ["@babel/preset-env", { "modules": false, "targets": "IE 11" }]
  ],
  "env": {
    "coverage": {
      "plugins": [
        ["babel-plugin-istanbul", { "include": ["src/**/*.js"] }]
      ]
    }
  }
}