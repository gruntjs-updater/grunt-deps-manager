/*
 * grunt-deps-manager
 * https://github.com/maxleiko/grunt-deps-manager
 *
 * Copyright (c) 2014 Maxime Tricoire
 * Licensed under the LGPL-3.0 license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask('deps_manager', 'Manage project dependencies version, installation, updates', function() {
        var count = 0, deps = 0, devDeps = 0, ignoredDeps = 0, ignoredDevDeps = 0,
            updated = {}, ignored = {};

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            version: grunt.file.readJSON('package.json').version,
            pattern: ['.*'],
            ignore: [],
            logModules: false
        });

        if (!(options.pattern instanceof Array)) {
            options.pattern = [options.pattern];
        }

        if (!(options.ignore instanceof Array)) {
            options.ignore = [options.ignore];
        }

        function matches(name, patterns) {
            for (var i in patterns) {
                if (name.match(patterns[i])) {
                    return true;
                }
            }
            return false;
        }

        function depsManaging(moduleName, list) {
            for (var depName in list) {
                if (matches(depName, options.pattern)) {
                    var oldVers = list[depName];
                    if (!matches(depName, options.ignore)) {
                        // update dependency
                        list[depName] = options.version;
                        grunt.verbose.ok(depName+' '+oldVers['grey']+' >> '+list[depName]['green']);
                        deps++;
                        updated[depName] = updated[depName] || [];
                        updated[depName].push(moduleName);
                    } else {
                        // ignore dependency
                        grunt.verbose.error('Ignore: ' +depName+' '+oldVers['grey']+' >> '+list[depName]['green']);
                        ignoredDeps++;
                        ignored[depName] = ignored[depName] || [];
                        ignored[depName].push(moduleName);
                    }
                }
            }
        }

        // Iterate over all specified file groups.
        this.filesSrc.forEach(function(filepath) {
            if (filepath.indexOf('node_modules') === -1) {
                // read package.json content
                var json = grunt.file.readJSON(filepath);

                grunt.verbose.subhead('Updating '+json.name['cyan']+' package.json');
                depsManaging(json.name, json.dependencies);
                depsManaging(json.name, json.devDependencies);

                grunt.file.write(filepath, JSON.stringify(json, null, 2));
                count++;
            }
        });

        function prettyPrinter(o) {
            var array = [];
            for (var key in o) {
                array.push(key + (options.logModules ? (' ['+o[key].join(', ')+']')['grey'] : ''));
            }
            return array.join(', ');
        }

        // end result
        var updateCount = deps + devDeps;
        var ignoredCount = ignoredDeps + ignoredDevDeps;
        grunt.log.subhead('Updated to '+options.version);
        grunt.log.oklns(updateCount.toString()['cyan']+' dependenc'+(updateCount > 1 ? 'ies': 'y')+' ('+deps+' deps, '+devDeps+' devDeps)');
        grunt.log.writeln(prettyPrinter(updated));

        if (ignoredCount > 0) {
            grunt.log.subhead('Ignored:');
            grunt.log.ok(ignoredCount.toString()['magenta']+' dependenc'+(ignoredCount > 1 ? 'ies': 'y')+' ('+ignoredDeps+' deps, '+ignoredDevDeps+' devDeps)');
            grunt.log.writeln(prettyPrinter(ignored));
        }
    });

};
