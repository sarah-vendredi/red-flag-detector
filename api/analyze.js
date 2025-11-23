import { Anthropic } from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY

    if (!apiKey) {
      console.error('API key not found')
      return res.status(500).json({ error: 'API key not configured' })
    }

    const anthropic = new Anthropic({
      apiKey: apiKey
    })

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const content = message.content[0].text

    return res.status(200).json({ content })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ 
      error: error.message || 'Failed to analyze',
      details: error.toString()
    })
  }
}
