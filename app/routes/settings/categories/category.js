/* eslint-disable camelcase */
import AuthenticatedRoute from 'ghost-admin/routes/authenticated';

export default AuthenticatedRoute.extend({

    model(params) {
        return this.store.queryRecord('category', {slug: params.category_slug});
    },

    serialize(model) {
        return {category_slug: model.get('slug')};
    },

    // reset the model so that mobile screens react to an empty selectedTag
    deactivate() {
        this._super(...arguments);
        this.set('controller.model', null);
    }
});
