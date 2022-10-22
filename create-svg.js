const { optimize, loadConfig } = require("svgo");
const { readFileSync, readdirSync, writeFileSync, mkdirSync } = require("fs");
const fsExtra = require("fs-extra");

const basePartsPath = "./svg/parts";
const partsFolderNameList = ["bg", "hito", "maru", "moji", "mono"];
loadConfig().then(async (config) => {
  const folderNameFileNameListObj = {};
  for (const partsFolderName of partsFolderNameList) {
    const fileNameList = readdirSync(`${basePartsPath}/${partsFolderName}`);
    folderNameFileNameListObj[partsFolderName] = fileNameList;
  }

  /**
   * partsListWithIdObj
   *
   * { fileId: [ [folderName, parts], [folderName, parts], [folderName, parts] ] }
   *
   * ex:
   * {
   *   'bg-hito-51-maru-moji-do-mono-51': [
   *     ['bg', 'bg.svg']
   *     ['hito', 'hito.svg']
   *     ['maru', 'maru.svg']
   *     ['moji', 'moji.svg']
   *     ['mono', 'mono.svg']
   *   ]
   * }
   **/
  const partsListWithIdObj = {};
  const getParts = (index = 0, partsAry = []) => {
    const folderName = partsFolderNameList[index];
    for (const fileNameList of folderNameFileNameListObj[folderName]) {
      const newPartsAry = [...partsAry, [folderName, fileNameList]];
      if (folderNameFileNameListObj[partsFolderNameList[index + 1]]) {
        getParts(index + 1, newPartsAry);
      } else {
        const id = newPartsAry
          .map(([_, partsName]) => partsName.replace(/.svg/g, ""))
          .join("-");
        partsListWithIdObj[id] = newPartsAry;
      }
    }
  };
  getParts();

  const outputsPath = `${basePartsPath}/outputs`;
  await fsExtra.remove(outputsPath);
  mkdirSync(outputsPath);
  for (const [id, partsList] of Object.entries(partsListWithIdObj)) {
    const optimizedParts = partsList
      .map(([folderName, parts]) =>
        readFileSync(`${basePartsPath}/${folderName}/${parts}`)
      )
      .map((binary) => optimize(binary.toString(), config).data)
      .join("");
    const svg = `
      <svg width="986px" height="986px" xmlns="http://www.w3.org/2000/svg">
      ${optimizedParts}
      </svg>
    `;

    writeFileSync(`${outputsPath}/${id}.svg`, svg);
  }
});
