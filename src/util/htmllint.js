/* eslint-disable */

var lodash = require('lodash'),
    Linter = require('htmllint/lib/linter');

/**
 * The htmllint namespace.
 * @namespace
 */
var htmllint = function () {
    var linter = htmllint.defaultLinter;

    return linter.lint.apply(linter, arguments);
};

module.exports = htmllint;

htmllint.Linter = Linter;
htmllint.rules = require('htmllint/lib/rules');
htmllint.messages = require('htmllint/lib/messages');
htmllint.defaultLinter = new Linter(htmllint.rules);
