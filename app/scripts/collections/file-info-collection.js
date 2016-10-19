'use strict';

var Backbone = require('backbone'),
    FileInfoModel = require('../models/file-info-model'),
    SettingsStore = require('../comp/settings-store');

var FileInfoCollection = Backbone.Collection.extend({
    model: FileInfoModel,

    initialize: function () {
    },

    load: function (cb) {
        SettingsStore.load('file-info', (data) => {
            if (data) {
                this.reset(data, {silent: true});
            }
            if (cb) {
                cb();
            }
        });
    },

    save: function () {
        SettingsStore.save('file-info', this.toJSON());
    },

    getLast: function () {
        return this.first();
    },

    getMatch: function (storage, name, path) {
        return this.find(fi => {
            return (fi.get('storage') || '') === (storage || '') &&
                (fi.get('name') || '') === (name || '') &&
                (fi.get('path') || '') === (path || '');
        });
    },

    getByName: function(name) {
        return this.find(file => file.get('name').toLowerCase() === name.toLowerCase());
    }
});

FileInfoCollection.load = function(cb) {
    var coll = new FileInfoCollection();
    coll.load(cb);
    return coll;
};

module.exports = FileInfoCollection;
