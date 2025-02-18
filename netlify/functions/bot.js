import fetch from 'node-fetch';

// Функция для отправки сообщений в Telegram
async function sendTelegramMessage(chatId, text, keyboard = null) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const data = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  };

  if (keyboard) {
    data.reply_markup = keyboard;
  }

  try {
    const response = await fetch(TELEGRAM_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Функция для создания клавиатуры
function getMainKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "🎮 Играть", web_app: { url: process.env.GAME_URL || "https://your-netlify-url.netlify.app" } }],
      [
        { text: "🏆 Таблица лидеров", callback_data: "leaderboard" },
        { text: "❓ Как играть", callback_data: "how_to_play" }
      ]
    ]
  };
}

export async function handler(event) {
  // Проверяем метод
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    console.log('Received update:', JSON.stringify(body));

    // Обработка команд
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      console.log('Processing message:', text, 'from chat:', chatId);

      switch(text) {
        case '/start':
          await sendTelegramMessage(
            chatId,
            "🐷 *Добро пожаловать в Flying Pig Game!*\n\n" +
            "Помоги нашей милой свинке преодолеть все препятствия и набрать как можно больше очков!\n\n" +
            "🎮 *Как играть:*\n" +
            "• Нажимай на экран, чтобы свинка взлетала\n" +
            "• Уворачивайся от кирпичных колонн\n" +
            "• Собирай очки и побей рекорд!\n\n" +
            "Нажми кнопку \"Играть\" чтобы начать! 🚀",
            getMainKeyboard()
          );
          break;

        case '/help':
          await sendTelegramMessage(
            chatId,
            "❓ *Помощь по игре*\n\n" +
            "🎯 *Основные команды:*\n" +
            "/start - Начать игру\n" +
            "/help - Показать это сообщение\n" +
            "/about - Информация об игре\n" +
            "/top - Таблица лидеров\n\n" +
            "🎮 *Управление в игре:*\n" +
            "• Нажимай на экран для прыжка\n" +
            "• Удерживай для более высокого прыжка\n" +
            "• Следи за количеством жизней\n\n" +
            "💡 *Советы:*\n" +
            "• Не лети слишком высоко\n" +
            "• Рассчитывай траекторию\n" +
            "• Следи за следующей колонной",
            getMainKeyboard()
          );
          break;

        default:
          await sendTelegramMessage(
            chatId,
            "Извините, я не понимаю эту команду. Используйте /help для списка доступных команд.",
            getMainKeyboard()
          );
      }
    }

    // Обработка callback_query
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const chatId = callbackQuery.message.chat.id;

      switch(callbackQuery.data) {
        case 'leaderboard':
          await sendTelegramMessage(
            chatId,
            "🏆 *Таблица лидеров*\n\n" +
            "1. 🥇 Player1 - 1500\n" +
            "2. 🥈 Player2 - 1200\n" +
            "3. 🥉 Player3 - 1000\n" +
            "4. Player4 - 800\n" +
            "5. Player5 - 600\n\n" +
            "Попробуй побить эти рекорды! 💪",
            getMainKeyboard()
          );
          break;

        case 'how_to_play':
          await sendTelegramMessage(
            chatId,
            "🎮 *Как играть:*\n\n" +
            "• Нажимай на экран, чтобы свинка взлетала\n" +
            "• Уворачивайся от кирпичных колонн\n" +
            "• Собирай очки и побей рекорд!\n\n" +
            "💡 *Советы:*\n" +
            "• Не лети слишком высоко\n" +
            "• Рассчитывай траекторию\n" +
            "• Следи за следующей колонной",
            getMainKeyboard()
          );
          break;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
