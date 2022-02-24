class Config{
    URL_WEB = "https://rasp.yourstories.fr"; // Your raspberry's URL or IP 
    PORT_SOCKET = 3000; // Port of socket IO / Defaut : 3000
    INTERVAL = 2500 // Interval for resend info to client-side

    ADMIN_ID = "root"; // Identifiant of admin panel
    ADMIN_PASS = "root"; // Password of admin panel

    SECURE = true; // false = http ; true = https

    // IF SECURE IS TRUE , PUT YOUR CERT AND KEY PATH HERE
    KEY_PATH = "/etc/letsencrypt/live/rasp.yourstories.fr/privkey.pem";
    CERT_PATH = "/etc/letsencrypt/live/rasp.yourstories.fr/fullchain.pem";
}

module.exports = Config;