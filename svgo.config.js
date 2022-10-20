module.exports = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // customize default plugin options
          inlineStyles: {
            onlyMatchedOnce: false,
          },
        },
      },
    },
    {
      name: "removeAttrs",
      params: {
        attrs: "(width|height)",
      },
    },
    "removeXMLNS",
  ],
};
