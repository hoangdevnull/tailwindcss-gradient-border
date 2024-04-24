/* eslint-disable */
const plugin = require('tailwindcss/plugin');

module.exports = plugin.withOptions(function (options) {
  return function ({ addUtilities, matchUtilities, theme, e }) {
    const borderWidths = theme('borderWidth', {});
    const gradientColors = theme('backgroundImage', {});

    const baseStyles = {
      content: '""',
      pointerEvents: 'none',
      userSelect: 'none',
      position: 'absolute',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
      maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
      WebkitMaskPositionX: '0%, 0%',
      WebkitMaskPositionY: '0%, 0%',
      maskSize: 'auto, auto',
      maskRepeat: 'repeat, repeat',
      maskOrigin: 'content-box, border-box',
      maskClip: 'content-box, border-box',
      maskMode: 'match-source, match-source',
      maskComposite: 'exclude',
      borderRadius: 'inherit',
    };
    const newUtilities = {};
    // Generate utilities for each width
    Object.keys(borderWidths).forEach((width) => {
      const widthValue = borderWidths[width];
      const className = `.gradient-border-${width}:before`;
      const baseClassName = `.gradient-border-${width}`;
      newUtilities[baseClassName] = {
        position: 'relative',
      };
      newUtilities[className] = {
        ...baseStyles,
        padding: `${widthValue}`,
      };
    });
    // Generate utilities for each gradient-color
    Object.keys(gradientColors).forEach((gradientColor) => {
      const colorValue = gradientColors[gradientColor];
      const className = `.gradient-border-${gradientColor}:before`;

      newUtilities[className] = {
        backgroundImage: colorValue,
      };
    });

    /**
     * Static utilities
     * https://tailwindcss.com/docs/plugins#static-utilities
     */
    addUtilities(newUtilities, ['responsive', 'hover', 'focus']);

    matchUtilities(
      {
        'gradient-border': (value) => {
          const unitRegex = /^-?\d*\.?\d+(px|em|rem|vh|vw|%)?$/;
          if (unitRegex.test(value)) {
            return {
              position: 'relative',
              '&::before': {
                ...baseStyles,
                padding: value,
              },
            };
          }
          return {
            position: 'relative',
            '&::before': {
              ...baseStyles,
              backgroundImage: value,
            },
          };
        },
      },
      {
        // Specify the variants you want these utilities to support
        variants: ['responsive', 'hover'],
      }
    );
  };
});
