function resetColor(elem) {
    elem.classList.remove('green-text');
    elem.classList.remove('yellow-text');
    elem.classList.remove('red-text');
}

function connect() {
    var i = document.getElementById('id').value;
    var p = document.getElementById('pass').value;

    socket.emit('log', { id: i, pass: p });
}

function reboot() {
    sessionStorage.setItem('reboot', true);
    socket.emit('reboot');
}

function shutdown(){
    socket.emit('shutdown');
}

function cancelShutdown(){
    socket.emit('cancel-shutdown');
    document.getElementById('shutdown-c').classList.add('hide');
    document.getElementById('shutdown').classList.remove('hide');
}

function sendCmd(){
    var cmd = document.getElementById('cmd').value;
    if(cmd === "clear"){
        document.getElementById('ssh').innerHTML = "";
    } else {
        socket.emit('cmd-send', cmd);
        document.getElementById('progress').classList.remove('hide');
    }
    cmd = "";
}

function showMenu(){
    var arr = document.getElementById('arrow-nav');
    var cl = document.getElementById('close-nav');
    var nav = document.getElementById('nav');

    arr.classList.add('hide');
    cl.classList.remove('hide');
    nav.classList.add('show-nav');
}
function hideMenu(){
    var arr = document.getElementById('arrow-nav');
    var cl = document.getElementById('close-nav');
    var nav = document.getElementById('nav');

    arr.classList.remove('hide');
    cl.classList.add('hide');
    nav.classList.remove('show-nav');
}

function goAdmin(){
    hideMenu();
    resetNav();

    document.getElementById('admin-panel').classList.remove('hide-home');   
}
function goHome(){
    hideMenu();
    resetNav();

    document.getElementById('stats-home').classList.remove('hide-home');
}

function resetNav(){
    document.getElementById('stats-home').classList.add('hide-home');
    document.getElementById('admin-panel').classList.add('hide-home');
}

function setColor(value, elem) {
    resetColor(elem);
    if (value < 50) {
        elem.classList.add('green-text');
    } else if (value >= 50 && value < 75) {
        elem.classList.add('yellow-text');
    } else {
        elem.classList.add('red-text');
    }
}

function pushNotif(title, msg, error = false){
    var el = document.getElementById('notif');
    el.classList.remove('notif-error');
    el.classList.remove('notif-success');

    var nt = document.getElementById('notif-title');
    var nc = document.getElementById('notif-content');
    if(error){
        el.classList.add('notif-error');
    } else {
        el.classList.add('notif-success');
    }
    nt.innerHTML = title;
    nc.innerHTML = msg;

    el.classList.add('show-notif');
    setTimeout(() => {
        el.classList.remove('show-notif');
    }, 5000);
}