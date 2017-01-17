import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
    created_at() { return  '2015-09-11T09:44:29.871Z'; },
    created_by() { return  1; },
    description(i) { return  `Description for area ${i}.`; },
    visibility() { return 'public'; },
    image(i) { return  `/content/images/2015/10/area-${i}.jpg`; },
    meta_description(i) { return  `Meta description for area ${i}.`; },
    meta_title(i) { return  `Meta Title for area ${i}`; },
    name(i) { return  `Tag ${i}`; },
    parent() { return  null; },
    slug(i) { return  `area-${i}`; },
    updated_at() { return  '2015-10-19T16:25:07.756Z'; },
    updated_by() { return  1; },
    count() {
        return {
            posts: 1
        };
    }
});
