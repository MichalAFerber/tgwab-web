---
title: "Raspberry Pi Setup"
---
## pi4server.local

## pi5server.local

### Ubuntu 24.04.4

***

**First things first**

```javascript
sudo apt update
sudo apt full-upgrade
```

**Setup Network Interfaces**

```javascript
sudo nano /etc/network/interfaces
# interfaces(5) file used by ifup(8) and ifdown(8)
# Include files from /etc/network/interfaces.d:
source /etc/network/interfaces.d/*

# Ethernet interface
auto eth0
iface eth0 inet static
  address 192.168.50.2  
  netmask 255.255.255.0 
  gateway 192.168.50.1 
  dns-nameservers 1.1.1.1 8.8.8.8         
  metric 100

# WiFi interface
auto wlan0
iface wlan0 inet dhcp
  metric 200

sudo ifdown eth0 && sudo ifup eth0
sudo ifdown wlan0 && sudo ifup wlan0
sudo systemctl restart networking
```

**Install PHP, Python, Figlet, lolcat, NeoFetch, & FastFetch**

```javascript
sudo add-apt-repository ppa:zhangsongcui3371/fastfetch
sudo apt update
sudo apt install fastfetch
fastfetch --gen-config
sudo apt install php8.3-cli
sudo apt install figlet lolcat neofetch
sudo nano /etc/ssh/ssh_config
PermitUserEnvironment yes
sudo systemctl restart ssh
systemctl daemon-reload
```

python3 -V

php -v

lolcat -h

figlet "Hello, Docker"

fastfetch

**Create Welcome Message**

sudo nano /etc/profile.d/welcome.sh

