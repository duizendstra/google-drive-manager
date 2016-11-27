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

    function createFile(specs) {
        return new Promise(function (resolve, reject) {
            var name = specs.name;
            var mimeType = specs.mimeType;
            var parents = specs.parents;
            var request = {
                auth: auth,
                resource: {
                    name: name,
                    mimeType: mimeType,
                    parents: parents
                }
            };

            if (specs.fields) {
                request.fields = specs.fields;
            }

            service.files.create(request, function (err, response) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(response);
            });
        });
    }

    function copy(specs) {

        return new Promise(function (resolve, reject) {
            var fileId = specs.fileId;
            var request = {
                auth: auth,
                fileId: fileId
            };

            if (specs.fields) {
                request.fields = specs.fields;
            }

            service.files.copy(request, function (err, response) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(response);
            });
        });
    }

    function addParents(specs) {
        return new Promise(function (resolve, reject) {
            var fileId = specs.fileId;
            var newParents = specs.newParents;
            var request = {
                auth: auth,
                fileId: fileId,
                resource: {
                    addParents: newParents
                }
            };

            if (specs.fields) {
                request.fields = specs.fields;
            }

            service.files.copy(request, function (err, response) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(response);
            });
        });
    }

    function getPermissions(specs) {
        return new Promise(function (resolve, reject) {
            var fileId = specs.fileId;
            var request = {
                auth: auth,
                fileId: fileId
            };

            if (specs.fields) {
                request.fields = specs.fields;
            }

            service.permissions.list(request, function (err, response) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(response);
            });
        });
    }

    function addPermission(specs) {
        return new Promise(function (resolve, reject) {
            var fileId = specs.fileId;
            var permissionId = specs.permissionId;
            var transferOwnership = specs.transferOwnership;
            var role = specs.role;
            var emailAddress = specs.emailAddress;
            var type = specs.type;
            var request = {
                auth: auth,
                fileId: fileId,
                permissionId: permissionId,
                transferOwnership: transferOwnership,
                resource: {
                    role: role,
                    emailAddress: emailAddress,
                    type: type
                }
            };

            if (specs.fields) {
                request.fields = specs.fields;
            }

            service.permissions.create(request, function (err, response) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(response);
            });
        });
    }


    function updatePermission(specs) {
        return new Promise(function (resolve, reject) {
            var fileId = specs.fileId;
            var permissionId = specs.permissionId;
            var transferOwnership = specs.transferOwnership;
            var role = specs.role;
            var request = {
                auth: auth,
                fileId: fileId,
                permissionId: permissionId,
                transferOwnership: transferOwnership,
                resource: {
                    role: role
                }
            };

            if (specs.fields) {
                request.fields = specs.fields;
            }

            service.permissions.update(request, function (err, response) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(response);
            });
        });
    }


    auth = mainSpecs.auth;
    return {
        getFiles: getFiles,
        copy: copy,
        getPermissions: getPermissions,
        updatePermission: updatePermission,
        addPermission: addPermission,
        createFile: createFile,
        addParents: addParents
    };
}

module.exports = googleDriveManager;