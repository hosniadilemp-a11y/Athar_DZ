import urllib.request
import json

req = urllib.request.Request('https://api.github.com/repos/ggml-org/whisper.cpp/releases', headers={'User-Agent': 'AtharDZ/1.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        releases = json.loads(resp.read().decode('utf-8'))
        for r in releases[:5]:
            assets = r.get('assets', [])
            print(f"Release: {r.get('tag_name')} with {len(assets)} assets")
            for a in assets:
                if 'bin' in a['name'].lower() or 'x64' in a['name'].lower() or 'win' in a['name'].lower():
                    print(f"  {a['name']}: {a['browser_download_url']} ({a['size'] / (1024*1024):.2f} MB)")
except Exception as e:
    print('Error:', e)
