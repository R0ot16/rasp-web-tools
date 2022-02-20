/*
  author : Root
  Copyright: Root - EIRL FLOMY
  Last Update : 13/04/2020
*/
const conf = require('./config');
const config = new conf();
const cors = require('cors');
var app = require("express")();
var server = require("http").Server(app);
const url = config.URL_WEB;
var io = require("socket.io")(server, {
  cors: {
    origin: url,
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
});
const bodyParser = require("body-parser");
const {spawn} = require('child_process');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


let util = require('util');

var startat;

var loggedAdmin = false;
var canLog = true;
var id = config.ADMIN_ID;
var pass = config.ADMIN_PASS;


server.listen(config.PORT_SOCKET, () => {
  console.log("RASP WEB TOOLS BY ROOT");
  console.log("COPYRIGHT ROOT - EIRL FLOMY");
  console.log("server run on port 3000");
  startat = new Date();
});

io.on('connection', (socket) => {
  let inter = setInterval(() => {
    getInfos();
  }, config.INTERVAL);
  getAllCpu();
  socket.on('disconnect', () => {
    clearInterval(inter);
  });

  console.log("client connected !");
});

io.on('connect', (socket) => {
  socket.emit('reboot-ok');
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
      child = exec("sh /var/www/html/stats/cmd/reboot.bash", (err, out, stderr) => {
        if (err) {
          throw err;
        }
      });
    } else {
      socket.emit('ban');
    }
  });
  socket.on('shutdown', () => {
    if (socket.id === loggedAdmin) {
      let exec = require('child_process').exec,
        child;

      socket.emit('shutdown-run');
      child = exec("sh /var/www/html/stats/cmd/shutdown.bash", (err, out, stderr) => {
        if (err) {
          throw err;
        }
      });
    } else {
      socket.emit('ban');
    }
  });
  socket.on('cancel-shutdown', () => {
    if (socket.id === loggedAdmin) {
      let exec = require('child_process').exec,
        child;

      socket.emit('shutdown-canceled');
      child = exec("sh /var/www/html/stats/cmd/cshutdown.bash", (err, out, stderr) => {
        if (err) {
          throw err;
        }
      });
    } else {
      socket.emit('ban');
    }
  });
  socket.on('cmd-send', (data) => {
    if (socket.id === loggedAdmin) {
      let exec = require('child_process').exec,
        child;

      child = exec(`${data}`, (err, out, stderr) => {
        if (err) {
          throw err;
        }
        socket.emit('out-cmd', out);
      });
    } else {
      socket.emit('ban');
    }
  });
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
  /*let exec = require('child_process').exec,
    child;

  child = exec('sh /var/www/html/stats/cmd/temp.py', (err, out, stderr) => {
    if (err) {
      throw err;
    }
    console.log(out);
    io.emit('temp', out);
  });*/
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn('python', ['/var/www/html/stats/cmd/temp.py']);
  // collect data from script
  python.stdout.on('data', function (data) {
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
    // send data to browser
    console.log(dataToSend);
    io.emit('temp', dataToSend);
  });
}
