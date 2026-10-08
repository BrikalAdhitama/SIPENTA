# Image produksi AI service SIPENTA (FastAPI + Algoritma Genetika).
#   docker build -t sipenta-ai .
#   docker run -p 8000:8000 -e AI_SERVICE_KEY=<rahasia> sipenta-ai
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /srv

# Dependensi dulu (versi terkunci) supaya layer ini di-cache saat kode berubah.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Hanya kode aplikasi yang masuk image; test, fixture, examples, dan scripts tidak.
COPY app ./app

# Jalan sebagai user biasa, bukan root.
RUN useradd --create-home --uid 10001 sipenta && chown -R sipenta:sipenta /srv
USER sipenta

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import os,urllib.request; urllib.request.urlopen('http://127.0.0.1:' + os.environ.get('PORT','8000') + '/health', timeout=4)"

# $PORT diisi platform (Render/Cloud Run); default 8000 untuk lokal.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
