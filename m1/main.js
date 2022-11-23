const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date: Nov 15, 2022
 * Author: Andrew Hull
 *
 */


const { unzip, readDir, grayScale } = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

const main = async () => {
    try {
        await unzip(zipFilePath, pathUnzipped);
        const files = await readDir(pathUnzipped);
        for (const file of files) {
            await grayScale(path.join(pathUnzipped, file), path.join(pathProcessed, file));
        }
    } catch (err) {
        console.log(err);
    }

    console.log("DONE");
}

main();