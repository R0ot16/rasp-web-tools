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

    MAIL_ACTIVE = false; // false: send mail disabled;  true : send mail enabled

    MAIL_HOST = ""; // HOST OF EMAIL
    MAIL_USER = ""; // user login email
    MAIL_PASS = ""; // user pass email
    MAIL_PORT = '465' // PORT OF MAIL SERVICE
    MAIL_SECURE = true; // true if port 465; false if other port

    MAIL_FROM = ""; // EMAIL TO SEND MESSAGE
    MAIL_TO = "" // EMAIL ADRESS WHO RECEIVE MESSAGE
}

module.exports = Config;