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
})

Vue.component('blog-post', {
    props: ['title'],
    template: '<h3>{{ title }}</h3>'
})

new Vue({
    el: '#app',
    data: {
        title: 'Schedule List',
        scheduleList: [
            {'id': '1', 'ruta': 'Ruta1', 'hora': '8:00', 'albaran': 'alb1', 'entregado': true, 'comentarios': 'com1'},
            {'id': '2', 'ruta': 'Ruta1', 'hora': '8:00', 'albaran': 'alb2', 'entregado': false, 'comentarios': 'com2'},
            {'id': '3', 'ruta': 'Ruta1', 'hora': '8:15', 'albaran': 'alb3', 'entregado': false, 'comentarios': 'com3'},
            {'id': '4', 'ruta': 'Ruta1', 'hora': '8:30', 'albaran': '', 'entregado': false, 'comentarios': ''},
            {'id': '5', 'ruta': 'Ruta1', 'hora': '8:45', 'albaran': '', 'entregado': false, 'comentarios': ''},
        ]
    }
})