/*
Vue.component('route-header', {

})

Vue.component('route-body', {

})
*/

class DeliveryNoteItem {
    constructor(id, deliveryNote) {
        this.id = id;
        this.deliveryNote = deliveryNote;
        this.deliveried = false;
        this.comments = '';
        this.salesOrder = '';
    }    
}

Vue.component('deliverynote-item', {
    props: {
        deliveryNote: Object
    },
    data: function() {
        return {
            //StateEnum: Object.freeze({'adding': 0, 'editing': 1}),
            editing: false,
            beforeEdit: null
        }
    },
    methods: {
        edit: function() {
            this.editing = true;
            this.beforeEdit = this.deliveryNote.deliveryNote;
        },
        cancelEdit: function() {
            this.editing = false;
            this.deliveryNote.deliveryNote = this.beforeEdit;
            this.beforeEdit = null;
        },
        doneEdit: function() {
            this.editing = false;
            this.beforeEdit = null;
        }
    },
    template:
        `
        <div class="row">
            <div class="col">
                <div class="view" :class="{ editing: editing }">
                    {{ deliveryNote.deliveryNote}}
                </div>
                <input
                    class="edit"
                    :class="{ editing: editing }"
                    type="text" 
                    v-model="deliveryNote.deliveryNote"
                    @blur="doneEdit()"
                    @keyup.enter="doneEdit()"
                    @keyup.esc="cancelEdit()">
            </div>
            <div class="col">
                <input type="checkbox" v-bind:disabled="! editing" v-model="deliveryNote.deliveried">
            </div>
            <div class="col">
                <button type="button" @click="edit()">Edit</button>
                <button type="button" @click="$emit('remove', deliveryNote.id)">Delete</button>
            </div>
        </div>
        `
})

class HourItem {
    constructor(hour, deliveryNoteList) {
        this.hour = hour;
        this.deliveryNoteList = deliveryNoteList;
    }
}

Vue.component('hour-item', {
    props: {
        route: String,
        hour: String,
        initial_delivery_note_list: Array
    },
    data: function() {
        return {
            delivery_note_list: this.initial_delivery_note_list,
            newId: 1
        }
    },

    methods: {
        add: function() {
            newId = this.getNewId();
            deliveryNote = new DeliveryNoteItem(newId, '');
            deliveryNote.new = true;
            this.delivery_note_list.push(deliveryNote);
            this.$emit('myEvent', newId);
        },
        getNewId: function() {
            this.newId++;
            return '_' + this.newId;
        },
        removeDeliveryNote: function(id) {
            this.delivery_note_list.forEach((item, index) => {
                if (item.id === id) {
                    this.delivery_note_list.splice(index, 1);
                }
            })
        }
    },
    template:
        `
        <div class="row row-bordered">
            <div class="col">
                {{ route }} - {{ hour }}
                <button type="button" @click="add()">+</button>
            </div>
            <div class="col">
                <deliverynote-item
                    v-for="item in delivery_note_list"
                    v-bind:deliveryNote="item"
                    v-bind:key="item.id"
                    @remove="removeDeliveryNote">
                </deliverynote-item>
            </div>
        </div>
        `
})

class RouteItem {
    constructor(route, hoursDict) {
        this.route = route;
        this.hoursDict = hoursDict; // Dict(HourItem)
    }
}

Vue.component('route-item', {
    props: {
        route: Object
    },
    template:
        `
        <div>
            <h1>{{ route.route }}</h1>
            <hour-item 
                v-for="hour in route.hoursDict"
                v-bind:key="hour.hour"
                v-bind:route="route.route"
                v-bind:hour="hour.hour"
                v-bind:initial_delivery_note_list="hour.deliveryNoteList">
            </hour-item>
        </div>
        `
})

/*
Vue.component('deliverynotes-schedule', {
    components: {

    }
})
*/

var vm = new Vue({
    el: '#app',
    methods: {
        kk: function() {
        }
    },
    computed: {
        delivery_note_list: function() {
            //this.methods.kk //[new DeliveryNoteItem(1, 'Alb1'), new DeliveryNoteItem(2, 'Alb2')]
            var item1 = new DeliveryNoteItem(1, 'Alb1');
            var item2 = new DeliveryNoteItem(2, 'Alb2');
            var l = [item1, item2];

            return l;
        },
        route_item: function() {
            var hd = {};
            var item1 = new DeliveryNoteItem(1, 'Alb1');
            var item2 = new DeliveryNoteItem(2, 'Alb2');
            var item3 = new DeliveryNoteItem(3, 'Alb3');
            var item4 = new DeliveryNoteItem(4, 'Alb4');
            var l1 = [item1, item2];
            var l2 = [item3, item4];

            var hi1 = new HourItem("08:30", l1);
            var hi2 = new HourItem("09:00", l2);
            hd[hi1.hour] = hi1;
            hd[hi2.hour] = hi2;
            ri = new RouteItem("Ruta1", hd);

            return ri;
        }
    },
    data: {
        item1: new DeliveryNoteItem(1, 'Alb1'),
        item2: new DeliveryNoteItem(2, 'Alb2'),
        route: 'Ruta1',
        hour: '08:30'
    }
});