//cf. https://tympanus.net/codrops/2021/12/07/coloring-with-code-a-programmatic-approach-to-design/

// process negative values
function adjustHue(value) {
  if (value < 0) {
    value += Math.ceil(-value / 360) * 360;
  }
  return value % 360;
}

// rotate on the color wheel and get LCH colors
function createScientificPalettes(baseColor) {
  const targetHueSteps = {
    analogous: [0, 30, 60],
    // triadic: [0, 120, 240],
    // tetradic: [0, 90, 180, 270],
    complementary: [0, 180],
    splitComplementary: [0, 150, 210]
  };

  const palettes = {};

  for (const type of Object.keys(targetHueSteps)) {
    palettes[type] = targetHueSteps[type].map((step) => ({
      l: baseColor.l, // lightness
      c: baseColor.c, // chroma
      h: adjustHue(baseColor.h + step), // hue
      mode: 'lch'
    }));
  }

  return palettes;
}

// try and make a monochromatic palette
function createMonoPalette(baseColor) {
  const targetSteps = [0, 0.33, 0.66, 1];
  const palette = {};
  palette['monochromatic'] = targetSteps.map(step => ({
    l: baseColor.l * step,
    c: baseColor.c * step,
    h: baseColor.h,
    mode: 'lch'
  }));
  palette['monochromatic'] = palette['monochromatic'].concat(targetSteps.slice(1).map(step => ({
    l: baseColor.l * (1 + step),
    c: baseColor.c,
    h: baseColor.h,
    mode: 'lch'
  })));
  return palette;
}

// 
function makePolychromaticPalettesFrom(baseColors) {
  return baseColors.map(baseColor => createScientificPalettes(baseColor));
}

function makeMonochromaticPalettesFrom(baseColors) {
  return baseColors.map(baseColor => createMonoPalette(baseColor));
}

// DOM operations

function displayPalette(palette) {
  Object.keys(palette).forEach(type => {
    console.log(`${type}:\n`);
    // display palette type
    appendH2(type);
    const colors = palette[type];
    // display a div for each color
    colors.forEach(color => {
      hexColor = culori.formatHex(color);
      console.log(`\tl: ${color.l} c: ${color.c} h: ${color.h}`);
      appendDiv(hexColor);
    });
  });
}

function appendH2(textContent) {
  const h2Element = document.createElement('h2');
  h2Element.textContent = textContent;
  document.body.appendChild(h2Element);
}

function appendDiv(color) {
  const divElement = document.createElement('div');
  divElement.textContent = color;
  divElement.style.background = color;
  divElement.classList.add('color-sample');
  document.body.append(divElement);
}

//
const lchConverter = culori.converter('lch');
const baseColors = [
  lchConverter('5d0d6e'),
  lchConverter('ed4353'),
  lchConverter('fed440'),
  lchConverter('3ccdb4'),
  lchConverter('0fac71'),
];
// console.log(baseColors);

const palettes = makeMonochromaticPalettesFrom(baseColors);
palettes.forEach(palette => displayPalette(palette));

/* 
// discovery

const palette = createMonoPalette({
  l: 66,
  c: 30,
  h: 180,
  mode: 'lch'
});
console.log(palette);
displayPalette(palette);

// 
const goodMonoPalette = [
  lchConverter('073965'),
  lchConverter('074276'),
  lchConverter('0f4c81'),
  lchConverter('155790'),
  lchConverter('1b609d'),
];
for (const color of goodMonoPalette) {
  console.log(color);
}
 */