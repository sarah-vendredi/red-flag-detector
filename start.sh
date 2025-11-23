#!/bin/bash

# Démarrer le serveur backend
node server.js &
BACKEND_PID=$!

# Attendre que le backend soit prêt
sleep 2

# Démarrer Vite
npx vite

# Nettoyer à la sortie
trap "kill $BACKEND_PID" EXIT
