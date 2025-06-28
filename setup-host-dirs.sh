#!/bin/bash

echo "Setting up host directories for Loki, Tempo, and Application logs..."

# Create Loki directories
echo "Setting up Loki directories..."
mkdir -p ./observability/loki-data/wal
mkdir -p ./observability/loki-data/compactor/chunks
mkdir -p ./observability/loki-data/compactor/index
mkdir -p ./observability/loki-data/compactor/cache
mkdir -p ./observability/loki-data/compactor/rules
mkdir -p ./observability/loki-data/compactor/compactor

# Create Tempo directories
echo "Setting up Tempo directories..."
mkdir -p ./observability/tempo-data

# Create Application logs directory
echo "Setting up Application logs directory..."
mkdir -p ./observability/app-logs

# Set permissions (777 for local development on macOS)
echo "Setting permissions..."
chmod -R 777 ./observability/loki-data
chmod -R 777 ./observability/tempo-data
chmod -R 777 ./observability/app-logs

echo "Host directory setup completed!" 