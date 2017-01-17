import Controller from 'ember-controller';
import {alias} from 'ember-computed';
import injectService from 'ember-service/inject';
import injectController from 'ember-controller/inject';

export default Controller.extend({

    showDeleteAreaModal: false,

    area: alias('model'),
    isMobile: alias('areasController.isMobile'),

    applicationController: injectController('application'),
    areasController: injectController('settings.areas'),
    notifications: injectService(),

    _saveAreaProperty(propKey, newValue) {
        let area = this.get('area');
        let currentValue = area.get(propKey);

        if (!!newValue && newValue.trim() !== currentValue) {
            newValue = newValue.trim();
        } else {
            return;
        }

        // Quit if there was no change
        if (newValue === currentValue) {
            return;
        }

        area.set(propKey, newValue);
        // TODO: This is required until .validate/.save mark fields as validated
        area.get('hasValidated').addObject(propKey);

        area.save().then((savedArea) => {
            // replace 'new' route with 'area' route
            this.replaceRoute('settings.areas.area', savedArea);
        }).catch((error) => {
            if (error) {
                this.get('notifications').showAPIError(error, {key: 'area.save'});
            }
        });
    },

    _deleteArea() {
        let area = this.get('area');

        return area.destroyRecord().then(() => {
            this._deleteAreaSuccess();
        }, (error) => {
            this._deleteAreaFailure(error);
        });
    },

    _deleteAreaSuccess() {
        let currentRoute = this.get('applicationController.currentRouteName') || '';

        if (currentRoute.match(/^settings\.areas/)) {
            this.transitionToRoute('settings.areas.index');
        }
    },

    _deleteAreaFailure(error) {
        this.get('notifications').showAPIError(error, {key: 'area.delete'});
    },

    actions: {
        setProperty(propKey, value) {
            this._saveAreaProperty(propKey, value);
        },

        toggleDeleteAreaModal() {
            this.toggleProperty('showDeleteAreaModal');
        },

        deleteArea() {
            return this._deleteArea();
        }
    }
});
