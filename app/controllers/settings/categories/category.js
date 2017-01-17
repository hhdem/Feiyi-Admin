import Controller from 'ember-controller';
import {alias} from 'ember-computed';
import injectService from 'ember-service/inject';
import injectController from 'ember-controller/inject';

export default Controller.extend({

    showDeleteCategoryModal: false,

    category: alias('model'),
    isMobile: alias('categoriesController.isMobile'),

    applicationController: injectController('application'),
    categoriesController: injectController('settings.categories'),
    notifications: injectService(),

    _saveCategoryProperty(propKey, newValue) {
        let category = this.get('category');
        let currentValue = category.get(propKey);

        if (!!newValue && newValue.trim() !== currentValue) {
            newValue = newValue.trim();
        } else {
            return;
        }

        // Quit if there was no change
        if (newValue === currentValue) {
            return;
        }

        category.set(propKey, newValue);
        // TODO: This is required until .validate/.save mark fields as validated
        category.get('hasValidated').addObject(propKey);

        category.save().then((savedCategory) => {
            // replace 'new' route with 'category' route
            this.replaceRoute('settings.categories.category', savedCategory);
        }).catch((error) => {
            if (error) {
                this.get('notifications').showAPIError(error, {key: 'category.save'});
            }
        });
    },

    _deleteCategory() {
        let category = this.get('category');

        return category.destroyRecord().then(() => {
            this._deleteCategorySuccess();
        }, (error) => {
            this._deleteCategoryFailure(error);
        });
    },

    _deleteCategorySuccess() {
        let currentRoute = this.get('applicationController.currentRouteName') || '';

        if (currentRoute.match(/^settings\.categories/)) {
            this.transitionToRoute('settings.categories.index');
        }
    },

    _deleteCategoryFailure(error) {
        this.get('notifications').showAPIError(error, {key: 'category.delete'});
    },

    actions: {
        setProperty(propKey, value) {
            this._saveCategoryProperty(propKey, value);
        },

        toggleDeleteCategoryModal() {
            this.toggleProperty('showDeleteCategoryModal');
        },

        deleteCategory() {
            return this._deleteCategory();
        }
    }
});
