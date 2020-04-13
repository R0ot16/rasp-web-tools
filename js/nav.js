var vnav = new Vue({
    el: '#nav',
    methods: {
        goHome(){
            vhome.$data.home = true;
        },
    },
});