module.exports = {
  presets: [
    "@babel/preset-typescript",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  overrides: [
    {
      include: ["./packages/core-web", "./packages/react"],
      presets: [
        [
          "@babel/preset-env",
          {
            // see here: https://babeljs.io/docs/en/babel-preset-env#usebuiltins-usage
            useBuiltIns: "usage",
            corejs: 3,
          },
        ],
      ],
    },
  ],
};
