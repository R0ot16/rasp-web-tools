Green="\033[0;32m" 
Red="\033[0;31m"    
Cyan="\033[0;36m" 
NC='\033[0m'

echo "${Cyan} Rasp web tools Installation, please wait.."
echo "INSTALLATION TOOLS..."
echo "${Cyan}Update..."
apt update
echo "${Cyan}Upgrade..."
apt upgrade -y
echo "${Cyan}Installation..."
apt install systat python3 nodejs npm setuptools apache2 -y
echo "${Green}INSTALLATION TOOLS COMPLETE"
echo "${Cyan}INSTALL CLIENT..."
sh ./install_client.sh 
echo "${Green}CLIENT INSTALLED SUCCESSFULLY"
echo "${Cyan}INSTALL SERVER..."
sh ./stats/install_server.sh
echo "${Green}SERVER INSTALLED SUCCESSFULLY${NC}"