[https://x.com/i/grok?focus=1&conversation=1896400359079166124](https://x.com/i/grok?focus=1&conversation=1896400359079166124)

```javascript
if [ -t 0 ]; then  # Check if stdin is a terminal (interactive shell)
    clear
    figlet Welcome | lolcat
    fastfetch
    tput sgr0
    echo "You are go for Whiskey, Tango, Foxtrot!"
fi
```

**Install Docker & Docker Compose**

```javascript
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
sudo docker-compose up -d
```

docker ps

docker version

docker-compose version

[](https://hub.docker.com/)

**Install Portainer**

```javascript
docker pull portainer/portainer-ce:latest
sudo docker run -d -p 9000:9000 -p 9443:9443 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:lts
```

**Install Pi-Hole**

```py
sudo nano /etc/systemd/resolved.conf
DNSStubListener=no
sudo systemctl restart systemd-resolved
sudo apt install net-tools
sudo netstat -tlnp | grep :53
```

**Install speedtest-tracker on sqlite**

```javascript
mkdir speedtest-tracker
cd speedtest-tracker
mkdir data
nano docker-compose.yml
services:
    speedtest-tracker:
        image: lscr.io/linuxserver/speedtest-tracker:latest
        restart: unless-stopped
        container_name: speedtest-tracker
        ports:
            - 8089:80
        environment:
            - PUID=1000
            - PGID=1003
            - APP_KEY=base64:YE6GIv3J8LeEWZWkEJ0dPAobe4pqDZw03ly7Qv9OcBs=
            - DB_CONNECTION=sqlite
            - SPEEDTEST_INTERFACE=eth0
        volumes:
            - ~/speedtest-tracker/data:/config
				env_file:
						- ~/speedtest-tracker/speedtest-tracker.env
```

**Install noip-duc [kk.sytes.net]()**

```javascript
mkdir noip-duc
cd noip-duc
nano noip-duc.env

# noip-duc.env with DDNS Key
NOIP_USERNAME=f7vkeee
NOIP_PASSWORD=QogtsE5v7ceG
NOIP_HOSTNAMES=all.ddnskey.com

docker run -d --env-file noip-duc.env --name noip-duc --restart=always ghcr.io/noipcom/noip-duc:3.2.0@sha256:57301f2f54e3f8575bbe33caae40f154806d7ed272e8c94cf37b38581aac6f72
```

**Install Ghost**

```javascript
cd ~
mkdir ghost
cd ghost
nano docker-compose.yml
services:
  ghost:
    image: ghost:5-alpine
    restart: always
    ports:
      - "8086:2368"
    environment:
      - database__client=sqlite3
      - database__connection__filename=/var/lib/ghost/content/data/ghost.db
    volumes:
      - ~/ghost/:/var/lib/ghost/content
```

***

**Server URLs**

[http://pi4server.local/](http://pi4server.local/) Lighttpd

[http://pi4server.local/ipcameras.html](http://pi4server.local/ipcameras.html)

[http://pi4server.local/phpinfo.php](http://pi4server.local/phpinfo.php)

[](http://pi4server.local:8089/admin)[http://pi4server.local/admin](http://pi4server.local/admin) Pi-Hole

[](http://pi4server.local:8088/cameras.html)[](http://pi4server.local:8088/cameras.html)[](http://pi4server.local:8088/cameras.html)

[http://pi4server.local:3000/](http://pi4server.local:3000/) Homepage

[http://pi4server.local:3001/](http://pi4server.local:3001/) Uptime Kuma

[http://pi4server.local:8085/](http://pi4server.local:8085/) IT Tools

[http://pi4server.local:8087/](http://pi4server.local:8087/) File Browser

[](http://pi4server.local:8085/)

[http://pi4server.local:8089/admin](http://pi4server.local:8089/admin) Speedtest Tracker

[http://pi4server.local:9000/](http://pi4server.local:9000/) Portainer

[](http://pi4server.local:3000/)

[](http://pi4server.local:8085/)

***

**References**

[https://github.com/fastfetch-cli/fastfetch](https://github.com/fastfetch-cli/fastfetch)

[https://itsfoss.com/fine-control-fastfetch/](https://itsfoss.com/fine-control-fastfetch/)

[https://docker.com/](https://docker.com/)
[https://hub.docker.com/](https://hub.docker.com/)

[https://github.com/noipcom/linux-update-client-docker/pkgs/container/noip-duc](https://github.com/noipcom/linux-update-client-docker/pkgs/container/noip-duc)

[https://my.noip.com/dynamic-dns](https://my.noip.com/dynamic-dns)

[https://docs.speedtest-tracker.dev/getting-started/installation/using-docker](https://docs.speedtest-tracker.dev/getting-started/installation/using-docker)

[https://github.com/alexjustesen/speedtest-tracker/pkgs/container/speedtest-tracker](https://github.com/alexjustesen/speedtest-tracker/pkgs/container/speedtest-tracker)

[https://github.com/gethomepage/homepage](https://github.com/gethomepage/homepage)

[https://github.com/jokob-sk/NetAlertX/tree/main](https://github.com/jokob-sk/NetAlertX/tree/main)

[https://www.lighttpd.net/](https://www.lighttpd.net/)

[https://github.com/CorentinTh/it-tools](https://github.com/CorentinTh/it-tools)

[https://it-tools.tech/](https://it-tools.tech/)

[https://github.com/mickael-kerjean/filestash](https://github.com/mickael-kerjean/filestash)

[https://www.filestash.app/](https://www.filestash.app/)

[https://github.com/louislam/uptime-kuma](https://github.com/louislam/uptime-kuma)

[https://uptime.kuma.pet/](https://uptime.kuma.pet/)

[https://github.com/caddyserver/caddy](https://github.com/caddyserver/caddy)

[https://caddyserver.com/](https://caddyserver.com/)

[https://github.com/ortus-solutions/contentbox](https://github.com/ortus-solutions/contentbox)

[https://www.contentboxcms.org/](https://www.contentboxcms.org/)

[https://github.com/louislam/uptime-kuma](https://github.com/louislam/uptime-kuma)

[https://uptime.kuma.pet/](https://uptime.kuma.pet/)

[https://github.com/pi-hole/pi-hole](https://github.com/pi-hole/pi-hole)

[https://pi-hole.net/](https://pi-hole.net/)

[https://raspberrytips.com/install-cloudflared-raspberry-pi/](https://raspberrytips.com/install-cloudflared-raspberry-pi/)

[https://docs.pi-hole.net/guides/dns/cloudflared/](https://docs.pi-hole.net/guides/dns/cloudflared/)

[https://github.com/cloudflare/cloudflared](https://github.com/cloudflare/cloudflared)

[https://ghost.org/](https://ghost.org/)
[https://ghost.org/docs/](https://ghost.org/docs/)

[https://hub.docker.com/_/ghost/](https://hub.docker.com/_/ghost/)
