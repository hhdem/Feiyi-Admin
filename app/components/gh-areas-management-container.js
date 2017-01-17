import Component from 'ember-component';
import computed, {equal, reads} from 'ember-computed';
import injectService from 'ember-service/inject';
import {isBlank} from 'ember-utils';
import observer from 'ember-metal/observer';
import run from 'ember-runloop';

export default Component.extend({
    classNames: ['view-container'],
    classNameBindings: ['isMobile'],

    mediaQueries: injectService(),

    areas: null,
    selectedArea: null,

    isMobile: reads('mediaQueries.maxWidth600'),
    isEmpty: equal('areas.length', 0),

    init() {
        this._super(...arguments);
        run.schedule('actions', this, this.fireMobileChangeActions);
    },

    displaySettingsPane: computed('isEmpty', 'selectedArea', 'isMobile', function () {
        let isEmpty = this.get('isEmpty');
        let selectedArea = this.get('selectedArea');
        let isMobile = this.get('isMobile');

        // always display settings pane for blank-slate on mobile
        if (isMobile && isEmpty) {
            return true;
        }

        // display list if no tag is selected on mobile
        if (isMobile && isBlank(selectedArea)) {
            return false;
        }

        // default to displaying settings pane
        return true;
    }),

    fireMobileChangeActions: observer('isMobile', function () {
        if (!this.get('isMobile')) {
            this.sendAction('leftMobile');
        }
    })
});
