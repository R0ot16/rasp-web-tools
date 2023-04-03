if (SECURE) {
    var socket = io.connect(URL_WEB + ':' + PORT_SOCKET, {
        secure: true,
        transports: ['websocket', 'polling'],
        rejectUnauthorized: false,
        withCredentials: true,
        timeout: 90000
    });
    socket.on("connect_error", () => {
        // revert to classic upgrade
        socket.io.opts.transports = ["polling", "websocket"];
    });
} else {
    var socket = io.connect(URL_WEB + ':' + PORT_SOCKET, {
        withCredentials: true,
        timeout: 90000,
	rejectUnauthorized: false,
	transports: ['websocket', 'polling']
    });
}


socket.on('temp', (data) => {
    var dat = data.substr(5, 4);
    var el = document.getElementById('tempv');
    setColor(dat, el);
    el.innerHTML = dat;
    var fl = parseFloat(dat);
    myChart.data.datasets[0].data[2] = fl;
    myChart.update();
});

socket.on('cpu', (data) => {
    var jdata = JSON.parse(data);
    var base = jdata.sysstat.hosts[0];
    var stats = jdata.sysstat.hosts[0].statistics[0];
    document.getElementById('systeme-distribution').innerHTML = base.sysname;
    document.getElementById('systeme-distribution-version').innerHTML = base.release;
    document.getElementById('systeme-nombre-cpu').innerHTML = base['number-of-cpus'];
});

socket.on('time-passed', (time) => {
    document.getElementById('time-passed').innerHTML = time;
});

socket.on('cpu-usage', (data) => {
    var cpu = document.getElementById("systeme-cpu-usage");
    var jdata = JSON.parse(data);
    var base = jdata.sysstat.hosts[0];
    document.getElementById("systeme-machine").innerHTML = base.machine;
    var perc = base.statistics[0]['cpu-load'][0];
    var totalcpu = perc.usr + perc.nice + perc.sys + perc.iowait + perc.irq + perc.soft + perc.steal + perc.guest + perc.gnice;
    var total = parseInt(totalcpu);
    setColor(total, cpu);
    cpu.innerHTML = parseInt(total) + "%"
    myChart.data.datasets[0].data[0] = parseInt(total);
    myChart.update();
});

socket.on("memory", (data) => {
    var mem = document.getElementById('systeme-memory');
    var percent = (100 * parseInt(data.use)) / parseInt(data.tot);
    var per = parseInt(percent);
    setColor(per, mem);
    mem.innerHTML = per + "%";
    myChart.data.datasets[0].data[1] = per;
    myChart.update();
});

socket.on('log-true', () => {
    document.getElementById('tools').classList.remove('hide');
    document.getElementById('form-login').classList.add('hide');
    pushNotif('Logged !', 'You are now logged in.');
});
socket.on('log-false', () => {
    pushNotif('Error', 'Password or login is not reconized.', true)
});

socket.on('out-cmd', (ret) => {
    document.getElementById('ssh').innerHTML = document.getElementById('ssh').innerHTML + "<br>" + ret;
    document.getElementById('progress').classList.add('hide');
});

socket.on('ban', () => {
    alert("You are not connected, please reload page for reconnect");
});

socket.on('reboot-run', () => {
    pushNotif('Reboot', 'Reboot is running, please wait...');
});

socket.on('shutdown-run', () => {
    pushNotif('Shutdown', 'Raspberry shutdown in 1 minute');

    document.getElementById('shutdown-c').classList.remove('hide');
    document.getElementById('shutdown').classList.add('hide');
});

socket.on('shutdown-canceled', () => {
    pushNotif('Shutdown', 'Shutdown cancelled !');
});

socket.on('reboot-ok', () => {
    if (sessionStorage.getItem('reboot') === true) {
        pushNotif('Reboot', 'Reboot finished !');
        sessionStorage.setItem('reboot', false);
    }
});

socket.on('get-update-response', (ret) => {
    pushNotif('Update', ret);
    document.getElementById('progress-update').classList.add('hide');
    document.getElementById('update-text').innerHTML = ret;
    if(ret.includes('can be upgraded')){
        document.getElementById('upgrade-button').classList.remove('hide');
    } else {
        if(!document.getElementById('upgrade-button').classList.contains('hide')){
            document.getElementById('upgrade-button').classList.add('hide');
        }
    }
});

socket.on('upgrade-response', (ret) => {
    console.log(ret);
    pushNotif('Upgrade', 'Successfully upgraded !');
    document.getElementById('progress-upgrade').classList.add('hide');
    document.getElementById('upgrade-text').innerHTML = ret;
})
