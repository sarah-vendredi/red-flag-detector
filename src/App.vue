<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-pink-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
      <!-- Header -->
      <header class="text-center mb-8 sm:mb-12">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-600 mb-3 sm:mb-4 text-shadow">
          🚩 red flag detector
        </h1>
        <p class="text-gray-600 text-base sm:text-lg">
          décris la situation, l'IA juge sans pitié
        </p>
      </header>

      <!-- Main Card -->
      <div class="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <!-- Mode Toggle -->
        <div class="flex flex-col items-center mb-6">
          <div class="text-xs text-gray-500 mb-2">choisis ton mode :</div>
          <div class="flex gap-2 sm:gap-3">
            <button
              @click="mode = 'judge'"
              class="px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full font-semibold transition-all duration-300"
              :class="mode === 'judge' 
                ? 'bg-red-500 text-white shadow-lg scale-105' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'"
            >
              ⚖️ mode juge
            </button>
            <button
              @click="mode = 'defend'"
              class="px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full font-semibold transition-all duration-300"
              :class="mode === 'defend' 
                ? 'bg-green-500 text-white shadow-lg scale-105' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'"
            >
              🛡️ mode avocat
            </button>
          </div>
        </div>

        <!-- Mode Callout -->
        <div 
          class="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300"
          :class="mode === 'judge' 
            ? 'bg-red-50 border-red-300' 
            : 'bg-green-50 border-green-300'"
        >
          <div class="flex items-start gap-2 sm:gap-3">
            <div class="text-xl sm:text-2xl">{{ mode === 'judge' ? '⚖️' : '🛡️' }}</div>
            <div>
              <div class="font-bold mb-1 text-sm sm:text-base" :class="mode === 'judge' ? 'text-red-700' : 'text-green-700'">
                {{ mode === 'judge' ? 'mode juge' : 'mode avocat' }}
              </div>
              <div class="text-xs sm:text-sm" :class="mode === 'judge' ? 'text-red-600' : 'text-green-600'">
                {{ mode === 'judge' 
                  ? 'L’IA juge la situation sans pitié, avec sarcasme. Attends-toi à du cash ! 🔥' 
                  : 'L’IA défend la personne coûte que coûte avec des arguments créatifs. Tout devient positif ! 💪' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="mb-4 sm:mb-6">
          <textarea
            v-model="situation"
            placeholder="ex: il/elle a 47 chats et dit que c'est 'normal'..."
            class="w-full h-32 sm:h-40 p-3 sm:p-4 border-2 border-gray-300 rounded-2xl focus:border-red-400 focus:outline-none resize-none text-base sm:text-lg"
            :disabled="loading"
          ></textarea>
        </div>

        <!-- Judge Button -->
        <button
          @click="judge"
          :disabled="loading || !situation.trim()"
          class="w-full py-4 sm:py-6 text-xl sm:text-2xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          :class="mode === 'judge' 
            ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white hover:from-rose-500 hover:to-rose-600' 
            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'"
        >
          {{ loading ? '⏳ Analyse en cours...' : (mode === 'judge' ? '⚖️ JUGER' : '🛡️ DÉFENDRE') }}
        </button>
      </div>

      <!-- Results -->
      <transition name="fade">
        <div v-if="result" class="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-200 p-4 sm:p-6 lg:p-8">
          <!-- Flags Animation -->
          <div class="flex justify-center mb-6 sm:mb-8 space-x-1 sm:space-x-2">
            <div
              v-for="n in 5"
              :key="n"
              class="text-4xl sm:text-5xl lg:text-6xl transition-all duration-500"
              :class="n <= result.flagCount ? 'animate-flag-wave' : 'opacity-20'"
              :style="{ animationDelay: `${n * 0.1}s` }"
            >
              {{ result.flagCount <= 1 ? '🟢' : '🚩' }}
            </div>
          </div>

          <!-- Score -->
          <div class="text-center mb-4 sm:mb-6">
            <div class="text-3xl sm:text-4xl lg:text-5xl font-black mb-2" :class="getVerdictColor(result.flagCount)">
              {{ result.verdict }}
            </div>
            <div class="text-base sm:text-xl text-gray-600">
              {{ result.flagCount }}/5 {{ result.flagCount <= 1 ? 'drapeaux verts ✅' : 'drapeaux rouges 🚩' }}
            </div>
          </div>

          <!-- Justification -->
          <div class="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">📝 Analyse :</h3>
            <p class="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">{{ result.justification }}</p>
          </div>

          <!-- Share Buttons -->
          <div class="mb-4">
            <div class="text-sm font-semibold text-gray-600 mb-2 text-center">Partager sur :</div>
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                @click="shareWhatsApp"
                class="py-3 px-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm"
              >
                <span class="text-lg">💬</span>
                <span>WhatsApp</span>
              </button>
              <button
                @click="shareTwitter"
                class="py-3 px-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm"
              >
                <span class="text-lg">𝕏</span>
                <span>Twitter</span>
              </button>
              <button
                @click="copyToClipboard(getShareText())"
                class="py-3 px-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-sm"
              >
                <span class="text-lg">📋</span>
                <span>Copier</span>
              </button>
            </div>
          </div>

          <!-- Reset Button -->
          <button
            @click="reset"
            class="w-full py-3 sm:py-4 text-sm sm:text-base bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all duration-300"
          >
            🔄 Nouvelle analyse
          </button>
        </div>
      </transition>

      <!-- Footer -->
      <footer class="text-center mt-8 sm:mt-12 pb-6 sm:pb-8">
        <div class="text-gray-400 text-xs mb-3 max-w-md mx-auto px-4">
          🔒 Aucune donnée personnelle n'est collectée ou stockée. Les analyses sont effectuées en temps réel et ne sont jamais sauvegardées.
        </div>
        <div class="text-gray-500 text-sm">
          © 2025 Sarah Maury
        </div>
        <a 
          href="https://instagram.com/sarah_maau" 
          target="_blank"
          class="text-gray-600 hover:text-red-500 transition-colors duration-300 text-sm inline-flex items-center gap-1 mt-2"
        >
          <span>📸</span>
          <span>@sarah_maau</span>
        </a>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      situation: '',
      loading: false,
      result: null,
      mode: 'judge' // 'judge' or 'defend'
    }
  },
  methods: {
    toggleMode() {
      this.mode = this.mode === 'judge' ? 'defend' : 'judge'
      this.result = null
    },

    async judge() {
      if (!this.situation.trim()) return

      this.loading = true
      this.result = null

      try {
        // Check for easter eggs first
        const easterEggResult = this.checkEasterEggs(this.situation)
        if (easterEggResult) {
          await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
          this.result = easterEggResult
          this.loading = false
          return
        }

        // Call backend API
        const prompt = this.mode === 'judge' 
          ? this.getJudgePrompt(this.situation)
          : this.getDefendPrompt(this.situation)

        // Utilise l'URL de l'API en production, localhost en dev
        const apiUrl = import.meta.env.PROD 
          ? '/api/analyze'
          : 'http://localhost:3001/api/analyze'
        
        const response = await axios.post(apiUrl, { prompt })

        const content = response.data.content
        this.result = this.parseResponse(content)
      } catch (error) {
        console.error('Error:', error)
        this.result = {
          flagCount: 3,
          verdict: 'ERREUR SYSTÈME',
          justification: `Impossible de contacter l'IA. ${error.response?.data?.error?.message || error.message}\n\nVérifie que ta clé API est configurée dans le fichier .env`
        }
      } finally {
        this.loading = false
      }
    },

    checkEasterEggs(text) {
      const lowerText = text.toLowerCase()
      
      // Easter egg: "ma mère" / "ma mere"
      if (lowerText.includes('ma mère') || lowerText.includes('ma mere') || lowerText.includes('ma maman')) {
        return {
          flagCount: 5,
          verdict: 'RED FLAG ATOMIQUE',
          justification: '🚨 ALERTE MAXIMALE 🚨\n\nLes problèmes avec la belle-mère sont un classique universel. C\'est mathématique : si ça commence maintenant, imagine dans 10 ans. Les statistiques sont formelles : 99,9% des histoires qui commencent par "ma mère" finissent en drame familial.\n\nConclusion : Fuis. Ou achète une maison à 500km minimum.'
        }
      }

      // Easter egg: "crypto"
      if (lowerText.includes('crypto') || lowerText.includes('bitcoin') || lowerText.includes('nft')) {
        return {
          flagCount: 4,
          verdict: 'SUSPECT PAR DÉFAUT',
          justification: '💰 ALERTE FINANCIÈRE 💰\n\nLe mot "crypto" déclenche automatiquement 4 drapeaux. C\'est la règle. Soit c\'est un génie incompris qui sera milliardaire (0,001% de chances), soit c\'est quelqu\'un qui va te parler de "la blockchain" à chaque repas de famille.\n\nLe risque : Te réveiller un jour avec tous tes meubles vendus pour "investir dans le prochain Dogecoin".\n\nVerdict : Méfiance niveau maximum.'
        }
      }

      // Easter egg: "horoscope" / "astrologie"
      if (lowerText.includes('horoscope') || lowerText.includes('astrologie') || lowerText.includes('signe astrologique')) {
        return {
          flagCount: 3,
          verdict: 'LÉGÈREMENT SUSPECT',
          justification: '✨ ANALYSE COSMIQUE ✨\n\nL\'astrologie, c\'est mignon... jusqu\'au moment où tu découvres que vos signes sont "incompatibles" et que c\'est une raison valable pour annuler un rendez-vous.\n\nLe vrai danger : Les décisions importantes basées sur la position de Mercure. "Désolé, je peux pas déménager, Saturne est rétrograde."\n\nMais bon, ça reste gérable. Juste... ne prévois rien d\'important pendant la pleine lune.'
        }
      }

      // Easter egg: "ex"
      if (lowerText.match(/\bex\b/) || lowerText.includes('ancien') && (lowerText.includes('copain') || lowerText.includes('copine'))) {
        return {
          flagCount: 4,
          verdict: 'ZONE DANGEREUSE',
          justification: '💔 ALERTE EX 💔\n\nLes ex, c\'est comme les zombies : ils reviennent toujours. Si c\'est mentionné dès maintenant, c\'est que le chapitre n\'est PAS fermé.\n\nScénarios possibles :\n- "On est restés amis" (traduction : drama garanti)\n- "Je dois récupérer mes affaires" (ça fait 3 ans)\n- "C\'est compliqué" (non, c\'est juste pas fini)\n\nPronostic : 85% de chances de te retrouver dans un triangle amoureux que tu n\'as pas demandé.'
        }
      }

      return null
    },

    getJudgePrompt(situation) {
      return `Tu es un détecteur de red flags ULTRA SARCASTIQUE et sans filtre. Tu juges les situations relationnelles avec un humour noir et des punchlines qui font mouche. Réponds EXACTEMENT dans ce format :

SCORE: [nombre de 0 à 5]
VERDICT: [un titre PERCUTANT et SARCASTIQUE comme "RED FLAG ATOMIQUE 💥" / "FUIS PENDANT QU'IL EST TEMPS" / "SUSPECT NIVEAU MAXIMUM" / "MOUAIS... BONNE CHANCE" / "T'ES PARANO, CALME-TOI"]
JUSTIFICATION: [3-5 phrases SARCASTIQUES et DRÔLES. Utilise l'ironie, les comparaisons absurdes, les émojis bien placés. Sois cash mais hilarant. Fais des références pop culture si pertinent.]

Situation : ${situation}

Échelle de jugement :
- 5 drapeaux = DANGER IMMÉDIAT, sauve ta vie
- 4 drapeaux = Très très suspect, réfléchis bien
- 3 drapeaux = Ça sent pas bon, surveille ça
- 2 drapeaux = Léger doute, mais bon...
- 1 drapeau = Probablement rien, t'es parano
- 0 drapeau = Totalement sain, marie-toi demain

Ton style : Sarcastique, direct, drôle, sans pitié. Tu es là pour JUGER, pas pour ménager les sentiments. Utilise l'humour noir et l'ironie. Fais des comparaisons absurdes mais parlantes.`
    },

    getDefendPrompt(situation) {
      return `Tu es un AVOCAT DE LA DÉFENSE ACHARNÉ et PASSIONNÉ. Tu DÉFENDS ton client COÛTE QUE COÛTE avec des arguments créatifs, absurdes mais étonnamment convaincants. Tu RENTRES DEDANS, tu retournes TOUT en positif. Réponds EXACTEMENT dans ce format :

SCORE: [nombre de 0 à 2 maximum, car tu DÉFENDS]
VERDICT: [un titre POSITIF et CONVAINCU comme "TOTALEMENT INNOCENT ! 😇" / "C'EST ADORABLE EN FAIT 💕" / "GÉNIE INCOMPRIS" / "VISIONNAIRE" / "PARFAITEMENT NORMAL"]
JUSTIFICATION: [3-5 phrases PASSIONNÉES qui DÉFENDENT la personne. Utilise des arguments créatifs, retourne la situation, trouve des excuses improbables mais drôles. Sois CONVAINCANT et ENTHOUSIASTE. Utilise des émojis positifs.]

Situation : ${situation}

Ton rôle :
- Tu es l'AVOCAT, tu DOIS défendre bec et ongles
- RETOURNE chaque point négatif en qualité
- Trouve des EXCUSES créatives et improbables
- Utilise des comparaisons flatteuses
- Sois PASSIONNÉ et CONVAINCU
- Maximum 2 drapeaux (et encore, c'est déjà trop)

Exemples de défense :
- 47 chats ? "Preuve d'une empathie hors du commun et d'une capacité à gérer le chaos digne d'un CEO de startup ! 🐱✨"
- Parle à sa mère 10x/jour ? "Relations familiales solides = stabilité émotionnelle. C'est un ATOUT ! 👨‍👩‍👦💪"
- Investit dans la crypto ? "Visionnaire qui comprend l'économie du futur. Vous êtes juste jaloux ! 🚀💎"

Ton style : Passionné, convaincant, créatif, DÉFENSIF. Tu es là pour SAUVER ton client, pas pour juger !`
    },

    parseResponse(content) {
      const lines = content.split('\n')
      let flagCount = 3
      let verdict = 'VERDICT MYSTÉRIEUX'
      let justification = content

      // Parse avec regex plus flexible pour gérer les espaces
      const scoreMatch = content.match(/SCORE\s*:\s*(\d+)/i)
      if (scoreMatch) {
        flagCount = parseInt(scoreMatch[1])
      }

      const verdictMatch = content.match(/VERDICT\s*:\s*(.+?)(?:\n|$)/i)
      if (verdictMatch) {
        verdict = verdictMatch[1].trim()
      }

      const justifMatch = content.match(/JUSTIFICATION\s*:\s*(.+)/is)
      if (justifMatch) {
        justification = justifMatch[1].trim()
      }

      return {
        flagCount: Math.max(0, Math.min(5, flagCount)),
        verdict,
        justification
      }
    },

    getVerdictColor(count) {
      if (count >= 5) return 'text-red-600'
      if (count >= 4) return 'text-orange-600'
      if (count >= 3) return 'text-yellow-600'
      if (count >= 2) return 'text-blue-600'
      return 'text-green-600'
    },

    getShareText() {
      return `🚩 red flag detector\n\n${this.result.verdict}\n${this.result.flagCount}/5 drapeaux\n\n${this.result.justification}\n\n👉 Teste ton crush sur redflag.app`
    },

    shareWhatsApp() {
      const text = this.getShareText()
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`
      window.open(url, '_blank')
    },

    shareTwitter() {
      const text = `🚩 ${this.result.verdict}\n${this.result.flagCount}/5 drapeaux\n\n👉 Teste ton crush sur redflag.app`
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
      window.open(url, '_blank')
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert('✅ Verdict copié dans le presse-papier !')
      }).catch(() => {
        alert('❌ Impossible de copier. Essaie de sélectionner le texte manuellement.')
      })
    },

    reset() {
      this.situation = ''
      this.result = null
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
