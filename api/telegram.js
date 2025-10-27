// api/telegram.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    // Your Telegram bot configuration
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    // If Telegram credentials are not set, log and return success
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log('📝 IELTS TEST SUBMISSION (Telegram not configured)');
      console.log(message);
      return res.status(200).json({ 
        success: true, 
        message: 'Test logged to console (Telegram not configured)' 
      });
    }

    // Send to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error('Telegram API error:', errorData);
      throw new Error(`Telegram API error: ${errorData.description}`);
    }

    console.log('✅ Test report sent to Telegram successfully');
    res.status(200).json({ success: true, message: 'Test report sent to Telegram' });
    
  } catch (error) {
    console.error('Error in Telegram API:', error);
    // Still return success so the user experience isn't broken
    res.status(200).json({ 
      success: true, 
      message: 'Test submitted successfully (Telegram notification failed)',
      error: error.message
    });
  }
}
