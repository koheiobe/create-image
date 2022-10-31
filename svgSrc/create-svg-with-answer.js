const {
  readFileSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} = require("fs");
const { getAnswerRecords } = require("./csv-controller");
const {
  generateSVGFromSeed,
  fromCsvRecordToSeedWithAnswer,
} = require("./seed-creater");

// パーツのフォルダー構造
// {
//   svg: {
//     parts: {
//       bg,
//       hito,
//       maru,
//       moji,
//       mono,
//     },
//     outputs,
//     answerOutputs,
//   },
// };
const basePartsPath = `./svg/parts`;
const svgPartsFolderNameList = ["bg", "hito", "maru", "moji", "mono"];
const answerSvgOutputsPath = `${basePartsPath}/outputAnswers`;
const csvOutputPath = `${basePartsPath}/partsAnswersList.csv`;

const main = async () => {
  let recordsWithAnswer = [];
  try {
    const csv = readFileSync(csvOutputPath);
    recordsWithAnswer = await getAnswerRecords(csv);
  } catch (err) {
    console.log(err);
    return;
  }

  let answeredSVGIds;
  try {
    const filenames = readdirSync(answerSvgOutputsPath);
    answeredSVGIds = filenames.map((filename) =>
      filename.replace(/(.svg|.png)/, "")
    );
  } catch (err) {
    if (!existsSync(answerSvgOutputsPath)) {
      mkdirSync(answerSvgOutputsPath);
    }
    answeredSVGIds = [];
  }

  const notGeneratedRecords = recordsWithAnswer.filter(
    (record) => !answeredSVGIds.includes(record.ID)
  );

  const seed = fromCsvRecordToSeedWithAnswer(
    notGeneratedRecords,
    svgPartsFolderNameList
  );

  const idAndSVGs = await generateSVGFromSeed(basePartsPath, seed);
  for (const [id, svg] of idAndSVGs) {
    writeFileSync(`${answerSvgOutputsPath}/${id}.svg`, svg);
    // テストのために１枚だけ出力する際は下記をコメントイン
    // break;
  }
};

module.exports = main;
