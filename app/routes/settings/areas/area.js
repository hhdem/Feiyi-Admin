/* eslint-disable camelcase */
import AuthenticatedRoute from 'ghost-admin/routes/authenticated';

export default AuthenticatedRoute.extend({

    model(params) {
        return this.store.queryRecord('area', {slug: params.area_slug, include: 'parent'});
    },

    serialize(model) {
        return {area_slug: model.get('slug')};
    },

    // reset the model so that mobile screens react to an empty selectedArea
    deactivate() {
        this._super(...arguments);
        this.set('controller.model', null);
    }
});
