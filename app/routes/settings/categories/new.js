import AuthenticatedRoute from 'ghost-admin/routes/authenticated';

export default AuthenticatedRoute.extend({

    controllerName: 'settings.categories.category',

    model() {
        return this.store.createRecord('category');
    },

    renderTemplate() {
        this.render('settings.categories.category');
    },

    // reset the model so that mobile screens react to an empty selectedTag
    deactivate() {
        this._super(...arguments);
        this.set('controller.model', null);
    }

});
