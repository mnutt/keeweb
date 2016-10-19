'use strict';

var Logger = require('../util/logger');

var logger = new Logger('settings');

var SettingsStore = {
    fileName: function(key) {
        return key + '.json';
    },

    load: function(key, cb) {
        key = key || 'db';
        $.ajax({
            type: 'GET',
            url: '/webdav/' + key,
            success: function(data) {
                try {
                    cb(data ? JSON.parse(data) : undefined);
                } catch (e) {
                    logger.error('Error loading database', key, e);
                }
            },
            error: function(data) {
                logger.error('Error loading database');
            }
        });
    },

    save: function(key, data, cb) {
        logger.info('saving...');
        key = key || 'db';
        $.ajax({
            type: 'PUT',
            url: '/webdav/' + key,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(data) {
                if (cb) { cb(data); }
            },
            error: function(data) {
                logger.error('Error saving database', data);
            }
        });
    }
};

module.exports = SettingsStore;
