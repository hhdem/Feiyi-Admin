import Mirage from 'ember-cli-mirage';
import {isBlank} from 'ember-utils';
import {paginatedResponse} from '../utils';

export default function mockCategories(server) {
    server.post('/categories/', function (db, request) {
        let [attrs] = JSON.parse(request.requestBody).categories;
        let category;

        if (isBlank(attrs.slug) && !isBlank(attrs.name)) {
            attrs.slug = attrs.name.dasherize();
        }

        // NOTE: this does not use the category factory to fill in blank fields
        category = db.categories.insert(attrs);

        return {
            category
        };
    });

    server.get('/categories/', function (db, request) {
        let response = paginatedResponse('categories', db.categories, request);
        // TODO: remove post_count unless requested?
        return response;
    });

    server.get('/categories/slug/:slug/', function (db, request) {
        let [category] = db.categories.where({slug: request.params.slug});

        // TODO: remove post_count unless requested?

        return {
            category
        };
    });

    server.put('/categories/:id/', function (db, request) {
        let {id} = request.params;
        let [attrs] = JSON.parse(request.requestBody).categories;
        let record = db.categories.update(id, attrs);

        return {
            category: record
        };
    });

    server.del('/categories/:id/', function (db, request) {
        db.categories.remove(request.params.id);

        return new Mirage.Response(204, {}, {});
    });
}
