// /*
//  * Project: Milestone 2
//  * File Name: controller.js
//  *
//  * Created Date: November 15
//  * Author: Andrew Hull
//  *
//  */
const fs = require("fs");
const { DEFAULT_HEADER } = require("./util/util");
const path = require("path");
var qs = require("querystring");
const ejs = require("ejs");
const { getUsers, getDetails, getUserDetails, addPhoto } = require("./database");
const { parse } = require("url");
const formidable = require("formidable");
const { pipeline } = require("stream");
const views = path.join(__dirname, "views");
const photos = path.join(__dirname, "photos");

const controller = {
    getFormPage: (request, response) => {
        return response.end(str);
    },
    sendFormData: (request, response) => {
        var body = "";

        request.on("data", function (data) {
            body += data;
        });

        request.on("end", function () {
            var post = qs.parse(body);
            console.log(post);
        });
    },

    getFeed: (request, response) => {
        const { query } = parse(request.url, true);
        const redirect = () => {
            response.writeHead(302, {
                location: "/404"
            });
            response.end();
        }

        if (!query.username) {
            return redirect();
        }

        const user = getUserDetails(query.username);
        if (!user) {
            return redirect();
        }
        ejs.renderFile(path.join(views, "feed.ejs"), { user: user }, {}).then(str => response.end(str));
    },

    uploadImages: (request, response) => {
        const redirect = (success) => {
            response.writeHead(302, {
                location: `/?done=${success}`
            });
            response.end();
        }

        const form = formidable({});

        form.parse(request, (err, field, files) => {
            if (err) {
                console.log(err);
                return redirect(false);
            }

            const { username } = field;
            const file = files.file;
            if (username) {

                const newFilename = `${file.newFilename}.${file.mimetype.split("/")[1]}`
                const writePath = path.join(photos, username, newFilename);

                pipeline(
                    fs.createReadStream(file.filepath),
                    fs.createWriteStream(writePath),
                    async (err) => {
                        if (err) {
                            console.log(err);
                            redirect(false);
                        } else {
                            await addPhoto(username, newFilename);
                            redirect(true);
                        }
                    }
                )
            }

        });
    },

    getHomePage: (request, response) => {
        const users = getUsers().map(v => getDetails(v));

        const { query } = parse(request.url, true);
        ejs.renderFile(path.join(views, "home.ejs"), { users: users, doneUpload: query.done }, {}).then(str => response.end(str));
    },
};

module.exports = controller;
