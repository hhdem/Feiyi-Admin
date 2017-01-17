import AuthenticatedRoute from 'ghost-admin/routes/authenticated';

export default AuthenticatedRoute.extend({

    controllerName: 'settings.areas.area',

    model() {
        return this.store.createRecord('area');
    },

    renderTemplate() {
        this.render('settings.areas.area');
    },

    // reset the model so that mobile screens react to an empty selectedTag
    deactivate() {
        this._super(...arguments);
        this.set('controller.model', null);
    }

});
