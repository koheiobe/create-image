const { stringify, parse } = require("csv");
const { writeFileSync, existsSync, appendFileSync } = require("fs");

function generateCsv(seed, outputPath) {
  const data = Object.entries(seed).map(([id, partsList]) => ({
    ID: id,
    [partsList[0][0]]: partsList[0][1],
    [partsList[1][0]]: partsList[1][1],
    [partsList[2][0]]: partsList[2][1],
    [partsList[3][0]]: partsList[3][1],
    [partsList[4][0]]: partsList[4][1],
    answer: "",
  }));
  return new Promise((resolve, reject) => {
    const isFileExists = existsSync(outputPath);
    stringify(data, { header: !isFileExists }, function (err, records) {
      if (err) reject;
      if (isFileExists) {
        appendFileSync(outputPath, records);
      } else {
        writeFileSync(outputPath, records);
      }
      resolve(true);
    });
  });
}

function csvParser(csvFile) {
  const getRecords = () =>
    new Promise((resolve, reject) => {
      parse(csvFile, { columns: true }, function (err, records) {
        if (err) {
          reject(err);
        }
        resolve(records);
      });
    });
  return getRecords();
}

async function getCsvIds(csvFile) {
  const records = await csvParser(csvFile);
  return records.map((record) => record.ID);
}

/**
 *
 * @param {*} csvFile
 * @returns {
 *   ID: string,
 *   partsName: string
 *   ...
 *   answer: string
 * }[]
 */
async function getAnswerRecords(csvFile) {
  const records = await csvParser(csvFile);
  console.log(records);
  return records.filter((record) => record.answer.length > 0);
}

module.exports.generateCsv = generateCsv;
module.exports.csvParser = csvParser;
module.exports.getCsvIds = getCsvIds;
module.exports.getAnswerRecords = getAnswerRecords;
