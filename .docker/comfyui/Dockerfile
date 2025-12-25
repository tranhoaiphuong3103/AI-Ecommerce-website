# ComfyUI Dockerfile for video generation
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    wget \
    curl \
    ffmpeg \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Clone ComfyUI
RUN git clone https://github.com/comfyanonymous/ComfyUI.git /app

# Install Python dependencies
RUN pip install --no-cache-dir \
    torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118 \
    -r requirements.txt

# Install custom nodes for video generation
RUN cd custom_nodes && \
    git clone https://github.com/Kosinkadink/ComfyUI-AnimateDiff-Evolved.git && \
    git clone https://github.com/Fannovel16/comfyui_controlnet_aux.git && \
    git clone https://github.com/ltdrdata/ComfyUI-Manager.git

# Install dependencies for custom nodes
RUN cd custom_nodes/ComfyUI-AnimateDiff-Evolved && pip install -r requirements.txt || true
RUN cd custom_nodes/comfyui_controlnet_aux && pip install -r requirements.txt || true

# Create directories for models
RUN mkdir -p models/checkpoints models/vae models/loras models/controlnet \
    models/animatediff_models models/animatediff_motion_lora \
    input output workflows

EXPOSE 8188

# Start ComfyUI
CMD ["python", "main.py", "--listen", "0.0.0.0", "--port", "8188"]
