#!/bin/sh
set -eu
# Executed only on owned COS lab VMs. No changes to macOS.
cd /home/kidealab
case "$1" in
load)
 sudo mkdir -p /var/lib/kidea-r08/payload /var/lib/kidea-r08/data /var/lib/kidea-r08/backup /var/lib/kidea-r08/state
 sudo tar -xzf payload.tar.gz -C /var/lib/kidea-r08/payload
 sudo chmod -R a+rX /var/lib/kidea-r08/payload
 sudo chown -R 1000:1000 /var/lib/kidea-r08/payload/ca
 sudo chmod 777 /var/lib/kidea-r08/data /var/lib/kidea-r08/backup /var/lib/kidea-r08/state
 sudo docker load -i image.tar.gz
 ;;
workload)
 cd /var/lib/kidea-r08
 image=$(cat payload/image-id)
 sudo docker image inspect "$image" --format '{{.Id}}'
 sudo docker network create kidea-r08-cloud
 if test -f /home/kidealab/restore.db; then
  sudo cp /home/kidealab/restore.db data/input.db
  sudo chmod 644 data/input.db
  sudo docker run --rm --pull=never --network=none --read-only --user=1000:1000 --cap-drop=ALL --security-opt=no-new-privileges --cpus=0.5 --memory=512m -v "$PWD/payload:/payload:ro" -v "$PWD/data:/data" "$image" /payload/database backup /data/input.db /data/sample.db
 fi
 sudo docker run -d --name kidea-r08-backend --pull=never --network=kidea-r08-cloud --network-alias=backend --restart=unless-stopped --read-only --user=1000:1000 --cap-drop=ALL --security-opt=no-new-privileges --cpus=0.5 --memory=768m --memory-swap=768m --pids-limit=128 --tmpfs=/tmp:rw,size=128m --log-opt=max-size=4m --log-opt=max-file=2 -v "$PWD/payload:/payload:ro" -v "$PWD/payload/config:/secrets:ro" -v "$PWD/data:/data" "$image" /payload/backend
 sudo docker run -d --name kidea-r08-web --pull=never --network=kidea-r08-cloud --network-alias=web --restart=unless-stopped --read-only --user=1000:1000 --cap-drop=ALL --security-opt=no-new-privileges --cpus=0.5 --memory=768m --memory-swap=768m --pids-limit=128 --tmpfs=/tmp:rw,size=128m --log-opt=max-size=4m --log-opt=max-file=2 -v "$PWD/payload/web:/work:ro" -e KIDEA_INTEGRATION=1 -e HOST=0.0.0.0 -e PORT=4173 -e ORIGIN=https://localhost:8443 -e BODY_SIZE_LIMIT=131072 -e SHUTDOWN_TIMEOUT=30 "$image" node /work/build/index.js
 sudo docker run -d --name kidea-r08-caddy --pull=never --network=kidea-r08-cloud --network-alias=caddy --restart=unless-stopped --read-only --user=1000:1000 --cap-drop=ALL --security-opt=no-new-privileges --cpus=0.25 --memory=512m --memory-swap=512m --pids-limit=128 --tmpfs=/tmp:rw,size=128m --log-opt=max-size=4m --log-opt=max-file=2 -p 8443:8443 -v "$PWD/payload:/payload:ro" -v "$PWD/payload/ca:/data" -e XDG_DATA_HOME=/data -e XDG_CONFIG_HOME=/tmp/config "$image" /payload/caddy run --config /payload/Caddyfile --adapter caddyfile
 sudo docker run -d --name kidea-r08-backup --pull=never --network=kidea-r08-cloud --restart=unless-stopped --read-only --user=1000:1000 --cap-drop=ALL --security-opt=no-new-privileges --cpus=0.5 --memory=512m --memory-swap=512m --pids-limit=128 --tmpfs=/tmp:rw,size=64m --log-opt=max-size=4m --log-opt=max-file=2 -p 9444:9444 -v "$PWD/payload:/payload:ro" -v "$PWD/payload/config:/config:ro" -v "$PWD/data:/data:ro" -v "$PWD/backup:/backup" "$image" node /payload/backup-server.mjs
 ;;
observer)
 cd /var/lib/kidea-r08
 image=$(cat payload/image-id)
 sudo docker run -d --name kidea-r08-observer --pull=never --network=host --restart=unless-stopped --read-only --user=1000:1000 --cap-drop=ALL --security-opt=no-new-privileges --cpus=0.5 --memory=512m --memory-swap=512m --pids-limit=128 --tmpfs=/tmp:rw,size=64m --log-opt=max-size=4m --log-opt=max-file=2 -v "$PWD/payload:/payload:ro" -v "$PWD/payload/config:/config:ro" -v "$PWD/state:/state" "$image" node /payload/observer.mjs
 ;;
snapshot)
 sudo docker stop --time=15 kidea-r08-observer
 sudo tar -czf /home/kidealab/state.tar.gz -C /var/lib/kidea-r08/state .
 sudo chown kidealab /home/kidealab/state.tar.gz
 ;;
resume) sudo docker start kidea-r08-observer ;;
status)
 sudo docker ps -a --format '{{.Names}} {{.Status}} {{.Image}}'
 sudo cat /var/lib/kidea-r08/state/events.jsonl
 ;;
*) exit 2 ;;
esac
