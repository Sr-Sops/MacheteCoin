import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { ticket_id, username, email, message } = await request.json();

    let discordStatus = "not_attempted";
    // Send Discord notification if configured
    if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_CHANNEL_ID && ticket_id) {
      try {
        const discordRes = await fetch(`https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: `🔔 **Mensaje del chat de soporte de la web**\n\n**Usuario:** ${username}\n**E-mail:** ${email}\n\n**Mensaje:**\n> ${message.substring(0, 1000)}${message.length > 1000 ? '...' : ''}`,
            embeds: [{
              title: `Ticket ID: ${ticket_id}`,
              color: 16762624 // Hex #ffc700
            }],
            components: [{
              type: 1, // Action Row
              components: [{
                type: 2, // Button
                style: 1, // Primary (blurple)
                label: "Responder al usuario",
                custom_id: `reply_${ticket_id}`
              }]
            }]
          })
        });
        discordStatus = `${discordRes.status} ${discordRes.statusText}`;
        if (!discordRes.ok) {
           const errText = await discordRes.text();
           console.error("Discord error:", errText);
           discordStatus += ` - ${errText}`;
        }
      } catch (err: any) {
        console.error("Error sending to Discord:", err);
        discordStatus = `Error: ${err.message}`;
      }
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ SMTP variables not configured. Email notification to soporte@machetecoin.es was simulated.');
      console.log(`[SIMULATED EMAIL] New chat message from ${username} (${email}): ${message}`);
      return NextResponse.json({ success: true, simulated: true, discordStatus });
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"MacheteCoin Bot" <${process.env.SMTP_USER}>`,
      to: 'soporte@machetecoin.es',
      subject: `Nuevo mensaje de chat de ${username}`,
      text: `Usuario: ${username}\nEmail: ${email}\n\nMensaje:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #ffc700;">Nuevo mensaje de Chat de MacheteCoin</h2>
          <p><strong>Usuario:</strong> ${username}</p>
          <p><strong>Email:</strong> ${email}</p>
          <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #ffc700; background-color: #f9f9f9;">
            <p style="margin: 0;">${message}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, discordStatus });
  } catch (error: any) {
    console.error('Error sending email notification:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
