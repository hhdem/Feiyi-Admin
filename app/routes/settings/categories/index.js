import injectService from 'ember-service/inject';
import AuthenticatedRoute from 'ghost-admin/routes/authenticated';

export default AuthenticatedRoute.extend({
    mediaQueries: injectService(),

    beforeModel() {
        let firstCategory = this.modelFor('settings.categories').get('firstObject');

        this._super(...arguments);

        if (firstCategory && !this.get('mediaQueries.maxWidth600')) {
            this.transitionTo('settings.categories.category', firstCategory);
        }
    }
});
