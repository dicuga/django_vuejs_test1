Vue.component('schedule-grid', {
    props: [
        'datos'
    ],
    data: function() {
        return {
            editedTodo: null,
            beforeEditingCache: null,
            newItem: null,
            newItemIndex: null
        }
    },
    methods: {
        add: function(item) {
            lastValueIndex = null
            for (var i=0; i<this.datos.length; i++) {
                if (this.datos[i].hora === item.hora) {
                    lastValueIndex = i
                }
            }
            
            // Si no tiene valor de albarán edita el albarán actual.
            if (this.datos[lastValueIndex].albaran==='') {
                this.beforeEditingCache = item.albaran
                this.editedTodo = item
            // Si tiene valor, añade un nuevo elemento justo debajo.
            } else {
                this.newItemIndex = lastValueIndex + 1
                newItem = {
                    'id': '', 
                    'ruta': item.ruta, 
                    'hora': item.hora, 
                    'albaran': '', 
                    'entregado': false, 
                    'comentarios': ''
                }
                this.newItem = newItem
                this.editedTodo = newItem
                this.datos.splice(this.newItemIndex, 0, newItem)    
            }

        },
        edit: function(item) {
            this.beforeEditingCache = item.albaran
            this.editedTodo = item
        },
        cancelEdit: function(item) {
            if (this.newItem) {                                        
                this.datos.splice(this.newItemIndex, 1)
                this.newItem = null
                this.newItemIndex = null
            } else {
                item.albaran = this.beforeEditingCache
                this.beforeEditingCache = null
                this.editedTodo = null
            }

        },
        doneEdit: function(item) {
            if(! this.editedTodo) {
                return
            }            
            this.editedTodo = null
            /* todo */
        },

    },
    directives: {
        'todo-focus': function (el, binding) {
            if (binding.value) {
                el.focus()
            }
        }
    },    
    template:
        `
        <div>
            <div class="row">
                <div class="col">HORA</div>
                <div class="col">ALBARAN</div>
                <div class="col">ENTREGADO</div>
                <div class="col">COMENTARIO</div>
                <div class="col"></div>
            </div>

            <div class="row" v-for="item in datos">
                <div class="col">
                    {{ item.hora }}
                </div>
                <div class="col">
                    <div
                        class="view"
                        :class="{ editing: item == editedTodo }"
                        @dblclick="edit(item)">
                        {{ item.albaran }}
                    </div>
                    <input
                        class="edit"
                        :class="{ editing: item == editedTodo }"
                        type="text" 
                        v-model="item.albaran"
                        v-todo-focus="item == editedTodo"
                        @blur="doneEdit(item)"
                        @keyup.enter="doneEdit(item)"
                        @keyup.esc="cancelEdit(item)">
                </div>
                <div class="col"><input type="checkbox" v-model="item.entregado"></div>
                <div class="col">{{ item.comentarios }}</div>
                <div class="col">
                    <button 
                        type="button" 
                        class="btn btn-default"
                        @click="add(item)">+</button>
                </div>
            </div>
        </div>
        `
});

