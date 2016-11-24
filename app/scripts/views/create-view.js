'use strict';

var Backbone = require('backbone'),
    Keys = require('../const/keys'),
    FeatureDetector = require('../util/feature-detector'),
    FileModel = require('../models/file-model'),
    Storage = require('../storage'),
    SecureInput = require('../comp/secure-input');

var CreateView = Backbone.View.extend({
    template: require('templates/create.hbs'),

    events: {
        'keydown  .open__setpass-input': 'inputSetPassKeyDown',
        'keydown  .open__setpassconfirm-input': 'inputSetPassConfirmKeyDown',
        'click    .open__pass-enter-btn': 'createDb'
    },

    views: null,
    input: null,
    confirmInput: null,
    busy: false,

    initialize: function () {
        this.views = {};
        this.input = new SecureInput();
        this.confirmInput = new SecureInput();
    },

    render: function () {
        var a = console; a.log('render');
        this.renderTemplate({});
        this.inputEl = this.$el.find('.open__setpass-input');
        this.confirmInputEl = this.$el.find('.open__setpassconfirm-input');

        this.input.setElement(this.inputEl);
        this.confirmInput.setElement(this.confirmInputEl);

        return this;
    },

    focusInput: function () {
        if (!FeatureDetector.isMobile) {
            this.inputEl.focus();
        }
    },

    inputSetPassKeyDown: function(e) {
        var code = e.keyCode || e.which;
        if (code === Keys.DOM_VK_RETURN) {
            this.$el.find('.open__setpassconfirm-input').focus();
        } else if (code === Keys.DOM_VK_CAPS_LOCK) {
            this.toggleCapsLockWarning(false);
        }
    },

    inputSetPassConfirmKeyDown: function(e) {
        var code = e.keyCode || e.which;
        if (code === Keys.DOM_VK_RETURN) {
            this.saveMasterPassword();
        } else if (code === Keys.DOM_VK_CAPS_LOCK) {
            this.toggleCapsLockWarning(false);
        }
    },

    saveMasterPassword: function() {
        var file = new FileModel({
            id: this.model.fileInfos.getLast().id,
            name: 'db'
        });

        file.create('db');
        var password = this.input.value;
        file.setPassword(password);
        this.model.addFile(file);

        file.getData((data, err) => {
            if (err) { var a = console; a.log(err); }

            Storage.webdav._request({
                op: 'Save',
                method: 'PUT',
                path: '/webdav/db.kdbx',
                data: data,
                nostat: true
            }, (err, xhr, stat) => {
                if (err) { var a = console; a.log(err); return; }

                this.model.syncFile(file, {
                    storage: 'webdav',
                    path: '/webdav/db.kdbx',
                    modified: true,
                    dirty: true,
                    syncDate: new Date('2011-01-01'),
                    name: 'db'
                }, (err) => {
                    if (err) {
                        var a = console;
                        a.log(err);
                    }

                    this.model.settings.set('firstRun', false);
                    this.trigger('close');
                });
            });
        });
    }
});

module.exports = CreateView;
