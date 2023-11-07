#!/bin/sh
DOCUMENT_ROOT=/var/www/sources

# Take site offline
echo "Taking site offline..."
touch $DOCUMENT_ROOT/maintenance.file

# Swap over the content
echo "Deploying content..."
mkdir -p $DOCUMENT_ROOT/PeerTube
cp peertube.png $DOCUMENT_ROOT/PeerTube
cp PeerTubeConfig.json $DOCUMENT_ROOT/PeerTube
cp PeerTubeScript.js $DOCUMENT_ROOT/PeerTube
sh sign.sh $DOCUMENT_ROOT/PeerTube/PeerTubeScript.js $DOCUMENT_ROOT/PeerTube/PeerTubeConfig.json

# Notify Cloudflare to wipe the CDN cache
echo "Purging Cloudflare cache for zone $CLOUDFLARE_ZONE_ID..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"files":["https://plugins.grayjay.app/PeerTube/peertube.png", "https://plugins.grayjay.app/PeerTube/PeerTubeConfig.json", "https://plugins.grayjay.app/PeerTube/PeerTubeScript.js"]}'

# Take site back online
echo "Bringing site back online..."
rm $DOCUMENT_ROOT/maintenance.file
