import Controller from 'ember-controller';
import injectController from 'ember-controller/inject';
import {alias, equal, sort} from 'ember-computed';

export default Controller.extend({

    categoryController: injectController('settings.categories.category'),

    selectedTag: alias('categoryController.category'),

    categoryListFocused: equal('keyboardFocus', 'categoryList'),
    categoryContentFocused: equal('keyboardFocus', 'categoryContent'),

    // TODO: replace with ordering by page count once supported by the API
    categories: sort('model', function (a, b) {
        let idA = +a.get('id');
        let idB = +b.get('id');

        if (idA > idB) {
            return 1;
        } else if (idA < idB) {
            return -1;
        }

        return 0;
    }),

    actions: {
        leftMobile() {
            let firstTag = this.get('categories.firstObject');
            // redirect to first category if possible so that you're not left with
            // category settings blank slate when switching from portrait to landscape
            if (firstTag && !this.get('categoryController.category')) {
                this.transitionToRoute('settings.categories.category', firstTag);
            }
        }
    }

});
