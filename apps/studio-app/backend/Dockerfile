FROM python:3.12-slim

WORKDIR /app

# Create non-root user per security rules
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Install CPU-only PyTorch wheel with HTTP Range resume + SHA-256 check (cached Docker layer)
RUN python - <<'PY'
import hashlib, pathlib, time, urllib.request
url = "https://download-r2.pytorch.org/whl/cpu/torch-2.15.0%2Bcpu-cp312-cp312-manylinux_2_28_x86_64.whl"
expected = "0955c7e3446326293f48af18fad67872fa31dee5a36a87690eb9e5be8b465be3"
dst = pathlib.Path("/tmp/torch-2.15.0+cpu-cp312-cp312-manylinux_2_28_x86_64.whl")
done = False
for attempt in range(25):
    pos = dst.stat().st_size if dst.exists() else 0
    req = urllib.request.Request(url, headers={"Range": f"bytes={pos}-"} if pos else {})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            mode = "ab" if (pos and r.status == 206) else "wb"
            total = int(r.headers.get("Content-Range", "/0").split("/")[-1] or r.headers.get("Content-Length", 0))
            with open(dst, mode) as f:
                while chunk := r.read(1048576):
                    f.write(chunk)
        if not total or dst.stat().st_size >= total:
            done = True
            break
    except Exception as exc:
        print(f"retry {attempt}: {exc}", flush=True)
        time.sleep(2)
assert done, "Failed to download torch CPU wheel"
assert hashlib.sha256(dst.read_bytes()).hexdigest() == expected, "SHA-256 mismatch for torch wheel"
PY
RUN pip install --no-cache-dir /tmp/torch-2.15.0+cpu-cp312-cp312-manylinux_2_28_x86_64.whl \
    && rm -f /tmp/torch-2.15.0+cpu-cp312-cp312-manylinux_2_28_x86_64.whl

COPY requirements.txt .
RUN pip install --default-timeout=300 --retries=10 --no-cache-dir -r requirements.txt

COPY app ./app
COPY tests ./tests
COPY pyproject.toml .

RUN mkdir -p /var/lib/athar/uploads /home/appuser/.camel_tools /tmp/.camel_tools \
    && chown -R appuser:appgroup /app /var/lib/athar/uploads /home/appuser /tmp/.camel_tools
ENV CAMELTOOLS_DATA=/tmp/.camel_tools
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
