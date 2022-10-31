const generateAnswerSVG = (answer) => {
  let y,
    px = 0;
  const length = answer.length;
  if (length <= 6) {
    y = 320;
    px = 50;
  } else if (length > 6 && length <= 12) {
    y = 290;
    px = 50;
  } else if (length > 12 && length <= 18) {
    y = 230;
    px = 50;
  } else {
    y = 200;
    px = 43;
  }
  const svg = `
  <svg version="1.1" id="moji" x="0" y="0" width="986" height="986" style="enable-background:new 0 0 986 986" xml:space="preserve">
    <foreignObject x="550" y="${y}" width="350" height="300">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <link href="http://fonts.googleapis.com/css?family=Potta+One" rel="stylesheet" type="text/css"></link>
        <div style="width:100%;height:100%;font-size:${px}px;font-family: Potta One;">
          ${answer}
        </div>
      </html>
    </foreignObject>
  </svg>`;
  return svg;
};

module.exports.generateAnswerSVG = generateAnswerSVG;
