#!/usr/bin/env bash
# scripts/refresh-brain.sh
#
# Pulls fresh values from the Mac Mini brain server and writes them to
# src/data/brain-status.json. Run from the repo root via `pnpm refresh:brain`.
#
# Requires:
#   - SSH access to aj@192.168.1.168 with id_ed25519_github
#   - Brain server running on the Mini at localhost:8742
#   - jq installed locally (brew install jq)
#
# The brain access key never leaves the Mac Mini — we read it from the
# launchd plist on the Mini and pass it inline to a curl that runs on the
# Mini. No secrets touch this MacBook or the repo.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
JSON="$REPO_ROOT/src/data/brain-status.json"
SSH_HOST="aj@192.168.1.168"
SSH_KEY="$HOME/.ssh/id_ed25519_github"

echo "→ pulling Brain status from Mac Mini…"

# Run remotely: read access key from plist, hit /docs/stats, return JSON.
STATS_JSON=$(ssh -o IdentitiesOnly=yes -i "$SSH_KEY" "$SSH_HOST" '
  KEY=$(plutil -extract EnvironmentVariables.BRAIN_ACCESS_KEY raw \
        ~/Library/LaunchAgents/com.brain.server.plist)
  curl -s -H "x-brain-key: $KEY" http://localhost:8742/docs/stats
')

# Also pull unique-file count + last-capture from the vectors db.
EXTRA=$(ssh -o IdentitiesOnly=yes -i "$SSH_KEY" "$SSH_HOST" '
  COUNT=$(sqlite3 ~/brain/vectors.db "SELECT COUNT(DISTINCT file_path) FROM chunks;")
  LAST=$(sqlite3 ~/brain/vectors.db "SELECT datetime(MAX(embedded_at), \"unixepoch\") FROM chunks;")
  printf "{\"memoryCount\":%s,\"lastCaptureRaw\":\"%s\"}" "$COUNT" "$LAST"
')

MEM=$(echo "$EXTRA" | jq -r '.memoryCount')
LAST_RAW=$(echo "$EXTRA" | jq -r '.lastCaptureRaw')

# Compute relative label (e.g., "4 days ago")
DAYS_AGO=$(python3 -c "
from datetime import datetime
last = datetime.strptime('$LAST_RAW', '%Y-%m-%d %H:%M:%S')
delta = (datetime.utcnow() - last).days
if delta == 0: print('today')
elif delta == 1: print('yesterday')
else: print(f'{delta} days ago')
")

# Read current runningSince + costPerMonth from existing JSON (manual fields)
RUNNING_SINCE=$(jq -r '.runningSince' "$JSON")
COST=$(jq -r '.costPerMonth' "$JSON")
TUNNEL=$(jq -r '.tunnel' "$JSON")
TODAY=$(date +%Y-%m-%d)

# Convert lastCaptureRaw → ISO with -05:00 offset (Mac Mini is in CST)
LAST_ISO=$(python3 -c "
from datetime import datetime
last = datetime.strptime('$LAST_RAW', '%Y-%m-%d %H:%M:%S')
print(last.strftime('%Y-%m-%dT%H:%M:%S-05:00'))
")

cat > "$JSON" <<EOF
{
  "\$schema-comment": "Real Brain server values, refreshed manually via \`pnpm refresh:brain\`. Not fetched at runtime — baked at build time. The \`tendedISO\` field is the date of last refresh.",
  "memoryCount": $MEM,
  "lastCaptureISO": "$LAST_ISO",
  "lastCaptureLabel": "$DAYS_AGO",
  "runningSince": "$RUNNING_SINCE",
  "tunnel": "$TUNNEL",
  "costPerMonth": "$COST",
  "tendedISO": "$TODAY"
}
EOF

echo "✓ Wrote $JSON"
echo "  memoryCount:      $MEM"
echo "  lastCapture:      $DAYS_AGO ($LAST_RAW)"
echo "  runningSince:     $RUNNING_SINCE  (manual; edit JSON to change)"
echo "  tendedISO:        $TODAY"
echo ""
echo "→ commit + push to deploy:"
echo "  git add src/data/brain-status.json"
echo "  git commit -m 'Refresh Brain status'"
echo "  git push"
