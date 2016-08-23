'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');

function Sizeable(item, ignoreRegExp, callback) {
    if (!callback) {
        callback = ignoreRegExp;
        ignoreRegExp = null;
    }

    if (ignoreRegExp && ignoreRegExp.test(item)) {
        return callback(null, 0);
    }

    fs.lstat(item, function lstat(e, stats) {
        var result = {
            size: !e ? (stats.size || 0) : 0
        };

        if (!e && stats.isDirectory()) {
            result.folder = item;
            result.subfolders = [];

            fs.readdir(item, function readdir(err, list) {
                if (err) {
                    return callback(err);
                }

                async.forEach(
                    list,
                    function iterate(dirItem, next) {
                        Sizeable(
                            path.join(item, dirItem),
                            ignoreRegExp,
                            function readSize(error, size, details) {
                                if (!error && details) {
                                    result.size += size;
                                    result.subfolders.push(details);
                                }
                                next(error);
                            }
                        );
                    },
                    function done(finalErr) {
                        callback(finalErr, result.size, result);
                    }
                );
            });
        } else {
            result.file = item;
            callback(e, result.size, result);
        }
    });
}

Sizeable.toKb = function toKb(size) {
    return (size / 1024).toFixed(2);
}

Sizeable.toMb = function toMb(size) {
    return (size / 1024 / 1024).toFixed(2);
}

Sizeable.toGb = function toGb(size) {
    return (size / 1024 / 1024 / 1024).toFixed(2);
}

Sizeable.toTb = function toTb(size) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2);
}

Sizeable.toFormat = function toFormat(size, format) {
    switch (format.toLowerCase()) {
        case 'b':
            return size;
        case 'tb':
            return Sizeable.toTb(size);
        case 'gb':
            return Sizeable.toGb(size);
        case 'kb':
            return Sizeable.toKb(size);
        case 'mb':
        default:
            return Sizeable.toMb(size);
    }
}

Sizeable.detailsSizeTo = function detailsSizeTo(details, format, callback) {
    details.size = Sizeable.toFormat(details.size, format);

    if (details.subfolders) {
        async.forEach(
            details.subfolders,
            function iterate(detail, next) {
                Sizeable.detailsSizeTo(detail, format, next);
            },
            function done(err) {
                callback(err, details);
            }
        );
    } else {
        callback(null, details);
    }
}

Sizeable.sortDetailsBySize = function sortDetailsBySize(details, callback) {
    if (details.subfolders) {
        async.sortBy(
            details.subfolders,
            function iterate(detail, next) {
                Sizeable.sortDetailsBySize(detail, function(err, details) {
                    next(null, details.size);
                });
            },
            function done(err, result) {
                details.subfolders = result;

                callback(err, details);
            }
        );
    } else {
        callback(null, details);
    }
}

module.exports = Sizeable;