Vue.component('schedule-empty-grid', {
    props: {
        routes: Array,
        initial_hour: Number,
        final_hour: Number,
        minutes_interval: Number
    },
    data: function() {
        return {
            routes_list: null,
            editedTodo: null,
            beforeEditingCache: null,
            state: null
        }
    },
    methods: {
        generateyEmptyModel: function(route, hour, index) {
            model = {
                'id': index,
                'route': route,
                'hour': hour,
                'deliveryNote': '',
                'deliveried': false,
                'comments': ''
            }

            return model;

        },
        generateHoursArray: function() {
            var d = new Date();

            totalHours = this.final_hour - this.initial_hour;
            intervals = 60.0 / this.minutes_interval;
            d.setHours(this.initial_hour, 0, 0, 0);
            
            
            hours = d.getHours()<10 ? '0' + d.getHours() : '' + d.getHours();
            minutes = d.getMinutes()<10 ? '0' + d.getMinutes() : '' + d.getMinutes();
            hour_str = ''.concat(hours, ':', minutes);
            hours_array = [hour_str];
            for(var i=0; i < intervals*totalHours; i++) {
                d.setTime(d.getTime() + this.minutes_interval * 60 * 1000);
                hours = d.getHours()<10 ? '0' + d.getHours() : '' + d.getHours();
                minutes = d.getMinutes()<10 ? '0' + d.getMinutes() : '' + d.getMinutes();
                hour_str = ''.concat(hours, ':', minutes);
                hours_array.push(hour_str);
            }

            return hours_array;
        },
        generateRoutesStructure: function() {
            hours_array = this.generateHoursArray();
            
            this.routes_list = {};
            this.routes.forEach(route => {
                route_info = {};
                route_info.route = route;
                route_info.hours_list = {};

                hours_array.forEach(hour => {
                    hour_info = {};
                    hour_info.hour = hour;
                    hour_info.delivery_notes = [];
                    new_item = this.generateyEmptyModel(route, hour, 1);
                    hour_info.delivery_notes.push(new_item);
                    route_info.hours_list[hour] = hour_info;
                })
                this.routes_list[route] = route_info;
            });
            //new_item = this.generateyEmptyModel('ruta1', '08:00', 1);
            //this.routes_list['ruta0'].hours_list['08:00'].delivery_notes.push(new_item);
            console.log(this.routes_list);
        },
        add: function(route, hour_info) {

            index = hour_info.delivery_notes.length + 1;            
            new_item = this.generateyEmptyModel(route, hour_info.hour, index);            
            hour_info.delivery_notes.push(new_item);
            this.edit(new_item);
        },
        edit: function(item) {
            this.beforeEditingCache = item.deliveryNote
            this.editedTodo = item
        },
        cancelEdit: function(item) {
            console.log('dentro de cancel')
            if (this.state==='add') {
                
                
                itemIndex = item.id - 1  // OJO: si permito eliminar no será este el objeto
                this.routes_list[item.route].hours_list[item.hour].delivery_notes.splice(itemIndex, 1);
            
                item.deliveryNote = this.beforeEditingCache;
                this.state = null;
                this.beforeEditingCache = null;
                this.editedTodo = null;

            } else {
                item.deliveryNote = this.beforeEditingCache
                this.beforeEditingCache = null
                this.editedTodo = null
            }

        },
        doneEdit: function(item) {
            if(! this.editedTodo) {
                return
            }
            this.editedTodo = null
            /* todo */
        },


    },
    created: function() {
        this.generateRoutesStructure();
    },
    computed: {
    },
    directives: {
        'todo-focus': function (el, binding) {
            if (binding.value) {
                el.focus();
            }
        }
    },   
    template: 
        `
        <div>
            <div id="accordion">
                <div class="card" v-for="route_info in routes_list">
                    <div class="card-header" id="headingOne">
                        <h5 class="mb-0">
                            <button 
                                class="btn btn-link" 
                                data-toggle="collapse" 
                                :data-target="'#' + route_info.route" 
                                aria-expanded="true" 
                                aria-controls="collapseOne">
                                {{ route_info.route }}
                            </button>
                        </h5>
                    </div>
                    
                    <div :id="route_info.route" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                        <div class="card-body">
                            <div class="row" v-for="hour_info in route_info.hours_list">
                                <div class="col">
                                    <span class="firstHour">{{ hour_info.hour }}</span>
                                    <button type="button" class="btn btn-default"
                                        @click="add(route_info.route, hour_info)">+
                                    </button>
                                </div>

                                <div class="col">

                                    <div class="row" v-for="delivery_note in hour_info.delivery_notes">                                    
                                        <div class="col">
                                            <div
                                                class="view"
                                                :class="{ editing: delivery_note == editedTodo }"
                                                @dblclick="edit(delivery_note)">
                                                {{ delivery_note.deliveryNote }}
                                            </div>
                                            <input
                                                class="edit"
                                                :class="{ editing: delivery_note == editedTodo }"
                                                type="text" 
                                                v-model="delivery_note.deliveryNote"
                                                v-todo-focus="delivery_note == editedTodo"
                                                @blur="doneEdit(delivery_note)"
                                                @keyup.enter="doneEdit(delivery_note)"
                                                @keyup.esc="cancelEdit(delivery_note)">
                                            </input>
                                        </div>
                                        
                                        <div class="col">
                                            <input type="checkbox" v-model="delivery_note.deliveried">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
        `
});


Vue.component('blog-post', {
    props: ['title'],
    template: '<h3>{{ title }}</h3>'
});

new Vue({
    el: '#app',    
    data: {
        title: 'Schedule List',
        rutas: ['ruta1', 'ruta2'],
        initial_hour: 8,
        final_hour: 20,
        minutes_interval: 15,
        scheduleList: [
            {'id': '1', 'ruta': 'Ruta1', 'hora': '8:00', 'albaran': 'alb1', 'entregado': true, 'comentarios': 'com1'},
            {'id': '2', 'ruta': 'Ruta1', 'hora': '8:00', 'albaran': 'alb2', 'entregado': false, 'comentarios': 'com2'},
            {'id': '3', 'ruta': 'Ruta1', 'hora': '8:15', 'albaran': 'alb3', 'entregado': false, 'comentarios': 'com3'},
            {'id': '4', 'ruta': 'Ruta1', 'hora': '8:30', 'albaran': '', 'entregado': false, 'comentarios': ''},
            {'id': '5', 'ruta': 'Ruta1', 'hora': '8:45', 'albaran': '', 'entregado': false, 'comentarios': ''},
        ]
    }
});