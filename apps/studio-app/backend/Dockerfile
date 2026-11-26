FROM python:3.12-slim

WORKDIR /app

# Create non-root user per security rules
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Install CUDA-enabled PyTorch (cu124, falls back cleanly to CPU when no GPU is attached)
ARG TORCH_INDEX_URL=https://download.pytorch.org/whl/cu124
RUN pip install --default-timeout=300 --retries=15 --no-cache-dir \
    torch==2.6.0 --index-url ${TORCH_INDEX_URL}

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
