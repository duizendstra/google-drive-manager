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
                pageSize: 500
             };

            if (specs.q) {
                request.q = specs.q;
            }

            if (specs.fields) {
                request.fields = specs.fields;
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
                    if (fileSet.length % 5000 === 0) {
                        console.log("working:fetched %d files for %s", fileSet.length, specs.user);
                    }

                    if (files.length === 0) {
                        console.log("done:fetched %d files for %s", fileSet.length, specs.user);
                        resolve(fileSet);
                        return;
                    }
                    if (!response.nextPageToken) {
                        resolve(fileSet);
                        console.log("done:fetched %d files for %s", fileSet.length, specs.user);

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