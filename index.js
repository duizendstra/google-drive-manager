var google = require('googleapis');

function googleDriveManager(mainSpecs) {
    "use strict";
    var auth;
    var service = google.drive('v3');

    function getFiles(specs) {

        return new Promise(function (resolve, reject) {
            var fileSet = [];
            var request = {
                auth: auth,
                pageSize: 100,
                fields: "nextPageToken, files(id, name, permissions, mimeType, trashed)"
            };
            if (specs.q) {
                request.q = specs.q;
            }

            function listFiles(pageToken) {
                if (pageToken) {
                    request.pageToken = pageToken;
                }
                service.files.list(request, function (err, response) {
                    if (err) {
                        reject('The API returned an error: ' + err);
                        return;
                    }
                    var files = response.files;
                    files.forEach(function (file) {
                        fileSet.push(file);
                    });
                    if (files.length === 0) {
                        resolve(fileSet);
                        return;
                    }
                    if (!response.nextPageToken) {
                        resolve(fileSet);
                        return;
                    }
                    listFiles(response.nextPageToken);
                });
            }
            listFiles();
        });
    }

    auth = mainSpecs.auth;
    return {
        getFiles: getFiles
    };
}

module.exports = googleDriveManager;