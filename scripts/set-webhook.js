import fetch from 'node-fetch';

const BOT_TOKEN = process.env.BOT_TOKEN || '7737881736:AAEsMZRD_QsO7xGO49hVHzQtCCSkpmFaPlU';
const NETLIFY_URL = process.env.NETLIFY_URL || 'https://moonlit-otter-5f1bc7.netlify.app';

async function setWebhook() {
    const webhookUrl = `${NETLIFY_URL}/.netlify/functions/bot`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: webhookUrl,
                drop_pending_updates: true
            }),
        });
        
        const data = await response.json();
        console.log('Webhook setup response:', data);
        
        // Получим информацию о текущем вебхуке
        const infoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
        const infoData = await infoResponse.json();
        console.log('\nCurrent webhook info:', infoData);
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
}

setWebhook();
