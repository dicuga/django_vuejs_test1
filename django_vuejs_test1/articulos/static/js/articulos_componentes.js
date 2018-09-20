/*
Vue.component('route-header', {

})

Vue.component('route-body', {

})
*/

class DeliveryNoteItem {
    constructor(id, route, hour, deliveryNote) {
        this.id = id;
        this.route = route
        this.hour = hour
        this.deliveryNote = deliveryNote;
        this.deliveried = false;
        this.comments = '';
        this.salesOrder = '';
        this.editing = false;
    }
}

Vue.component('deliverynote-item', {
    props: {
        deliveryNote: Object
    },
    data: function() {
        return {
            //StateEnum: Object.freeze({'adding': 0, 'editing': 1}),
            beforeEdit: null
        }
    },
    methods: {
        edit: function() {
            this.deliveryNote.editing = true;
            this.beforeEdit = this.deliveryNote.deliveryNote;
        },
        cancelEdit: function() {
            if (this.beforeEdit === null) {
                this.$emit('remove', deliveryNote.id);
                return;
            } 
            this.deliveryNote.editing = false;
            this.deliveryNote.deliveryNote = this.beforeEdit;
            this.beforeEdit = null;
        },
        doneEdit: function() {
            if (this.deliveryNote.deliveryNote==='' && this.beforeEdit === null) {
                this.$emit('remove', deliveryNote.id);
                return;
            }

            this.deliveryNote.editing = false;
            this.beforeEdit = null;

        }
    },
    directives: {
        'focus': {
            update: function(el) {
                el.focus();    
            },
            inserted: function (el) {
                el.focus();
            }
        }
    },   
    template:
        `
        <div class="row row-bordered">
        
            <div class="col" v-show="false">{{ deliveryNote.route }}</div>
            <div class="col" v-show="false">{{ deliveryNote.hour }}</div>

            <div class="col">
                <div class="view" :class="{ editing: deliveryNote.editing }">
                    {{ deliveryNote.deliveryNote}}
                </div>
                <input
                    ref="albaran"
                    class="edit"
                    :class="{ editing: deliveryNote.editing }"
                    type="text" 
                    v-model="deliveryNote.deliveryNote"
                    v-focus="deliveryNote.editing"
                    @blur="doneEdit()"
                    @keyup.enter="doneEdit()"
                    @keyup.esc="cancelEdit()">
            </div>

            <div class="col">{{ deliveryNote.salesOrder }}</div>
            <div class="col">
                <input type="checkbox" v-bind:disabled="! deliveryNote.editing" v-model="deliveryNote.deliveried">
            </div>

            <div class="col">{{ deliveryNote.comments }}</div>
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
            deliveryNote = new DeliveryNoteItem(newId, this.route, this. hour, '');
            deliveryNote.editing = true;
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
        <div class="row row-bordered-button-black">
            <div class="col-sm-2">
                {{ route }} - {{ hour }}
                <button type="button" @click="add()">+</button>
            </div>
            <div class="col-sm-10">
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

Vue.component('route-list', {
    props: {
        route_list: Array
    },
    template:
        `
        <div>
            <route-item v-for="route in route_list"></route-item>
        </div>
        `
})

// Componente completo
Vue.component('schedule-deliverynote', {
    props: {
        initial_hour: String,
        final_hour: String,
        minutes_interval: Number
    },
    mounted: function() {

    },
    methods: {
        prepareResponse: function(response) {
            console.log(response);
        },
        getDeliveryNotes: function() {
            this.loading = true;
            this.$http.get('/api/deliverynote')
                .then(response => {
                    this.loading = false;
                    this.prepareResponse(response);
                })
                .catch(err => {
                    this.loading = false;
                    console.log(err);
                })
        }
    }
})


var vm = new Vue({
    el: '#app',
    methods: {

        getDeliveryNotes: function() {
            this.loading = true;
            this.$http.get('/api/deliverynote')
                .then(response => {
                    console.log("primer then resultado:")
                    console.log(response);
                    this.loading = false;
                })
                .then(msg => {
                    console.log("segundo then resulado:");
                    console.log(msg);
                })
                .catch(err => {
                    this.loading = false;
                    console.log(err);
                })
        }
    },
    mounted: function() {
        this.getDeliveryNotes();
    },
    computed: {
        route_item: function() {
            var hd = {};
            var item1 = new DeliveryNoteItem(1, '','', 'Alb1');
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
    }
});