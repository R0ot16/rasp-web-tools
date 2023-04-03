/*
  author : Root
  Copyright: Root - EIRL FLOMY
  Last Update : 13/04/2020
*/

const conf = require('./config');
const config = new conf();

const email = require('./email');

const fs = require('fs');

var server = null;
if (config.SECURE) {
  var app = require("express")();
  server = require("https").createServer({
    key: fs.readFileSync(config.KEY_PATH),
    cert: fs.readFileSync(config.CERT_PATH),
  }, app);
} else {
  var app = require("express")();
  server = require('http').Server(app);
}
const url = config.URL_WEB;
var io = require("socket.io")(server, {
  cors: {
    origin: 'http://192.168.1.21'
  },
  methods: ["GET", "POST"],
  transports: ['websocket', 'polling'],
  credentials: true,
  rejectUnauthorized: false,
  allowEIO3: true
});
const bodyParser = require("body-parser");
const { spawn } = require('child_process');


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

  if (config.MAIL_ACTIVE) {
    let mail = new email('Raspberry runned', 'Your raspberry is now online !');
    mail.sendMail();
  }
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
    if (data && (data.id === id && data.pass === pass)) {
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
      child = exec("sh "+config.DIR_STATS_LINK+"/stats/reboot.bash", (err, out, stderr) => {
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
      child = exec("sh "+config.DIR_STATS_LINK+"/stats/shutdown.bash", (err, out, stderr) => {
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
      child = exec("sh "+config.DIR_STATS_LINK+"/stats/cshutdown.bash", (err, out, stderr) => {
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

      try {
        child = exec(`${data}`, (err, out, stderr) => {
          if (err) {
            socket.emit('out-cmd', out);
          }
          socket.emit('out-cmd', out);
        });
      } catch (e) {
        socket.emit('out-cmd', e);
      }
    } else {
      socket.emit('ban');
    }
  });
  socket.on('get-update', (data) => {
    if (socket.id === loggedAdmin) {
      getUpdate(socket);
    } else {
      socket.emit('ban');
    }
  })
  socket.on('upgrade', (data) => {
    if (socket.id === loggedAdmin) {
      upgrade(socket);
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

  child = exec("sh "+config.DIR_STATS_LINK+"/stats/mem.bash", (err, out, stderr) => {
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

  child = exec("sh "+config.DIR_STATS_LINK+"/stats/cpuusage.bash", (err, out, stderr) => {
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

  child = exec("sh "+config.DIR_STATS_LINK+"/stats/stats.bash", (err, out, stderr) => {
    if (err) {
      throw err;
    }

    io.emit('cpu', out);
  });
}

function getTemp() {
  var dataToSend;
  const python = spawn('python', [ config.DIR_STATS_LINK+"/stats/temp.py"]);
  python.stdout.on('data', function (data) {
    dataToSend = data.toString();
  });
  python.on('close', (code) => {
    io.emit('temp', dataToSend);
    if(config.MAIL_ACTIVE){
      dataToSend = dataToSend.substr(5, 4);
      dataToSend = parseFloat(dataToSend);
      if(dataToSend > 50){
        let mail = new email('Raspberry', 'temperature of raspberry over 50°');
        mail.sendMail();
      }
    }
  });
}

function getUpdate(socket) {
  let exec = require('child_process').exec,
    child;

  child = exec("sh "+config.DIR_STATS_LINK+"/cmd/update.bash", (err, out, stderr) => {
    if (err) {
      throw err;
    }

    if (out.includes('can be upgraded')) {
      final = out.length;
      start = final - 70;
      out = out.slice(start, final - 42);
    }

    if (out.includes('are up to date')) {
      out = 'All packages are up to date'
    }

    socket.emit('get-update-response', out);
  });
}

function upgrade(socket) {
  let exec = require('child_process').exec,
    child;

  child = exec("sh "+config.DIR_STATS_LINK+"/cmd/upgrade.bash", (err, out, stderr) => {
    if (err) {
      throw err;
    }

    socket.emit('upgrade-response', 'All packages upgraded.');
  });
}
