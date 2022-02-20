class Config{
    URL_WEB = "http://rasp.yourstories.fr"; // Your raspberry's URL or IP 
    PORT_SOCKET = "3000"; // Port of socket IO / Defaut : 3000
    INTERVAL = 2500 // Interval for resend info to client-side

    ADMIN_ID = "root"; // Identifiant of admin panel
    ADMIN_PASS = "root"; // Password of admin panel
}

module.exports = Config;