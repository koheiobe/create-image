const { readFileSync, readdirSync } = require("fs");
const { optimize, loadConfig } = require("svgo");
const { generateAnswerSVG } = require("./svg-generator");

/**
 * @param basePartsPath "./svg/parts"
 * @param partsFolderNameList ["bg", "hito", "maru", "moji", "mono"]
 *
 * @return {
 *   "bg": ["filename", "filename"...],
 *   "hito": ["filename", "filename"...],
 *   "maru": ["filename", "filename"...],
 *   "moji": ["filename", "filename"...],
 *   "mono": ["filename", "filename"...]
 * }
 */
const getPartsList = (basePartsPath, partsFolderNameList) => {
  const folderNameFileNameListObj = {};
  for (const partsFolderName of partsFolderNameList) {
    const fileNameList = readdirSync(`${basePartsPath}/${partsFolderName}`);
    folderNameFileNameListObj[partsFolderName] = fileNameList;
  }
  return folderNameFileNameListObj;
};

/**
 *
 * @param {*} records {
 *   ID: string,
 *   partsName: string
 *   ...
 *   answer: string
 * }[]
 *
 * @return {
 *   'bg-hito-51-maru-moji-do-mono-51': [
 *     ['bg', 'bg.svg']
 *     ['hito', 'hito.svg']
 *     ['maru', 'maru.svg']
 *     ['moji', 'moji.svg']
 *     ['mono', 'mono.svg']
 *   ]
 * }
 */
const fromCsvRecordToSeed = (records, svgPartsFolderNameList) => {
  const seed = {};
  for (const record of records) {
    seed[record.ID] = [];
    for (const [key, value] of Object.entries(record)) {
      if (svgPartsFolderNameList.includes(key)) {
        seed[record.ID] = [...seed[record.ID], [key, value]];
      }
    }
  }
  return seed;
};

/**
 *
 * @param {*} records {
 *   ID: string,
 *   partsName: string
 *   ...
 *   answer: string
 * }[]
 *
 * @return {
 *   'bg-hito-51-maru-moji-do-mono-51': [
 *     ['bg', 'bg.svg']
 *     ['hito', 'hito.svg']
 *     ['maru', 'maru.svg']
 *     ['moji', 'moji.svg']
 *     ['mono', 'mono.svg']
 *   ]
 * }
 */
const fromCsvRecordToSeedWithAnswer = (records) => {
  const seed = {};
  records;
  for (const record of records) {
    seed[record.ID] = [];
    for (const [key, value] of Object.entries(record)) {
      if (key !== "ID" && key !== "maru" && key !== "moji") {
        seed[record.ID] = [...seed[record.ID], [key, value]];
      }
    }
  }
  return seed;
};

/**
 * @param folderNameFileNameListObj = {
 *   "bg": ["filename", "filename"...],
 *   "hito": ["filename", "filename"...],
 *   "maru": ["filename", "filename"...],
 *   "moji": ["filename", "filename"...],
 *   "mono": ["filename", "filename"...]
 * }
 *
 * @return {
 *   'bg-hito-51-maru-moji-do-mono-51': [
 *     ['bg', 'bg.svg']
 *     ['hito', 'hito.svg']
 *     ['maru', 'maru.svg']
 *     ['moji', 'moji.svg']
 *     ['mono', 'mono.svg']
 *   ]
 * }
 **/
const generateSVGSeedByRoundRobin = (folderNameFileNameListObj) => {
  const seed = {};
  const partsFolderNameList = Object.keys(folderNameFileNameListObj);
  const getParts = (index = 0, partsAry = []) => {
    const folderName = partsFolderNameList[index];
    for (const fileNameList of folderNameFileNameListObj[folderName]) {
      const newPartsAry = [...partsAry, [folderName, fileNameList]];
      if (folderNameFileNameListObj[partsFolderNameList[index + 1]]) {
        getParts(index + 1, newPartsAry);
      } else {
        const id = newPartsAry
          .map(([_, partsName]) => partsName.replace(/(.svg|.png)/, ""))
          .join("-");
        seed[id] = newPartsAry;
      }
    }
  };
  getParts();
  return seed;
};

/**
 * @param basePartsPath "./svg/parts"
 * @param seed {
 *   'bg-hito-51-maru-moji-do-mono-51': [
 *     ['bg', 'bg.svg']
 *     ['hito', 'hito.svg']
 *     ['maru', 'maru.svg']
 *     ['moji', 'moji.svg']
 *     ['mono', 'mono.svg']
 *   ]
 * }
 *
 * @return <svg ... ></svg>
 **/
const generateSVGFromSeed = async (basePartsPath, seed) => {
  config = await loadConfig();
  return Object.entries(seed)
    .map(([id, partsList]) => [
      id,
      partsList
        .map(([folderName, parts]) => {
          console.log(`reading ${basePartsPath}/${folderName}/${parts}`);
          return folderName === "answer"
            ? generateAnswerSVG(parts)
            : readFileSync(`${basePartsPath}/${folderName}/${parts}`);
        })
        .map((binary) => optimize(binary.toString(), config).data)
        .join(""),
    ])
    .map(([id, svg]) => [
      id,
      `
      <svg width="986px" height="986px" xmlns="http://www.w3.org/2000/svg">
      ${svg}
      </svg>
    `,
    ]);
};

module.exports.getPartsList = getPartsList;
module.exports.generateSVGSeedByRoundRobin = generateSVGSeedByRoundRobin;
module.exports.generateSVGFromSeed = generateSVGFromSeed;
module.exports.fromCsvRecordToSeed = fromCsvRecordToSeed;
module.exports.fromCsvRecordToSeedWithAnswer = fromCsvRecordToSeedWithAnswer;
