const defaultTheme = require("tailwindcss/defaultTheme");

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;

module.exports = {
  purge: ["src/template.html"],
  theme: {
    extend: {},
    typography: {
      default: {
        css: {
          color: defaultTheme.colors.gray[200],
          '[class~="lead"]': {
            color: defaultTheme.colors.gray[200],
          },
          a: {
            color: defaultTheme.colors.blue[400],
          },
          strong: {
            color: defaultTheme.colors.gray[100],
          },
          "ol > li::before": {
            color: defaultTheme.colors.gray[400],
          },
          "ul > li::before": {
            backgroundColor: defaultTheme.colors.gray[600],
          },
          hr: {
            borderColor: defaultTheme.colors.gray[700],
          },
          blockquote: {
            color: defaultTheme.colors.gray[100],
            borderLeftColor: defaultTheme.colors.gray[700],
          },
          h1: {
            color: defaultTheme.colors.gray[100],
            fontSize: em(24, 16),
            marginTop: em(48, 24),
            marginBottom: em(24, 24),
            lineHeight: round(32 / 24),
          },
          h2: {
            color: defaultTheme.colors.gray[100],
          },
          h3: {
            color: defaultTheme.colors.gray[100],
          },
          h4: {
            color: defaultTheme.colors.gray[100],
          },
          "figure figcaption": {
            color: defaultTheme.colors.gray[400],
          },
          code: {
            color: defaultTheme.colors.gray[100],
          },
          pre: {
            color: defaultTheme.colors.gray[700],
            backgroundColor: defaultTheme.colors.gray[200],
          },
          thead: {
            color: defaultTheme.colors.gray[100],
            borderBottomColor: defaultTheme.colors.gray[600],
          },
          "tbody tr": {
            borderBottomColor: defaultTheme.colors.gray[700],
          },
        },
      },
    },
  },
  variants: {
    typography: [],
  },
  plugins: [
    require("@tailwindcss/typography")({ modifiers: [] }),
    require("@tailwindcss/ui"),
  ],
};
