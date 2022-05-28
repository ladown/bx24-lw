module.exports = {
  plugins: [require("postcss-preset-env"), require("autoprefixer")({ grid: "autoplace", cascade: true }), require("postcss-merge-longhand")],
};
