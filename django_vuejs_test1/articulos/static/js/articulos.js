Vue.component('schedule-grid', {
    props: {
        'datos': String
    },
    template: '<div>{{ datos }}</div>'
})

Vue.component('blog-post', {
    props: ['title'],
    template: '<h3>{{ title }}</h3>'
})

new Vue({
    el: '#app',
    data: {
        scheduleList: {
            '8:00': [{'albaran': 'ALB111', 'comentarios': ''}],
            '8:15': [],
            '8:30': [],
        }
    }
})