/* global key */
import $ from 'jquery';
import AuthenticatedRoute from 'ghost-admin/routes/authenticated';
import CurrentUserSettings from 'ghost-admin/mixins/current-user-settings';
import ShortcutsRoute from 'ghost-admin/mixins/shortcuts-route';
import PaginationMixin from 'ghost-admin/mixins/pagination';

export default AuthenticatedRoute.extend(CurrentUserSettings, PaginationMixin, ShortcutsRoute, {
    titleToken: 'Settings - Categories',

    paginationModel: 'category',
    paginationSettings: {
        include: 'count.posts',
        limit: 15
    },

    shortcuts: {
        'up, k': 'moveUp',
        'down, j': 'moveDown',
        left: 'focusList',
        right: 'focusContent',
        c: 'newCategory'
    },

    beforeModel() {
        this._super(...arguments);

        return this.get('session.user')
            .then(this.transitionAuthor());
    },

    model(params, transition) {
        return this.loadFirstPage(transition).then(() => {
            return this.store.filter('category', (category) => {
                return !category.get('isNew');
            });
        });
    },

    deactivate() {
        this._super(...arguments);
        this.send('resetShortcutsScope');
        this.send('resetPagination');
    },

    stepThroughCategories(step) {
        let currentCategory = this.modelFor('settings.categorys.category');
        let categorys = this.get('controller.categorys');
        let length = categorys.get('length');

        if (currentCategory && length) {
            let newPosition = categorys.indexOf(currentCategory) + step;

            if (newPosition >= length) {
                return;
            } else if (newPosition < 0) {
                return;
            }

            this.transitionTo('settings.categorys.category', categorys.objectAt(newPosition));
        }
    },

    scrollContent(amount) {
        let content = $('.category-settings-pane');
        let scrolled = content.scrollTop();

        content.scrollTop(scrolled + 50 * amount);
    },

    actions: {
        moveUp() {
            if (this.controller.get('categoryContentFocused')) {
                this.scrollContent(-1);
            } else {
                this.stepThroughCategories(-1);
            }
        },

        moveDown() {
            if (this.controller.get('categoryContentFocused')) {
                this.scrollContent(1);
            } else {
                this.stepThroughCategories(1);
            }
        },

        focusList() {
            this.set('controller.keyboardFocus', 'categoryList');
        },

        focusContent() {
            this.set('controller.keyboardFocus', 'categoryContent');
        },

        newCategory() {
            this.transitionTo('settings.categories.new');
        },

        resetShortcutsScope() {
            key.setScope('default');
        }
    }
});
