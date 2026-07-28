import { NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import { createClient } from '@supabase/supabase-js';

// Re-usable Supabase Admin client
const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy'
);

// Verify Discord Signature
function verifySignature(req: Request, rawBody: string) {
  const signature = req.headers.get('x-signature-ed25519');
  const timestamp = req.headers.get('x-signature-timestamp');
  const publicKey = process.env.DISCORD_PUBLIC_KEY;

  if (!signature || !timestamp || !publicKey) {
    return false;
  }

  try {
    return nacl.sign.detached.verify(
      Buffer.from(timestamp + rawBody),
      Buffer.from(signature, 'hex'),
      Buffer.from(publicKey, 'hex')
    );
  } catch (error) {
    return false;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  
  if (!verifySignature(req, rawBody)) {
    return NextResponse.json({ error: 'Invalid request signature' }, { status: 401 });
  }

  const interaction = JSON.parse(rawBody);

  // 1. PING check
  if (interaction.type === 1) {
    return NextResponse.json({ type: 1 });
  }

  // 2. Button clicked (MESSAGE_COMPONENT)
  if (interaction.type === 3) {
    const customId = interaction.data.custom_id; // e.g. "reply_12345678-..."
    
    if (customId?.startsWith('reply_')) {
      const ticketId = customId.replace('reply_', '');

      // Respond with a Modal popup
      return NextResponse.json({
        type: 9,
        data: {
          custom_id: `modal_reply_${ticketId}`,
          title: "Responder al Ticket",
          components: [{
            type: 1, // Action Row
            components: [{
              type: 4, // Text Input
              custom_id: "reply_text",
              style: 2, // Paragraph
              label: "Mensaje de respuesta",
              placeholder: "Escribe tu respuesta aquí...",
              required: true
            }]
          }]
        }
      });
    }
  }

  // 3. Modal Submitted (MODAL_SUBMIT)
  if (interaction.type === 5) {
    const customId = interaction.data.custom_id;

    if (customId?.startsWith('modal_reply_')) {
      const ticketId = customId.replace('modal_reply_', '');
      
      // Extract text from the modal
      // Structure: interaction.data.components[0].components[0].value
      let replyText = '';
      try {
        const actionRow = interaction.data.components.find((c: any) => c.type === 1);
        const textInput = actionRow.components.find((c: any) => c.custom_id === 'reply_text');
        replyText = textInput.value;
      } catch (err) {
        console.error("Error parsing modal data:", err);
      }

      if (!replyText) {
        return NextResponse.json({ error: 'Message empty' }, { status: 400 });
      }

      // Insert message into Supabase
      const { error } = await getSupabaseAdmin()
        .from('support_messages')
        .insert({
          ticket_id: ticketId,
          sender_id: null, // No specific user ID because it's an admin from Discord
          message: replyText,
          is_admin: true
        });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({
          type: 4,
          data: { content: "❌ Error al enviar el mensaje a la base de datos.", flags: 64 }
        });
      }

      // Success message (ephemeral so only the admin sees it)
      return NextResponse.json({
        type: 4,
        data: { content: `✅ Respuesta enviada al ticket \`${ticketId}\` correctamente.`, flags: 64 }
      });
    }
  }

  // Fallback
  return NextResponse.json({ type: 4, data: { content: "Interaction not handled" } });
}
