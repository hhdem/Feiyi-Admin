import Controller from 'ember-controller';
import injectController from 'ember-controller/inject';
import {alias, equal, sort} from 'ember-computed';

export default Controller.extend({

    areaController: injectController('settings.areas.area'),

    selectedArea: alias('areaController.area'),

    areaListFocused: equal('keyboardFocus', 'areaList'),
    areaContentFocused: equal('keyboardFocus', 'areaContent'),

    // TODO: replace with ordering by page count once supported by the API
    areas: sort('model', function (a, b) {
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
            let firstArea = this.get('areas.firstObject');
            // redirect to first area if possible so that you're not left with
            // area settings blank slate when switching from portrait to landscape
            if (firstArea && !this.get('areaController.area')) {
                this.transitionToRoute('settings.areas.area', firstArea);
            }
        }
    }

});
