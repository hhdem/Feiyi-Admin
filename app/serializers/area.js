/* eslint-disable camelcase */
import Ember from 'ember';
import ApplicationSerializer from 'ghost-admin/serializers/application';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

const {String: {pluralize}} = Ember;

export default ApplicationSerializer.extend(EmbeddedRecordsMixin, {
    attrs: {
        createdAtUTC: {key: 'created_at'},
        updatedAtUTC: {key: 'updated_at'},
        parent: {embedded: 'always'}
    },

    normalize(model, hash, prop) {
        // this is to enable us to still access the raw authorId
        // without requiring an extra get request (since it is an
        // async relationship).
        if ((prop === 'area' || prop === 'areas') && !!hash.parent && !!hash.parent.id) {
            hash.parent_id = hash.parent.id;
        } else {
            delete hash.parent;
            delete hash.parent_id;
        }

        return this._super(model, hash, prop);
    },

    normalizeSingleResponse(store, primaryModelClass, payload) {
        let root = this.keyForAttribute(primaryModelClass.modelName);
        let pluralizedRoot = pluralize(primaryModelClass.modelName);

        if (payload[pluralizedRoot]) {
            payload[root] = payload[pluralizedRoot][0];
            delete payload[pluralizedRoot];
        }

        return this._super(store, primaryModelClass, payload);
    },

    normalizeArrayResponse() {
        return this._super(...arguments);
    },

    serialize(record, options) {
        let json = {};

        record.eachAttribute(function(name) {
            json[name.underscore()] = record.attr(name);
        });

        if (options && options.includeId) {
            json.id = record.id;
        }

        return json;
    },

    serializeBelongsTo(snapshot, json, relationship) {
        let key = relationship.key;

        let belongsTo = snapshot.belongsTo(key);

        json[key] = Ember.isNone(belongsTo) ? belongsTo : belongsTo.record.toJSON();
    },

    serializeIntoHash(hash, type, record, options) {
        options = options || {};
        options.includeId = true;

        // We have a plural root in the API
        let root = pluralize(type.modelName);
        let data = this.serialize(record, options);

        hash[root] = [data];
    }
});
