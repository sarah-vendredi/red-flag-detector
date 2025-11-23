# 🚩 Red Flag Detector

Une application web fun qui analyse les situations relationnelles et détecte les red flags avec l'aide de l'IA Claude.

## ✨ Fonctionnalités

- **Interface ultra simple** : Un textarea, un bouton, des résultats
- **Animation de drapeaux** : De 0 à 5 drapeaux rouges qui s'agitent
- **Verdicts variés** : "RED FLAG ATOMIQUE", "Suspect par défaut", "T'es parano", etc.
- **Justifications drôles** : Analyses absurdes mais semi-crédibles
- **Easter eggs** : Mots-clés spéciaux qui déclenchent des réponses uniques
  - "ma mère" → toujours 5 drapeaux 🚨
  - "crypto" → suspect par défaut 💰
  - "horoscope" → légèrement suspect ✨
  - "ex" → zone dangereuse 💔
- **Mode Contre-analyse** : L'IA joue l'avocat et défend la personne
- **Partage** : Copie ou partage le verdict facilement

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Configurer l'API Claude
cp .env.example .env
# Édite .env et ajoute ta clé API Anthropic
```

## 🔑 Configuration de l'API

1. Crée un compte sur [Anthropic](https://console.anthropic.com/)
2. Génère une clé API
3. Ajoute-la dans le fichier `.env` :
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

## 💻 Développement

```bash
# Lancer le serveur de développement
npm run dev

# L'app sera disponible sur http://localhost:3000
```

## 🏗️ Build

```bash
# Créer une version de production
npm run build

# Prévisualiser la version de production
npm run preview
```

## 🎨 Stack Technique

- **Vue 2** : Framework JavaScript
- **Tailwind CSS** : Styling moderne et responsive
- **Vite** : Build tool ultra-rapide
- **Claude API** : IA d'Anthropic pour les analyses
- **Axios** : Requêtes HTTP

## 🎭 Modes de fonctionnement

### Mode Juge ⚖️
L'IA analyse la situation et détecte les red flags sans pitié.

### Mode Avocat 🛡️
L'IA défend la personne et trouve des excuses créatives, même pour les situations les plus douteuses.

## 📝 Exemples d'utilisation

**Situation** : "il/elle a 47 chats et dit que c'est normal"
**Résultat** : 4-5 drapeaux, verdict hilarant sur la gestion féline

**Situation** : "il/elle parle à sa mère 5 fois par jour"
**Résultat** : Easter egg activé, 5 drapeaux automatiques

**Situation** : "il/elle investit tout dans le Bitcoin"
**Résultat** : Easter egg crypto, suspect par défaut

## 🎯 Prochaines améliorations possibles

- [ ] Historique des analyses
- [ ] Système de vote communautaire
- [ ] Plus d'easter eggs
- [ ] Mode "Analyse de groupe" pour les situations complexes
- [ ] Export en image pour les réseaux sociaux

## ⚠️ Note

Cette app est faite pour le fun ! Les verdicts sont générés par une IA avec un prompt humoristique. Ne prends pas les résultats trop au sérieux (mais peut-être un peu quand même 😉).

## 📄 Licence

MIT - Fais-en ce que tu veux !
