import BaseValidator from './base';

export default BaseValidator.create({
    properties: ['name', 'lat', 'lng', 'code', 'slug', 'description', 'metaTitle', 'metaDescription'],

    name(model) {
        let name = model.get('name');

        if (validator.empty(name)) {
            model.get('errors').add('name', 'You must specify a name for the area.');
            this.invalidate();
        } else if (name.match(/^,/)) {
            model.get('errors').add('name', 'Area names can\'t start with commas.');
            this.invalidate();
        } else if (!validator.isLength(name, 0, 150)) {
            model.get('errors').add('name', 'Area names cannot be longer than 150 characters.');
            this.invalidate();
        }
    },

    code(model) {
        let code = model.get('code');

        if (validator.empty(code)) {
            model.get('errors').add('code', 'You must specify a code for the area.');
            this.invalidate();
        } else if (code.match(/^,/)) {
            model.get('errors').add('code', 'Area code can\'t start with commas.');
            this.invalidate();
        } else if (!validator.isLength(code, 0, 150)) {
            model.get('errors').add('code', 'Area code cannot be longer than 150 characters.');
            this.invalidate();
        }
    },

    slug(model) {
        let slug = model.get('slug');

        if (!validator.isLength(slug, 0, 150)) {
            model.get('errors').add('slug', 'URL cannot be longer than 150 characters.');
            this.invalidate();
        }
    },

    description(model) {
        let description = model.get('description');

        if (!validator.isLength(description, 0, 200)) {
            model.get('errors').add('description', 'Description cannot be longer than 200 characters.');
            this.invalidate();
        }
    },

    metaTitle(model) {
        let metaTitle = model.get('metaTitle');

        if (!validator.isLength(metaTitle, 0, 150)) {
            model.get('errors').add('metaTitle', 'Meta Title cannot be longer than 150 characters.');
            this.invalidate();
        }
    },

    metaDescription(model) {
        let metaDescription = model.get('metaDescription');

        if (!validator.isLength(metaDescription, 0, 200)) {
            model.get('errors').add('metaDescription', 'Meta Description cannot be longer than 200 characters.');
            this.invalidate();
        }
    },

    lat(model) {
        let lat = model.get('lat');

        if (!!lat && !lat.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
            model.get('errors').add('lat', 'Area lat must be a double value.');
            this.invalidate();
        } else if (!validator.isLength(lat, 0, 15)) {
            model.get('errors').add('lat', 'Area lat cannot be longer than 15 characters.');
            this.invalidate();
        }
    },

    lng(model) {
        let lng = model.get('lng');

        if (!!lng && !lng.match(/^[-+]?[0-9]*\.?[0-9]+$/)) {
            model.get('errors').add('lng', 'Area lng must be a double value.');
            this.invalidate();
        } else if (!validator.isLength(lng, 0, 15)) {
            model.get('errors').add('lng', 'Area lng cannot be longer than 15 characters.');
            this.invalidate();
        }
    }
});
