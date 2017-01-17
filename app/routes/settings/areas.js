/* global key */
import $ from 'jquery';
import AuthenticatedRoute from 'ghost-admin/routes/authenticated';
import CurrentUserSettings from 'ghost-admin/mixins/current-user-settings';
import ShortcutsRoute from 'ghost-admin/mixins/shortcuts-route';
import PaginationMixin from 'ghost-admin/mixins/pagination';

export default AuthenticatedRoute.extend(CurrentUserSettings, PaginationMixin, ShortcutsRoute, {
    titleToken: 'Settings - Areas',

    paginationModel: 'area',
    paginationSettings: {
        include: 'count.posts,count.areas,parent',
        limit: 15
    },

    shortcuts: {
        'up, k': 'moveUp',
        'down, j': 'moveDown',
        left: 'focusList',
        right: 'focusContent',
        c: 'newArea'
    },

    beforeModel() {
        this._super(...arguments);

        return this.get('session.user')
            .then(this.transitionAuthor());
    },

    model(params, transition) {
        return this.loadFirstPage(transition).then(() => {
            return this.store.filter('area', (area) => {
                return !area.get('isNew');
            });
        });
    },

    deactivate() {
        this._super(...arguments);
        this.send('resetShortcutsScope');
        this.send('resetPagination');
    },

    stepThroughAreas(step) {
        let currentArea = this.modelFor('settings.areas.area');
        let areas = this.get('controller.areas');
        let length = areas.get('length');

        if (currentArea && length) {
            let newPosition = areas.indexOf(currentArea) + step;

            if (newPosition >= length) {
                return;
            } else if (newPosition < 0) {
                return;
            }

            this.transitionTo('settings.areas.area', areas.objectAt(newPosition));
        }
    },

    scrollContent(amount) {
        let content = $('.area-settings-pane');
        let scrolled = content.scrollTop();

        content.scrollTop(scrolled + 50 * amount);
    },

    actions: {
        moveUp() {
            if (this.controller.get('areaContentFocused')) {
                this.scrollContent(-1);
            } else {
                this.stepThroughAreas(-1);
            }
        },

        moveDown() {
            if (this.controller.get('areaContentFocused')) {
                this.scrollContent(1);
            } else {
                this.stepThroughAreas(1);
            }
        },

        focusList() {
            this.set('controller.keyboardFocus', 'areaList');
        },

        focusContent() {
            this.set('controller.keyboardFocus', 'areaContent');
        },

        newArea() {
            this.transitionTo('settings.areas.new');
        },

        resetShortcutsScope() {
            key.setScope('default');
        }
    }
});
