const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanEmptyChats() {
  const { data: chats } = await supabase.from('support_chats').select('id');
  const { data: msgs } = await supabase.from('support_messages').select('chat_id');
  
  const chatIdsWithMsgs = new Set(msgs.map(m => m.chat_id));
  const emptyChatIds = chats.filter(c => !chatIdsWithMsgs.has(c.id)).map(c => c.id);
  
  if (emptyChatIds.length > 0) {
    console.log(`Deleting ${emptyChatIds.length} empty chats...`);
    for (const id of emptyChatIds) {
      await supabase.from('support_chats').delete().eq('id', id);
      console.log(`Deleted empty chat ${id}`);
    }
  } else {
    console.log('No empty chats found.');
  }
}

cleanEmptyChats();
