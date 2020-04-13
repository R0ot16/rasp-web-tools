var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
const bodyParser = require("body-parser");



let util = require('util');

var startat;

var loggedAdmin = false;
var canLog = true;
var id = "root";
var pass = "root";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

server.listen(3000, () => {
  console.log("server run on port 3000");
  startat = new Date();
});

io.on('connection', (socket) => {
  let inter = setInterval(() => {
    getInfos();
  }, 2500);
  getAllCpu();
  socket.on('disconnect', () => {
    clearInterval(inter);
  });

  console.log("client connected !");
});

io.on('connect', (socket) => {
  socket.on('log', (data) => {
    if (data.id === id && data.pass === pass) {
      socket.emit('log-true');
      canLog = false;
      loggedAdmin = socket.id;
    } else {
      socket.emit('log-false');
    }
  });
  socket.on('reboot', () => {
    if (socket.id === loggedAdmin) {
      let exec = require('child_process').exec,
        child;

      socket.emit('reboot-run');
      setTimeout(() => {
        child = exec("sh /var/www/html/stats/cmd/reboot.bash", (err, out, stderr) => {
          if (err) {
            throw err;
          }
        });
      }, 1000);
    } else {
      socket.emit('ban');
    }
  })
});

function getInfos() {
  getTemp();
  getUsageCpu();
  getMemory();
  io.emit('time-passed', getTimePassed());
}

function getMemory() {
  let exec = require('child_process').exec,
    child;

  child = exec("sh /var/www/html/stats/cmd/mem.bash", (err, out, stderr) => {
    if (err) {
      throw err;
    }
    var total = out.substr(49, 7);
    var used = out.substr(56, 7)
    io.emit('memory', { tot: total, use: used });
  });
}

function getUsageCpu() {
  let exec = require('child_process').exec,
    child;

  child = exec("sh /var/www/html/stats/cmd/cpuusage.bash", (err, out, stderr) => {
    if (err) {
      throw err;
    }

    io.emit('cpu-usage', out);
  });
}

function getTimePassed() {
  var ndate = new Date();

  var seconds = Math.floor((ndate - startat) / 1000);

  var interval = Math.floor(seconds / 315536000);

  if (interval > 1) {
    return interval + " ans";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " mois";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " jours";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " heures";
  }
  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    return interval + " minutes";
  }

  return Math.floor(seconds) + " secondes";
}

function getAllCpu() {
  let exec = require('child_process').exec,
    child;

  child = exec("sh /var/www/html/stats/cmd/stats.bash", (err, out, stderr) => {
    if (err) {
      throw err;
    }

    io.emit('cpu', out);
  });
}

function getTemp() {
  let exec = require('child_process').exec,
    child;

  child = exec('sh /var/www/html/stats/cmd/temp.bash', (err, out, stderr) => {
    if (err) {
      throw err;
    }
    io.emit('temp', out);
  });
}
