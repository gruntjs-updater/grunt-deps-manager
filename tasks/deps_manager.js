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
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            version: grunt.file.readJSON('package.json').version,
            pattern: ['.*']
        });

        if (!(options.pattern instanceof Array)) {
            options.pattern = [options.pattern];
        }

        function matches(name, patterns) {
            for (var i in patterns) {
                if (name.match(patterns[i])) {
                    return true;
                }
            }
            return false;
        }

        // Iterate over all specified file groups.
        var count = 0, deps = 0, devDeps = 0;
        this.filesSrc.forEach(function(filepath) {
            if (filepath.indexOf('node_modules') === -1) {
                // read package.json content
                var json = grunt.file.readJSON(filepath);

                grunt.verbose.subhead('Updating '+json.name['cyan']+' package.json');
                var depName, oldVers;
                for (depName in json.dependencies) {
                    if (matches(depName, options.pattern)) {
                        // update dependency
                        oldVers = json.dependencies[depName];
                        json.dependencies[depName] = options.version;
                        grunt.verbose.ok(depName+' '+oldVers['grey']+' >> '+json.dependencies[depName]['green']);
                        deps++;
                    }
                }

                for (depName in json.devDependencies) {
                    if (matches(depName, options.pattern)) {
                        // update devDependency
                        oldVers = json.devDependencies[depName];
                        json.devDependencies[depName] = options.version;
                        grunt.verbose.ok(depName+' '+oldVers['grey']+' >> '+json.devDependencies[depName]['green']);
                        devDeps++;
                    }
                }

                grunt.file.write(filepath, JSON.stringify(json, null, 2));
                count++;
            }
        });
        grunt.log.ok(deps.toString()['cyan'] + ' dependencies updated to '+options.version.bold);
        grunt.log.ok(devDeps.toString()['cyan'] + ' devDependencies updated to '+options.version.bold);
    });

};
