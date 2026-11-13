import json
cat = json.load(open("Athar_DZ/apps/tools-installer/catalog.json", encoding="utf-8"))
osint_tools = [t for t in cat["tools"] if t.get("category") == "osint"]
print(f"Total OSINT tools in catalog: {len(osint_tools)}")
for t in osint_tools:
    print(f"ID: {t['id']} | Method: {t['method']} | Name: {t['name']}")
    if "spec" in t:
        if "packages" in t["spec"]:
            print(f"   Packages: {t['spec']['packages']}")
        if "git_url" in t["spec"]:
            print(f"   Git URL: {t['spec']['git_url']}")
