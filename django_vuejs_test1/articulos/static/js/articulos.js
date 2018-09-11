Vue.component('schedule-grid', {
    props: [
        'datos'
    ],
    data: function() {
        return {
            editedTodo: null,
            beforeEditingCache: null
        }
    },
    methods: {
        edit: function(item) {
            this.beforeEditingCache = item.albaran
            this.editedTodo = item
        },
        cancelEdit: function(item) {
            item.albaran = this.beforeEditingCache
            this.beforeEditingCache = null
            this.editedTodo = null

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
        <table>
            <tr>
                <td>HORA</td>
                <td>ALBARAN</td>
                <td>COMENTARIOS</td>
            </tr>

            <tr v-for="item in datos">
                <td
                    @dblclick="edit(item)">
                    {{ item.hora }}
                </td>
                <td>
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
                </td>
                <td>{{ item.comentarios }}</td>
                <td v-show="true">Guardar</td>
                <td v-show="true">Cancelar</td>
            </tr>

        </table>
        `
})

Vue.component('blog-post', {
    props: ['title'],
    template: '<h3>{{ title }}</h3>'
})

new Vue({
    el: '#app',
    data: {
        title: 'Schedule List --',
        scheduleList: [
            {'id': '1', 'ruta': 'Ruta1', 'hora': '8:00', 'albaran': 'alb1', 'comentarios': 'com1'},
            {'id': '2', 'ruta': 'Ruta1', 'hora': '8:00', 'albaran': 'alb2', 'comentarios': 'com2'},
            {'id': '3', 'ruta': 'Ruta1', 'hora': '8:15', 'albaran': 'alb3', 'comentarios': 'com3'},
            {'id': '4', 'ruta': 'Ruta1', 'hora': '8:30', 'albaran': '', 'comentarios': ''},
            {'id': '5', 'ruta': 'Ruta1', 'hora': '8:45', 'albaran': '', 'comentarios': ''},
        ]
    }
})