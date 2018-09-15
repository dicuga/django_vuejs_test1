Vue.component('nombre-componente', {
    props: ['ini_hour'],
    template:'<h2>xxx{{ ini_hour }}xxx</h2>',
    methods: {
        generar: function() {
            console.log('generado');
        }
    },
    mounted: function() {
        console.log('mounted');
        this.generar();
    }
})

new Vue({
    el: '#app',
    data: {
        ih: 20
    }
});