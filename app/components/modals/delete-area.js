import computed, {alias} from 'ember-computed';
import ModalComponent from 'ghost-admin/components/modals/base';
import {invokeAction} from 'ember-invoke-action';

export default ModalComponent.extend({

    submitting: false,

    area: alias('model'),

    postInflection: computed('area.count.posts', function () {
        return this.get('area.count.posts') > 1 ? 'posts' : 'post';
    }),

    actions: {
        confirm() {
            this.set('submitting', true);

            invokeAction(this, 'confirm').finally(() => {
                this.send('closeModal');
            });
        }
    }
});
