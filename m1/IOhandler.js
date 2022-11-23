// /*
//  * Project: Milestone 1
//  * File Name: IOhandler.js
//  * Description: Collection of functions for files input/output related operations
//  *
//  * Created Date: November 10
//  * Author: Andrew Hull
//  *
//  */
// // Download the starter files folder. Within it, you will find a zip file containing several PNG images, a file called main.js, and a file called ioHandler.js. You must do the following:


// // (1) In ioHandler.js, create a function to unzip the zip file using the "unzipper" library.

// const fs = require("fs").promises;
// const { createReadStream, createWriteStream } = require("fs");
// const unzipper = require("unzipper")

// createReadStream('/myfile.zip')
//   .pipe(unzipper.Extract({ path: '/instagram_app' }));
// PNG = require("pngjs").PNG,
//   path = require("path");



// //   (2) Show the message: "Extraction operation complete", but only after all files are unzipped

// // The unzipping operation should create a directory called unzipped with all your images in it. 

// // Note: Be careful. MacOS often will add hidden files into directories (like .DS_Store) or __MACOSX. You might need to keep this in mind when you are working with folders.
// /**
//  * Description: decompress file from given pathIn, write to given pathOut
//  *
//  * @param {string} pathIn
//  * @param {string} pathOut
//  * @return {promise}
//  */
// const unzip = (pathIn, pathOut) => { };




// // (3) Create another function in ioHandler.js called readDir. It will take in a directory path as a parameter, and will give back an array of file paths for all the png files that exist in that directory. 
// /**
//  * Description: read all the png files from given directory and return Promise containing array of each png file path
//  *
//  * @param {string} path
//  * @return {promise}
//  */
// const readDir = (dir) => { };





// // (4) Create another function in ioHandler.js called grayScale which takes two parameters: pathIn and pathOut. pathIn should represent the path to a png image and pathOut represents the output path where your grayscaled image should be placed. This function should do the following:
// /**
//  * Description: Read in png file by given pathIn,
//  * convert to grayscale and write to given pathOut
//  *
//  * @param {string} filePath
//  * @param {string} pathProcessed
//  * @return {promise}
//  */
// const grayScale = (pathIn, pathOut) => { };

// module.exports = {
//   unzip,
//   readDir,
//   grayScale,
// };
// // Use the PNGJS library to parse the pathIn image. This library gives you an array of

// // pixels representing the PNG image you passed it. Once you have access to this array of pixels, you must:

// // (1) Loop through the pixel array, modifying the RGB values to create a grayscale filter effect

// // (2) Save the modified pixel array into a new PNG image which should be written to your pathOut directory.







/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Nov 15, 2022
 * Author: Andrew Hull
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs").promises,
  PNG = require("pngjs").PNG,
  path = require("path");
const { pipeline, Transform } = require("stream");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    pipeline(
      fs.createReadStream(pathIn),
      unzipper.Extract({ path: pathOut }),
      (err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
      }
    )
      .on("close", () => {
        resolve()
      });
  });

};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return fsp.readdir(dir).then((files) => files.filter(v => v.endsWith(".png")));
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const errHandler = (err) => {
      if (err) {
        reject(err);
      }
    }

    const p = new PNG();
    p.on("parsed", (data) => {
      for (var y = 0; y < p.height; y++) {
        for (var x = 0; x < p.width; x++) {
          const idx = (p.width * y + x) << 2;
          const R = data[idx],
            G = data[idx + 1],
            B = data[idx + 2];
          const gray = (R + G + B) / 3;
          data[idx] = gray;
          data[idx + 1] = gray;
          data[idx + 2] = gray;
        }
      }
      p.pack().pipe(fs.createWriteStream(pathOut))
        .on("finish", resolve)
        .on("err", errHandler)
    });

    pipeline(
      fs.createReadStream(pathIn),
      p,
      errHandler
    );
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};