import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Anthropic } from '@anthropic-ai/sdk'

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const apiKey = process.env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY

if (!apiKey) {
  console.error('❌ No API key found in environment variables')
  console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('API')))
} else {
  console.log('✅ API key loaded:', apiKey.substring(0, 20) + '...')
}

const anthropic = new Anthropic({
  apiKey: apiKey
})

app.post('/api/analyze', async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    console.log('📝 Analyzing prompt...')

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const content = message.content[0].text
    console.log('✅ Analysis complete')
    res.json({ content })
  } catch (error) {
    console.error('❌ Error calling Claude API:', error.message)
    console.error('Full error:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to analyze',
      details: error.response?.data || error.toString()
    })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`🚩 Backend server running on http://localhost:${PORT}`)
})
