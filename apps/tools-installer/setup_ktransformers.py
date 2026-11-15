import urllib.request
import zipfile
import shutil
import os

repos_dir = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\repos"
target_dir = os.path.join(repos_dir, "runtime_ktransformers_repo")
zip_path = os.path.join(repos_dir, "ktransformers.zip")
extract_tmp = os.path.join(repos_dir, "kt_extract_temp")

if os.path.exists(target_dir):
    print(f"Target already exists: {target_dir}")
    exit(0)

url = "https://github.com/kvcache-ai/ktransformers/archive/refs/heads/main.zip"
print(f"Downloading {url} to {zip_path}...")
urllib.request.urlretrieve(url, zip_path)
print("Download complete. Extracting...")

with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_tmp)

subdirs = os.listdir(extract_tmp)
src_folder = os.path.join(extract_tmp, subdirs[0])
print(f"Moving {src_folder} to {target_dir}...")
shutil.move(src_folder, target_dir)

if os.path.exists(zip_path):
    os.remove(zip_path)
if os.path.exists(extract_tmp):
    shutil.rmtree(extract_tmp)

print(f"Successfully installed KTransformers repo at: {target_dir}")
print("Contents:", os.listdir(target_dir)[:10])
