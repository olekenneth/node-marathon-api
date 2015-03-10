/*global console, module*/
var request = require('request-promise');
var _ = require('underscore');

var Marathon = function(options) {
    'use strict';

        if (!options.baseUrl) {
            throw new Error('Need baseUrl to be set');
        }
        this.marathonUrl = options.baseUrl;
        this.marathonUrl += '/v2';

        if (!options.appId) {
            throw new Error('Need appId to be set');
        }
        this.appId = options.appId;
};

Marathon.prototype.getGroupId = function() {
    'use strict';

    return this.appId.split('/')[1];
};

Marathon.prototype.getInstancesInGroup = function(groupId, success) {
    'use strict';

    request({
        url:  this.marathonUrl + '/groups/' + groupId,
        json: true
    })
        .then(function(json) { return json.apps; })
        .map(function getAllTasksForEachAppId(app) {
            return request({
                url:  this.marathonUrl + '/apps' + app.id + '/tasks',
                json: true
            }).then(function(json) { return json.tasks; });
        }.bind(this))
        .then(function(tasks) {
            return _.flatten(tasks, true);
        })
        .each(function checkIfTaskIsAlive(task) {
            if (!_.contains(_.pluck(task.healthCheckResults, 'alive'), false)) {
                return task;
            }
        })
        .map(function(task) {
            return {
                host:  task.host,
                ports: task.ports
            };
        })
        .then(function(instances) { success(false, instances); })
        .catch(function(err) { return success(err); })
        .error(function(err) { return success(err.message); });
};

module.exports = Marathon;
