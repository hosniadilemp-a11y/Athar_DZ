import urllib.request
import json

def get_gh_assets(repo):
    url = f"https://api.github.com/repos/{repo}/releases/latest"
    req = urllib.request.Request(url, headers={"User-Agent": "Athar-Tools/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            print(f"\n{repo} Latest: {data['tag_name']}")
            for a in data.get("assets", []):
                print(f"  {a['name']} ({a['size'] / (1024*1024):.1f} MB) -> {a['browser_download_url']}")
    except Exception as e:
        print(f"Error {repo}: {e}")

get_gh_assets("owasp-amass/amass")
get_gh_assets("NationalSecurityAgency/ghidra")
