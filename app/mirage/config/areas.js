import Mirage from 'ember-cli-mirage';
import {isBlank} from 'ember-utils';
import {paginatedResponse} from '../utils';

export default function mockAreas(server) {
    server.post('/areas/', function (db, request) {
        let [attrs] = JSON.parse(request.requestBody).areas;
        let area;

        if (isBlank(attrs.slug) && !isBlank(attrs.name)) {
            attrs.slug = attrs.name.dasherize();
        }

        // NOTE: this does not use the area factory to fill in blank fields
        area = db.areas.insert(attrs);

        return {
            area
        };
    });

    server.get('/areas/', function (db, request) {
        let response = paginatedResponse('areas', db.areas, request);
        // TODO: remove post_count unless requested?
        return response;
    });

    server.get('/areas/slug/:slug/', function (db, request) {
        let [area] = db.areas.where({slug: request.params.slug});

        // TODO: remove post_count unless requested?

        return {
            area
        };
    });

    server.put('/areas/:id/', function (db, request) {
        let {id} = request.params;
        let [attrs] = JSON.parse(request.requestBody).areas;
        let record = db.areas.update(id, attrs);

        return {
            area: record
        };
    });

    server.del('/areas/:id/', function (db, request) {
        db.areas.remove(request.params.id);

        return new Mirage.Response(204, {}, {});
    });
}
