/* global key */
import Component from 'ember-component';
import Ember from 'ember';
import computed, {reads} from 'ember-computed';
import get from 'ember-metal/get';
import injectService from 'ember-service/inject';
import {htmlSafe} from 'ember-string';

import boundOneWay from 'ghost-admin/utils/bound-one-way';
import {invokeAction} from 'ember-invoke-action';

import observer from 'ember-metal/observer';

// ember-cli-shims doesn't export this
const {Handlebars} = Ember;

export default Component.extend({

    area: null,

    selectedParent: null,

    parent: boundOneWay('area.parent'),
    parentId: boundOneWay('area.parent'),

    initializeSelectedParent: observer('model', function () {
        return this.get('model.parent').then((parent) => {
            this.set('selectedParent', parent);
            return parent;
        });
    }),

    scratchName: boundOneWay('area.name'),
    scratchCode: boundOneWay('area.code'),
    scratchSlug: boundOneWay('area.slug'),
    scratchDescription: boundOneWay('area.description'),
    scratchMetaTitle: boundOneWay('area.metaTitle'),
    scratchMetaDescription: boundOneWay('area.metaDescription'),

    isViewingSubview: false,
    feature: injectService(),
    config: injectService(),
    mediaQueries: injectService(),

    isMobile: reads('mediaQueries.maxWidth600'),

    title: computed('area.isNew', function () {
        if (this.get('area.isNew')) {
            return 'New Area';
        } else {
            return 'Area Settings';
        }
    }),

    seoTitle: computed('scratchName', 'scratchMetaTitle', function () {
        let metaTitle = this.get('scratchMetaTitle') || '';

        metaTitle = metaTitle.length > 0 ? metaTitle : this.get('scratchName');

        if (metaTitle && metaTitle.length > 70) {
            metaTitle = metaTitle.substring(0, 70).trim();
            metaTitle = Handlebars.Utils.escapeExpression(metaTitle);
            metaTitle = htmlSafe(`${metaTitle}&hellip;`);
        }

        return metaTitle;
    }),

    seoURL: computed('scratchSlug', function () {
        let blogUrl = this.get('config.blogUrl');
        let seoSlug = this.get('scratchSlug') || '';

        let seoURL = `${blogUrl}/area/${seoSlug}`;

        // only append a slash to the URL if the slug exists
        if (seoSlug) {
            seoURL += '/';
        }

        if (seoURL.length > 70) {
            seoURL = seoURL.substring(0, 70).trim();
            seoURL = htmlSafe(`${seoURL}&hellip;`);
        }

        return seoURL;
    }),

    seoDescription: computed('scratchDescription', 'scratchMetaDescription', function () {
        let metaDescription = this.get('scratchMetaDescription') || '';

        metaDescription = metaDescription.length > 0 ? metaDescription : this.get('scratchDescription');

        if (metaDescription && metaDescription.length > 156) {
            metaDescription = metaDescription.substring(0, 156).trim();
            metaDescription = Handlebars.Utils.escapeExpression(metaDescription);
            metaDescription = htmlSafe(`${metaDescription}&hellip;`);
        }

        return metaDescription;
    }),

    didReceiveAttrs(attrs) {
        this._super(...arguments);

        if (get(attrs, 'newAttrs.area.value.id') !== get(attrs, 'oldAttrs.area.value.id')) {
            this.reset();
        }
    },

    reset() {
        this.set('isViewingSubview', false);
        if (this.$()) {
            this.$('.settings-menu-pane').scrollTop(0);
        }
    },

    focusIn() {
        key.setScope('area-settings-form');
    },

    focusOut() {
        key.setScope('default');
    },

    // live-query of all areas for area input autocomplete
    availableAreas: computed(function () {
        return this.get('area').store.filter('area', {limit: 'all', include: 'parent'}, () => {
            return true;
        });
    }),

    actions: {
        setProperty(property, value) {
            invokeAction(this, 'setProperty', property, value);
        },

        setCoverImage(image) {
            this.send('setProperty', 'image', image);
        },

        clearCoverImage() {
            this.send('setProperty', 'image', '');
        },

        openMeta() {
            this.set('isViewingSubview', true);
        },

        closeMeta() {
            this.set('isViewingSubview', false);
        },

        deleteArea() {
            invokeAction(this, 'showDeleteAreaModal');
        },

        changeParent(newParent) {
            let parent = this.area.get('parent');
            let newId = (!newParent)? null : newParent.get('id');

            // return if nothing changed
            if (!!parent && newId === parent.get('id')) {
                return;
            }

            this.area.set('parent', newParent);
            this.area.set('parentId', newId);

            this.area.save().catch((error) => {
                this.showError(error);
                this.set('selectedParent', parent);
                this.area.rollbackAttributes();
            });
        }
    }

});
