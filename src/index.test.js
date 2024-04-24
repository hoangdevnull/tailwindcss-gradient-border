import path from "path";
import postcss from "postcss";
import gradientBorderPlugins from ".";
import { expect, test } from "vitest";
import tailwindcss from "tailwindcss";

// Custom CSS matcher
expect.extend({
  // Compare two CSS strings with all whitespace removed
  // This is probably naive but it's fast and works well enough.
  toMatchCss(received, argument) {
    function stripped(string_) {
      return string_.replaceAll(/\s/g, "").replaceAll(";", "");
    }

    const pass = stripped(received) === stripped(argument);

    return {
      pass,
      actual: received,
      expected: argument,
      message: () => (pass ? "All good!" : "CSS does not match"),
    };
  },
});

// Function to run the plugin
function run(config, css = "@tailwind utilities", plugin = tailwindcss) {
  let { currentTestName } = expect.getState();

  config = {
    ...{
      plugins: [gradientBorderPlugins],
      corePlugins: {
        preflight: false,
      },
    },
    ...config,
  };

  return postcss(plugin(config)).process(css, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  });
}

test("addUtilities", () => {
  const config = {
    content: [
      {
        raw: String.raw`
          <div class="gradient-border-[1px]"></div>
        `,
      },
    ],
  };

  return run(config).then((result) => {
    console.log("--------", result.css);
    expect(result.css).toMatchCss(String.raw`
        .gradient-border-\[1px\] {
           position: relative;
       }
       .gradient-border-\[1px\]::before {
           content: "";
           pointer-events: none;
           user-select: none;
           position: absolute;
           top: 0px;
           right: 0px;
           bottom: 0px;
           left: 0px;
           mask-image: linear-gradient(black, black), linear-gradient(black, black);
           -webkit-mask-position-x: 0%, 0%;
           -webkit-mask-position-y: 0%, 0%;
           mask-size: auto, auto;
           mask-repeat: repeat, repeat;
           mask-origin: content-box, border-box;
           mask-clip: content-box, border-box;
           mask-mode: match-source, match-source;
           mask-composite: exclude;
           border-radius: inherit;
           padding: 1px;
       }
    `);
  });
});
