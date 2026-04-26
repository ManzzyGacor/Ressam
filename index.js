// tele: @xyroosoloooo
const { Telegraf, Markup } = require('telegraf');
const archiver = require("archiver");
const { 
    loadUsers, 
    saveUsers, 
    loadJSON, 
    saveJSON, 
    verifyEmail, 
    activateLicense, 
    extractOobCode, 
    createBackup, 
    runtimePanel
} = require('./function/function');

const BOT_TOKEN = '8690666851:AAFNi_SEZGvk2GxIBPVLcj4HmzboXP6r0MA; // ambil token bot di @BotFather
const bot = new Telegraf(BOT_TOKEN);
const OWNER_ID = "7533630775"; // ambil user id di @MissRose_bot
const CHANNEL_USERNAME = '@manzzyidnokos';
const cleanChannel = CHANNEL_USERNAME.replace('@', '');
/*const userId = ctx.from.id.toString();*/

const userSessions = new Map();

const usersFile = './users.json';
const resellerFile = './reseller.json';
const partnerFile = './partner.json';

function isOwner(id) {
    return id.toString() === OWNER_ID;
}

function isPartner(id) {
    const data = loadJSON(partnerFile) || [];
    return data.includes(id.toString());
}

function isReseller(id) {
    const data = loadJSON(resellerFile) || [];
    return data.includes(id.toString());
}

function isAuthorized(id) {
    return isOwner(id) || isPartner(id) || isReseller(id);
}                 

// ================= 📢 𝗔𝗨𝗧𝗢 𝗝𝗢𝗜𝗡 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 =================
async function isJoined(ctx) {
    try {
        const member = await ctx.telegram.getChatMember(CHANNEL_USERNAME, ctx.from.id);
        return ['member', 'administrator', 'creator'].includes(member.status);
    } catch {
        return false;
    }
}

// ================= 🚀 𝗕𝗢𝗧 𝗦𝗧𝗔𝗥𝗧  =================
bot.start(async (ctx) => {
    const userId = ctx.from.id.toString();

    let users = loadJSON(usersFile) || [];

    if (!users.includes(userId)) {
        users.push(userId);
        saveJSON(usersFile, users);

        bot.telegram.sendMessage(
            OWNER_ID,
            `<blockquote><b>🚀 𝗡𝗘𝗪 𝗣𝗘𝗡𝗚𝗚𝗨𝗡𝗔 𝗕𝗢𝗧</b></blockquote>\n` +
            `⤥ 🏷 Nama : ${ctx.from.first_name}\n` +
            `⤥ 👤 Username : @${ctx.from.username || 'No Name'}\n` +
            `⤥ 🆔 ID : <code>${userId}</code>`,
            { parse_mode: 'HTML' }
        );
    }

    if (!(await isJoined(ctx))) {
        return ctx.replyWithHTML(
            `<blockquote><b>🚫 𝗪𝗔𝗝𝗜𝗕 𝗝𝗢𝗜𝗡 𝗖𝗛𝗔𝗡𝗡𝗘𝗟</b></blockquote>\n` +
            `⚘ Silahkan join channel dibawah terlebih dahulu sebelum menggunakan bot.`,
            Markup.inlineKeyboard([
                [
                    Markup.button.url(
                        '☊ 𝗝𝗼𝗶𝗻 𝗖𝗵𝗮𝗻𝗻𝗲𝗹',
                        `https://t.me/${cleanChannel}`
                    )
                ]
            ])
        );
    }

    if (!isAuthorized(userId)) {
        return ctx.replyWithHTML(
            `<blockquote><b>🚫 𝗔𝗞𝗦𝗘𝗦 𝗗𝗜𝗧𝗢𝗟𝗔𝗞</b></blockquote>\n` +
            `💸 Kamu belum membeli akses bot ini, silahkan beli dulu ke @XyrooSoloooo`
        );
    }

    await ctx.replyWithPhoto(
        { url: 'https://files.catbox.moe/zyma5i.jpg' },
        {
            caption: `( 👋🏻 ) 𝗢𝗹𝗮𝗮, 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗧𝗼 Manzzy Assisten 𝗩𝟭.𝟯
      
🤷‍♂️ ϟ Apa yang bisa dilakukan bot ini?
 • Mengaktifkan Premium Alight Motion 🚀  
 • Menjual akun AM Premium 🔥
 • Menjual reseller AM Premium 🎉
 • Stabil & fast respon ⚡
 • Selalu diupdate setiap hari ⚙️
 • Online 24 jam nonstop ⏰
 
🔥 𝖪𝗅𝗂𝗄 𝖳𝗈𝗆𝖻𝗈𝗅 𝖬𝖾𝗇𝗎 𝖣𝗂𝖻𝖺𝗐𝖺𝗁 𝖴𝗇𝗍𝗎𝗄 𝖬𝖾𝗆𝖻𝗎𝗄𝖺 𝖬𝖾𝗇𝗎 𝖡𝗈𝗍.`,
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('〄 𝗠𝗲𝗻𝘂 𝗕𝗼𝘁', 'menu')
                ],
                [
                    Markup.button.url('☊ 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿', 'https://t.me/Manjikeduwa'),
                    Markup.button.url('☊ 𝗖𝗵𝗮𝗻𝗻𝗲𝗹', 'https://t.me/manzzyidnokos')
                ]
            ])
        }
    );
});

// ================= 🔰 𝗕𝗨𝗧𝗧𝗢𝗡 𝗠𝗘𝗡𝗨 =================
bot.action('menu', async (ctx) => {
  await ctx.answerCbQuery(); // penting!

  const userId = ctx.from.id;
  const authorized = isAuthorized(userId);
  const totalUser = (loadJSON(usersFile) || []).length;
  const uptime = process.uptime();
  const runtime = runtimePanel(uptime);
    
  if (!(await isJoined(ctx))) return;
  if (!authorized) return;

  const menu = `
<blockquote><b>🤖 𝗕𝗼𝘁 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻</b></blockquote>
▢ 𝖭𝖺𝗆𝖾 : Manzzy 𝖠𝗌𝗂𝗌𝗍𝖾𝗇
▢ 𝖵𝖾𝗋𝗌𝗂𝗈𝗇 : 𝖵𝟣.𝟥 ☓ 𝖵𝗂𝗉 𝖡𝗎𝗒 𝖮𝗇𝗅𝗒
▢ 𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋 : @Manjikeduwa
▢ 𝖯𝗋𝖾𝖿𝗂𝗑𝖾𝗌 : / ( 𝖲𝗅𝖺𝗌𝗁 ) 
▢ 𝖫𝖺𝗇𝗀𝗎𝖺𝗀𝖾 : 𝖳𝖾𝗅𝖾𝗀𝗋𝖺𝖿
▢ 𝖳𝗈𝗍𝖺𝗅 𝖴𝗌𝖾𝗋 : <b>${totalUser}</b>
▢ 𝖱𝗎𝗇𝗍𝗂𝗆𝖾 𝖯𝖺𝗇𝖾𝗅 : <b>${runtime}</b>

<b>🎉 𝗦𝗲𝗹𝗮𝗺𝗮𝘁 𝗠𝗲𝗻𝗴𝗴𝘂𝗻𝗮𝗸𝗮𝗻 𝗕𝗼𝘁, 𝗝𝗮𝗻𝗴𝗮𝗻 𝗟𝘂𝗽𝗮 𝗜𝗸𝘂𝘁𝗶 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘀𝗶 𝗕𝗼𝘁 𝗗𝗶𝗯𝗮𝘄𝗮𝗵!</b>
`;  
      
  await ctx.editMessageCaption(menu, {
    parse_mode: 'HTML', 
    ...Markup.inlineKeyboard([        
        [
          Markup.button.callback('✦ 𝗠𝗲𝗻𝘂 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲', 'database'), 
          Markup.button.callback('✦ 𝗠𝗲𝗻𝘂 𝗧𝗾𝘁𝗼', 'tqto') 
        ], 
        [
          Markup.button.callback('〄 𝗩𝗲𝗿𝗶𝗳𝗶𝗸𝗮𝘀𝗶 𝗔𝗹𝗶𝗴𝗵𝘁 𝗠𝗼𝗻𝘁𝗶𝗼𝗻', 'verifam')
        ], 
        [
          Markup.button.callback('✦ 𝗕𝗿𝗼𝗮𝗱𝗰𝗮𝘀𝘁', 'bc'), 
          Markup.button.callback('✦ 𝗕𝗮𝗰𝗸𝘂𝗽 𝗦𝗰', 'backup') 
        ], 
        [
          Markup.button.url('☊ 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿', 'https://t.me/xyroosoloooo'), 
          Markup.button.url('☊ 𝗖𝗵𝗮𝗻𝗻𝗲𝗹', 'https://t.me/allinfoscxyroo')
        ]
      ])
    }
  );
});

//============ 📜 𝗠𝗘𝗡𝗨 𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘 ===========
bot.action('database', async (ctx) => {
  await ctx.answerCbQuery()

  await ctx.editMessageCaption(
    '<blockquote><b>📂 𝗠𝗘𝗡𝗨 𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘 𝗖𝗬𝗥𝗢𝗢 𝗔𝗦𝗜𝗦𝗧𝗘𝗡</b></blockquote>',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback('➕ 𝗧𝗮𝗺𝗯𝗮𝗵 𝗥𝗲𝘀𝗲𝗹𝗹𝗲𝗿', 'address'),
          Markup.button.callback('🗑 𝗛𝗮𝗽𝘂𝘀 𝗥𝗲𝘀𝗲𝗹𝗹𝗲𝗿', 'delress')
        ],
        [
          Markup.button.callback('➕ 𝗧𝗮𝗺𝗯𝗮𝗵 𝗣𝗮𝗿𝘁𝗻𝗲𝗿', 'addpt'),
          Markup.button.callback('🗑 𝗛𝗮𝗽𝘂𝘀 𝗣𝗮𝗿𝘁𝗻𝗲𝗿', 'delpt')
        ],
        [
          Markup.button.callback('📋 𝗟𝗶𝘀𝘁 𝗥𝗲𝘀𝗲𝗹𝗹𝗲𝗿', 'listreseller'),
          Markup.button.callback('📋 𝗟𝗶𝘀𝘁 𝗣𝗮𝗿𝘁𝗻𝗲𝗿', 'listpartner')
        ],
        [
          Markup.button.callback('🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', 'menu')
        ]
      ])
    }
  )
})

bot.action('tqto', async (ctx) => {
  await ctx.answerCbQuery();

  const text = `
<blockquote><b>〢╾──✦  𝗧𝗛𝗔𝗡𝗞𝗦 𝗧𝗢  ✦──╼〢</b></blockquote>
🚀 <b>𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 :</b>
 • @XyrooSolooo

🤝 <b>𝗕𝗲𝘀𝘁 𝗦𝘂𝗽𝗽𝗼𝗿𝘁 :</b>
 • @Rkyyzz ↯ 𝖪𝖺𝗇𝗀 𝖥𝗂𝗑
 • @Zebuild ↯ 𝖬𝗒 𝖯𝗋𝖾𝗇
 • @Fantzy_reals13 ↯ 𝖯𝖺𝗇𝖼𝗂 𝖳𝗎𝗅𝖺𝗅𝗂𝗍

💖 <b>𝗦𝗽𝗲𝗰𝗶𝗮𝗹 𝗧𝗵𝗮𝗻𝗸𝘀 :</b>
 • 𝖠𝗅𝗅𝖺𝗁 𝖲𝖶𝖳 ↯ 𝖳𝗎𝗁𝖺𝗇 𝖪𝗎
 • 𝖮𝗋𝖺𝗇𝗀 𝖳𝗎𝖺 ↯ 𝖮𝗋𝗍𝗎 𝖪𝗎
 • 𝖠𝗅𝗅 𝖥𝗋𝗂𝖾𝗇𝖽 ↯ 𝖡𝖾𝗌𝗍 𝖯𝗋𝖾𝗇
 • 𝖠𝗅𝗅 𝖡𝗎𝗒𝖾𝗋 𝖲𝖼 𝖠𝗎𝗍𝗈 𝖠𝗆 𝖯𝗋𝖾𝗆
 • 𝖠𝗅𝗅 𝖱𝖾𝗌𝖾𝗅𝗅𝖾𝗋 𝖲𝖼 𝖠𝗎𝗍𝗈 𝖠𝗆 𝖯𝗋𝖾𝗆

🚀 𝗧𝗲𝗿𝗶𝗺𝗮𝗸𝗮𝘀𝗶𝗵 𝗦𝘂𝗱𝗮𝗵 𝗠𝗲𝗻𝗴𝗴𝘂𝗻𝗮𝗸𝗮𝗻 𝗕𝗼𝘁 𝗜𝗻𝗶!
`;

  await ctx.editMessageCaption(text, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', 'menu')]
    ])
  });
});

// ================= ADD RESELLER =================
bot.action('address', (ctx) => {
  const userId = ctx.from.id.toString();
  if (!(isOwner(ctx.from.id) || isPartner(ctx.from.id))) {
    return ctx.answerCbQuery('🚫 𝗞𝗮𝗺𝘂 𝗧𝗶𝗱𝗮𝗸 𝗠𝗲𝗺𝗶𝗹𝗶𝗸𝗶 𝗔𝗸𝘀𝗲𝘀')
  }

  userSessions.delete(userId)
  userSessions.set(userId, { mode: 'address' })
    
  ctx.answerCbQuery()
  ctx.editMessageCaption(
    '📩 𝗦𝗶𝗹𝗮𝗵𝗸𝗮𝗻 𝗞𝗶𝗿𝗶𝗺 𝗜𝗗 𝗨𝘀𝗲𝗿 𝗬𝗮𝗻𝗴 𝗜𝗻𝗴𝗶𝗻 𝗗𝗶𝘁𝗮𝗺𝗯𝗮𝗵𝗸𝗮𝗻 𝗞𝗲 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗥𝗲𝘀𝗲𝗹𝗹𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺.',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', callback_data: 'database' }]
        ]
      }
    }
  )
})

// ================= DEL RESELLER =================
bot.action('delress', (ctx) => {
  const userId = ctx.from.id.toString();
  if (!(isOwner(ctx.from.id) || isPartner(ctx.from.id))) {
    return ctx.answerCbQuery('🚫 𝗞𝗮𝗺𝘂 𝗧𝗶𝗱𝗮𝗸 𝗠𝗲𝗺𝗶𝗹𝗶𝗸𝗶 𝗔𝗸𝘀𝗲𝘀')
  }

  userSessions.delete(userId)
  userSessions.set(userId, { mode: 'delress' })
    
  ctx.answerCbQuery()
  ctx.editMessageCaption(
    '📩 𝗦𝗶𝗹𝗮𝗵𝗸𝗮𝗻 𝗞𝗶𝗿𝗶𝗺 𝗜𝗗 𝗨𝘀𝗲𝗿 𝗬𝗮𝗻𝗴 𝗜𝗻𝗴𝗶𝗻 𝗗𝗶𝗵𝗮𝗽𝘂𝘀 𝗗𝗮𝗿𝗶 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗥𝗲𝘀𝗲𝗹𝗹𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺.',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', callback_data: 'database' }]
        ]
      }
    }
  )
})

// ================= ADD PARTNER =================
bot.action('addpt', (ctx) => {
  const userId = ctx.from.id.toString();
  if (!isOwner(ctx.from.id)) {
    return ctx.answerCbQuery('🚫 𝗞𝗮𝗺𝘂 𝗧𝗶𝗱𝗮𝗸 𝗠𝗲𝗺𝗶𝗹𝗶𝗸𝗶 𝗔𝗸𝘀𝗲𝘀')
  }

  userSessions.delete(userId)
  userSessions.set(userId, { mode: 'addpt' })
    
  ctx.answerCbQuery()
  ctx.editMessageCaption(
    '📩 𝗦𝗶𝗹𝗮𝗵𝗸𝗮𝗻 𝗞𝗶𝗿𝗶𝗺 𝗜𝗗 𝗨𝘀𝗲𝗿 𝗬𝗮𝗻𝗴 𝗜𝗻𝗴𝗶𝗻 𝗗𝗶𝘁𝗮𝗺𝗯𝗮𝗵𝗸𝗮𝗻 𝗞𝗲 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗣𝗮𝗿𝘁𝗻𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺.',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', callback_data: 'database' }]
        ]
      }
    }
  )
})

// ================= DEL PARTNER =================
bot.action('delpt', (ctx) => {
  const userId = ctx.from.id.toString();
  if (!isOwner(ctx.from.id)) {
    return ctx.answerCbQuery('🚫 𝗞𝗮𝗺𝘂 𝗧𝗶𝗱𝗮𝗸 𝗠𝗲𝗺𝗶𝗹𝗶𝗸𝗶 𝗔𝗸𝘀𝗲𝘀')
  }

  userSessions.delete(userId)
  userSessions.set(userId, { mode: 'delpt' })
    
  ctx.answerCbQuery()
  ctx.editMessageCaption(
    '📩 𝗦𝗶𝗹𝗮𝗵𝗸𝗮𝗻 𝗞𝗶𝗿𝗶𝗺 𝗜𝗗 𝗨𝘀𝗲𝗿 𝗬𝗮𝗻𝗴 𝗜𝗻𝗴𝗶𝗻 𝗗𝗶𝗵𝗮𝗽𝘂𝘀 𝗗𝗮𝗿𝗶 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗣𝗮𝗿𝘁𝗻𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺.',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', callback_data: 'database' }]
        ]
      }
    }
  )
})

//============== 📜 𝗟𝗜𝗦𝗧 𝗥𝗘𝗦𝗘𝗟𝗟𝗘𝗥 & PARNTER ==============
bot.action('listreseller', async (ctx) => {
  await ctx.answerCbQuery()

  const data = loadJSON(resellerFile) || []

  let text = `<blockquote><b>📂 𝗟𝗜𝗦𝗧 𝗥𝗘𝗦𝗘𝗟𝗟𝗘𝗥 𝗔𝗠 𝗣𝗥𝗘𝗠𝗜𝗨𝗠</b></blockquote>\n`

  if (!data.length) {
    text += '❌ 𝗕𝗲𝗹𝘂𝗺 𝗔𝗱𝗮 𝗥𝗲𝘀𝗲𝗹𝗹𝗲𝗿 𝗬𝗮𝗻𝗴 𝗧𝗲𝗿𝗱𝗮𝗳𝘁𝗮𝗿.'
  } else {
    data.forEach((id, i) => {
      text += `${i + 1}. <code>${id}</code>\n`
    })
  }

  await ctx.editMessageCaption(text, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', 'database')]
    ])
  })
})

bot.action('listpartner', async (ctx) => {
  await ctx.answerCbQuery()

  const data = loadJSON(partnerFile) || []

  let text = `<blockquote><b>📂 𝗟𝗜𝗦𝗧 𝗣𝗔𝗥𝗧𝗡𝗘𝗥 𝗔𝗠 𝗣𝗥𝗘𝗠𝗜𝗨𝗠</b></blockquote>\n`

  if (!data.length) {
    text += '❌ 𝗕𝗲𝗹𝘂𝗺 𝗔𝗱𝗮 𝗣𝗮𝗿𝘁𝗻𝗲𝗿 𝗬𝗮𝗻𝗴 𝗧𝗲𝗿𝗱𝗮𝗳𝘁𝗮𝗿'
  } else {
    data.forEach((id, i) => {
      text += `${i + 1}. <code>${id}</code>\n`
    })
  }

  await ctx.editMessageCaption(text, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', 'database')]
    ])
  })
})

bot.action('verifam', async (ctx) => {
   const userId = ctx.from.id.toString();
    
   try {
       
    await ctx.answerCbQuery();
        
    const authorized = isAuthorized(userId);
    
    if (!authorized) {
    return ctx.reply('🚫 𝖪𝖺𝗆𝗎 𝖳𝗂𝖽𝖺𝗄 𝖬𝖾𝗆𝗂𝗅𝗂𝗄𝗂 𝖠𝗄𝗌𝖾𝗌 𝖡𝗈𝗍.');
}
    
    const userSession = userSessions.get(userId);
    
    if (userSession && userSession.step !== 'idle') {
            return ctx.replyWithHTML('<blockquote><b>⚠️ 𝗚𝗔𝗚𝗔𝗟 𝗩𝗘𝗥𝗜𝗙𝗜𝗞𝗔𝗦𝗜</b></blockquote>\n📝 𝖲𝖾𝗅𝖾𝗌𝖺𝗂𝗄𝖺𝗇 𝖵𝖾𝗋𝗂𝖿𝗂𝗄𝖺𝗌𝗂 𝖠𝗅𝗂𝗀𝗁𝗍 𝖬𝗈𝗇𝗍𝗂𝗈𝗇 𝖪𝖺𝗆𝗎 𝖲𝖾𝖻𝖾𝗅𝗎𝗆𝗇𝗒𝖺 𝖧𝗂𝗇𝗀𝗀𝖺 𝖶𝖺𝗄𝗍𝗎 𝖲𝖾𝗅𝖾𝗌𝖺𝗂.');
    }
    
    userSessions.delete(userId)
    userSessions.set(userId, { 
        step: 'waiting_email'
    });
    await ctx.reply('📧 ϟ 𝖲𝗂𝗅𝖺𝗁𝗄𝖺𝗇 𝖪𝗂𝗋𝗂𝗆 𝖤𝗆𝖺𝗂𝗅 𝖪𝖺𝗆𝗎 𝖴𝗇𝗍𝗎𝗄 𝖵𝖾𝗋𝗂𝖿 𝖪𝖾 𝖠𝗅𝗂𝗀𝗁𝗍 𝖬𝗈𝗇𝗍𝗂𝗈𝗇 𝖯𝗋𝖾𝗆𝗂𝗎𝗆 ( 𝖤𝗆𝖺𝗂𝗅 𝖡𝖾𝖻𝖺𝗌 ) :');
            
        } catch (error) {
            userSessions.delete(userId); 
            await ctx.reply(`❌ 𝖤𝗋𝗋𝗈𝗋 : ${error.message}`);
        }  
});

bot.action('bc', async (ctx) => {
  if (!isOwner(ctx.from.id)) return ctx.answerCbQuery('🚫 𝗢𝘄𝗻𝗲𝗿 𝗢𝗻𝗹𝘆.');

  const userId = ctx.from.id.toString();

  userSessions.set(userId, { mode: 'broadcast' });

  await ctx.answerCbQuery();

await ctx.editMessageCaption(
  '📢 𝖪𝗂𝗋𝗂𝗆 𝖯𝖾𝗌𝖺𝗇 𝖸𝖺𝗇𝗀 𝖨𝗇𝗀𝗂𝗇 𝖠𝗇𝖽𝖺 𝖡𝗋𝗈𝖺𝖽𝖼𝖺𝗌𝗍 𝖪𝖾 𝖴𝗌𝖾𝗋.',
  {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', callback_data: 'menu' }
        ]
      ]
    }
  }
);
});

bot.action('backup', async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageCaption('⚙️ 𝗕𝗮𝗰𝗸𝘂𝗽 𝗦𝘆𝘀𝘁𝗲𝗺 :', Markup.inlineKeyboard([
        [
          Markup.button.callback('📁 𝗕𝗮𝗰𝗸𝘂𝗽 𝗙𝘂𝗹𝗹 𝗦𝗰𝗿𝗶𝗽𝘁', 'backup_now'), 
          Markup.button.callback('🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', 'menu') 
        ]
    ]));
});

bot.action('backup_now', async (ctx) => {
    try {
        await ctx.answerCbQuery();

        const filePath = await createBackup();

        await ctx.replyWithDocument({
            source: filePath
        }, {
            caption: '📦 𝗛𝗮𝘀𝗶𝗹 𝗕𝗮𝗰𝗸𝘂𝗽 𝗙𝘂𝗹𝗹 𝗦𝗰𝗿𝗶𝗽𝘁'
        }); 

    } catch (err) {
        console.log(err);
        ctx.reply('❌ 𝖡𝖺𝖼𝗄𝗎𝗉 𝖦𝖺𝗀𝖺𝗅, 𝖳𝖾𝗋𝗃𝖺𝖽𝗂 𝖤𝗋𝗋𝗈𝗋 𝖯𝖺𝖽𝖺 𝖯𝖺𝗇𝖾𝗅/𝖡𝗈𝗍');
    }
});
    
// ================= HANDLER UTAMA =================
bot.on('message', async (ctx) => {
  if (ctx.message.text?.startsWith('/')) return
  
  const userId = ctx.from.id.toString();
  const text = ctx.message.text
  const session = userSessions.get(userId)
  
  if (!session) return;

  try {
    // ================= ADD RESELLER =================
    if (session.mode === 'address') {
      if (!ctx.message.text) return ctx.reply('❌ 𝗞𝗶𝗿𝗶𝗺 𝗜𝗗 𝗨𝘀𝗲𝗿.')

      let data = loadJSON(resellerFile) || []
      const id = ctx.message.text.trim()

      if (data.includes(id)) {
        return ctx.reply('⚠️ 𝗜𝗗 𝗧𝗲𝗿𝘀𝗲𝗯𝘂𝘁 𝗦𝘂𝗱𝗮𝗵 𝗔𝗱𝗮 𝗗𝗶𝗱𝗮𝗹𝗮𝗺 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗥𝗲𝘀𝗲𝗹𝗹𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.')
      }

      data.push(id)
      saveJSON(resellerFile, data)

      ctx.reply(`✅ 𝗨𝘀𝗲𝗿 ${id} 𝗕𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗗𝗶𝘁𝗮𝗺𝗯𝗮𝗵𝗸𝗮𝗻 𝗞𝗲 𝗗𝗮𝗹𝗮𝗺 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗥𝗲𝘀𝗲𝗹𝗹𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.`)
      userSessions.delete(ctx.from.id)
    }

    // ================= DEL RESELLER =================
    else if (session.mode === 'delress') {
      if (!ctx.message.text) return ctx.reply('❌ 𝗞𝗶𝗿𝗶𝗺 𝗜𝗗 𝗨𝘀𝗲𝗿.')

      let data = loadJSON(resellerFile) || []
      const id = ctx.message.text.trim()

      if (!data.includes(id)) {
        return ctx.reply('❌ 𝗜𝗗 𝗨𝘀𝗲𝗿 𝗧𝗲𝗿𝘀𝗲𝗯𝘂𝘁 𝗕𝘂𝗸𝗮𝗻 𝗥𝗲𝘀𝗲𝗹𝗹𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.')
      }

      data = data.filter(x => x !== id)
      saveJSON(resellerFile, data)

      ctx.reply(`🗑 𝗨𝘀𝗲𝗿 ${id} 𝗕𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗗𝗶𝗵𝗮𝗽𝘂𝘀 𝗗𝗮𝗿𝗶 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗥𝗲𝘀𝗲𝗹𝗹𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.`)
      userSessions.delete(ctx.from.id)
    }

    // ================= ADD PARTNER =================
    else if (session.mode === 'addpt') {
      if (!ctx.message.text) return ctx.reply('❌ 𝗞𝗶𝗿𝗶𝗺 𝗜𝗗 𝗨𝘀𝗲𝗿.')

      let data = loadJSON(partnerFile) || []
      const id = ctx.message.text.trim()

      if (data.includes(id)) {
        userSessions.delete(ctx.from.id)
        return ctx.reply('⚠️ 𝗜𝗗 𝗧𝗲𝗿𝘀𝗲𝗯𝘂𝘁 𝗦𝘂𝗱𝗮𝗵 𝗧𝗲𝗿𝗱𝗮𝗳𝘁𝗮𝗿 𝗗𝗶𝗱𝗮𝗹𝗮𝗺 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗣𝗮𝗿𝘁𝗻𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.')
      }

      data.push(id)
      saveJSON(partnerFile, data)

      ctx.reply(`✅ 𝗨𝘀𝗲𝗿 ${id} 𝗕𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗗𝗶𝘁𝗮𝗺𝗯𝗮𝗵𝗸𝗮𝗻 𝗞𝗲 𝗗𝗮𝗹𝗮𝗺 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗣𝗮𝗿𝘁𝗻𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.`)
      userSessions.delete(ctx.from.id)
    }

    // ================= DEL PARTNER =================
    else if (session.mode === 'delpt') {
      if (!ctx.message.text) return ctx.reply('❌ 𝗞𝗶𝗿𝗶𝗺 𝗜𝗗 𝗨𝘀𝗲𝗿.')

      let data = loadJSON(partnerFile) || []
      const id = ctx.message.text.trim()

      if (!data.includes(id)) {
        return ctx.reply('❌ 𝗜𝗗 𝗧𝗲𝗿𝘀𝗲𝗯𝘂𝘁 𝗕𝘂𝗸𝗮𝗻 𝗣𝗮𝗿𝘁𝗻𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺𝗶𝘂𝗺')
      }

      data = data.filter(x => x !== id)
      saveJSON(partnerFile, data)

      ctx.reply(`🗑 𝗨𝘀𝗲𝗿 ${id} 𝗕𝗲𝗿𝗵𝗮𝘀𝗶𝗹 𝗗𝗶𝗵𝗮𝗽𝘂𝘀 𝗗𝗮𝗿𝗶 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗣𝗮𝗿𝘁𝗻𝗲𝗿 𝗔𝗺 𝗣𝗿𝗲𝗺𝗶𝘂𝗺.`)
      userSessions.delete(ctx.from.id)
    }
    // ======== BROADCAST ======== //
    else if (session.mode === 'broadcast') {
  // 🔐 double check
  if (!isOwner(ctx.from.id)) {
    userSessions.delete(userId);
    return ctx.editMessageCaption('🚫 𝗔𝗸𝘀𝗲𝘀 𝗗𝗶𝘁𝗼𝗹𝗮𝗸!');
  }

  const text = ctx.message.text;
  if (!text) return ctx.editMessageCaption('❌ 𝖮𝗇𝗅𝗒 𝖳𝖾𝗄𝗌!');

  const users = loadJSON(usersFile) || [];

  let sukses = 0;
  let gagal = 0;

  for (let id of users) {
    try {
      await bot.telegram.sendMessage(id, text);
      sukses++;
      await new Promise(res => setTimeout(res, 100));
    } catch {
      gagal++;
    }
  }

  await ctx.reply(
    `📢 𝗕𝗿𝗼𝗮𝗱𝗰𝗮𝘀𝘁 𝗦𝗲𝗹𝗲𝘀𝗮𝗶\n✅ 𝖲𝗎𝗄𝗌𝖾𝗌 : ${sukses} 𝖴𝗌𝖾𝗋\n❌ 𝖦𝖺𝗀𝖺𝗅 : ${gagal} 𝖴𝗌𝖾𝗋`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔙 𝗞𝗲𝗺𝗯𝗮𝗹𝗶', callback_data: 'menu' }]
        ]
      }
    }
  );

  userSessions.delete(userId);
}
    
    // ================= VERIFIKASI EMAIL =================
    else if (session.step === 'waiting_email') {
      session.email = text;
      session.step = 'waiting_verification';
      userSessions.set(userId, session);
      
      await ctx.reply(`📧 𝖡𝗈𝗍 𝖲𝖾𝗀𝖾𝗋𝖺 𝖬𝖾𝗆𝗏𝖾𝗋𝗂𝖿𝗂𝗄𝖺𝗌𝗂 𝖤𝗆𝖺𝗂𝗅 : ${text}`);
      await ctx.reply('⏳ 𝖡𝗈𝗍 𝖲𝖾𝖽𝖺𝗇𝗀 𝖬𝖾𝗆𝗏𝖾𝗋𝗂𝖿𝗂𝗄𝖺𝗌𝗂 𝖤𝗆𝖺𝗂𝗅');
      
      try {
        const verifyResult = verifyEmail(text);

        if (!verifyResult) {
          userSessions.delete(userId);
          return ctx.reply('❌ Gagal verifikasi email, kemungkinan API error / email tidak valid.');
        }
        
        session.verifyResult = verifyResult;
        session.step = 'waiting_oob';
        
        if (session.timer) clearTimeout(session.timer);
        
        session.createdAt = Date.now();
       
        session.timer = setTimeout(() => {
          const currentSession = userSessions.get(userId);
          if (currentSession && currentSession.step === 'waiting_oob') {
            userSessions.delete(userId);
            ctx.reply('⏰ ϟ 𝖶𝖺𝗄𝗍𝗎 𝖵𝖾𝗋𝗂𝖿𝗂𝗄𝖺𝗌𝗂 𝖧𝖺𝗇𝗒𝖺 𝟧 𝖬𝖾𝗇𝗂𝗍, 𝖩𝗂𝗄𝖺 𝖲𝗎𝖽𝖺𝗁 𝟧 𝖬𝖾𝗇𝗂𝗍 𝖬𝖺𝗄𝖺 𝖯𝗋𝗈𝗌𝖾𝗌 𝖣𝗂𝖻𝖺𝗍𝖺𝗅𝗄𝖺𝗇 𝖮𝗍𝗈𝗆𝖺𝗍𝗂𝗌. 𝖲𝗂𝗅𝖺𝗁𝗄𝖺𝗇 𝖵𝖾𝗋𝗂𝖿𝗂𝗄𝖺𝗌𝗂 𝖴𝗅𝖺𝗇𝗀 ( 𝖪𝖾𝗍𝗂𝗄 /verifam ).');
          }
        }, 300000);
        
        userSessions.set(userId, session);
        
        let message = '<blockquote><b>📋 𝗛𝗮𝘀𝗶𝗹 𝗩𝗲𝗿𝗶𝗳𝗶𝗸𝗮𝘀𝗶 𝗞𝗮𝗺𝘂 :</b></blockquote>\n';
        message += `✅ 𝖲𝗍𝖺𝗍𝗎𝗌 : 𝖡𝖾𝗋𝗁𝖺𝗌𝗂𝗅\n`;
        message += `🆔 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝖨𝖣 : <code>${verifyResult.requestId}</code>\n`;
        message += `📧 𝖤𝗆𝖺𝗂𝗅 : <code>${verifyResult.email}</code>\n\n`;
        message += `⏰ 𝖲𝗂𝗅𝖺𝗁𝗄𝖺𝗇 𝖪𝗂𝗋𝗂𝗆 𝖫𝗂𝗇𝗄 𝖠𝗍𝖺𝗎 𝖮𝖮𝖡 𝖢𝗈𝖽𝖾 ( 𝖬𝖺𝗄𝗌𝗂𝗆𝖺𝗅 𝟧 𝖬𝖾𝗇𝗂𝗍 ) :\n\n`;
        message += `<blockquote><b>⚙️ 𝗖𝗮𝗿𝗮 𝗠𝗲𝗻𝗱𝗮𝗽𝗮𝘁𝗸𝗮𝗻 𝗟𝗶𝗻𝗸/𝗢𝗢𝗕 𝗖𝗼𝗱𝗲 :</b></blockquote>\n`;
        message += `𝟣. 𝖬𝖺𝗌𝗎𝗄 𝖪𝖾 𝖠𝗄𝗎𝗇 𝖦𝗆𝖺𝗂𝗅 𝖨𝗍𝗎 ( 𝖠𝗉𝗄 𝖤𝗆𝖺𝗂𝗅 𝖪𝖺𝗆𝗎 )\n`;
        message += `𝟤. 𝖯𝖾𝗇𝖼𝖾𝗍 𝖦𝖺𝗋𝗂𝗌 𝟥 𝖯𝗈𝗃𝗈𝗄 𝖪𝗂𝗋𝗂 𝖠𝗍𝖺𝗌 > 𝖯𝗂𝗅𝗂𝗁 𝖮𝗉𝗌𝗂 𝖲𝗉𝖺𝗆\n`;
        message += `𝟥. 𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝖣𝗂 𝖡𝖺𝗀𝗂𝖺𝗇 𝖲𝗉𝖺𝗆 ( 𝖪𝖺𝗅𝗈 𝖠𝖽𝖺 𝖫𝗂𝗇𝗄 𝖭𝗒𝖺 𝖳𝖾𝗄𝖺𝗇 𝖠𝗃𝖺 𝖫𝗂𝗇𝗄 𝖶𝖺𝗋𝗇𝖺 𝖡𝗂𝗋𝗎 )\n`;
        message += `𝟦. 𝖪𝗂𝗋𝗂𝗆 𝖫𝗂𝗇𝗄 𝖨𝗍𝗎 𝖪𝖾 𝖡𝗈𝗍, 𝖫𝖺𝗅𝗎 𝖳𝗎𝗇𝗀𝗀𝗎 𝖡𝖾𝖻𝖾𝗋𝖺𝗉𝖺 Menit\n\n`;
        message += '🤷‍♂️ 𝗞𝗮𝗺𝘂 𝗧𝗶𝗱𝗮𝗸 𝗣𝗮𝗵𝗮𝗺? 𝗕𝗶𝘀𝗮 𝗧𝗮𝗻𝘆𝗮𝗸𝗮𝗻 𝗞𝗲 𝗢𝘄𝗻𝗲𝗿 𝗕𝗼𝘁 𝗔𝘁𝗮𝘂 𝗖𝗲𝗸 𝗧𝘂𝘁𝗼𝗿𝗶𝗮𝗹 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 @allinfoscxyroo\n';
        
        await ctx.replyWithHTML(message);
      } catch (error) {
        userSessions.delete(userId);
        await ctx.reply(`❌ 𝖤𝗋𝗋𝗈𝗋 : ${error.message}`);
      }
    } 
    else if (session.step === 'waiting_oob') {
      if (session.timer) {
        clearTimeout(session.timer);
      }
      
      try {
        const oobCode = extractOobCode(text);

        if (!oobCode) {
          return ctx.reply('❌ OOB tidak valid / link salah');
        }
        
        await ctx.reply('✅ ϟ 𝖮𝖮𝖡 𝖳𝖾𝗅𝖺𝗁 𝖡𝖾𝗋𝗁𝖺𝗌𝗂𝗅 𝖣𝗂 𝖤𝗄𝗌𝗍𝗋𝖺𝗄');
        await ctx.reply('⏳ ϟ 𝖬𝖾𝗇𝗀𝖺𝗄𝗍𝗂𝖿𝗄𝖺𝗇 𝖫𝗂𝗌𝖾𝗇𝗌𝗂...');
        
        const activateResult = await activateLicense(session.email, oobCode);
        
        let message = '<blockquote><b>✅ 𝗔𝗸𝘁𝗶𝘃𝗮𝘀𝗶 𝗧𝗲𝗹𝗮𝗵 𝗕𝗲𝗿𝗵𝗮𝘀𝗶𝗹</b></blockquote>\n';
        message += `✅ 𝖲𝗍𝖺𝗍𝗎𝗌 : 𝖡𝖾𝗋𝗁𝖺𝗌𝗂𝗅\n`;
        message += `🆔 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝖨𝖣 : ${activateResult.requestId}\n`;
        message += `📧 𝖤𝗆𝖺𝗂𝗅 : ${activateResult.email}\n`;
        message += `📅 𝖠𝗄𝗍𝗂𝖿 : ${activateResult.subscription.startDate}\n`;
        message += `⌛ 𝖡𝖾𝗋𝖺𝗄𝗁𝗂𝗋 𝖯𝖺𝖽𝖺 : ${activateResult.subscription.expiryDate}\n`;
        message += `📝 𝖭𝗈𝗍𝖾 : ${activateResult.subscription.expiryDateFull}`;
        
        await ctx.replyWithHTML(message);
        userSessions.delete(userId);
        
      } catch (err) {
        console.log(err);
        ctx.reply('❌ 𝗧𝗲𝗿𝗷𝗮𝗱𝗶 𝗘𝗿𝗿𝗼𝗿 𝗣𝗮𝗱𝗮 𝗜𝗻𝗱𝗲𝘅.𝗷𝘀, 𝗦𝗲𝗴𝗲𝗿𝗮 𝗣𝗲𝗿𝗶𝗸𝘀𝗮 𝗣𝗮𝗻𝗲𝗹 & 𝗟𝗮𝗽𝗼𝗿 𝗞𝗲 @XyrooSoloooo');
      }
    }
  } catch (error) {
    console.error('Error in message handler:', error);
    ctx.reply('❌ Terjadi kesalahan, silakan coba lagi nanti.');
  }
});

bot.launch();

setInterval(async () => {
    try {
        const filePath = await createBackup();

        await bot.telegram.sendDocument(OWNER_ID, {
            source: filePath
        }, {
            caption: '📦 𝗕𝗮𝗰𝗸𝘂𝗽 𝗢𝘁𝗼𝗺𝗮𝘁𝗶𝘀 𝟮 𝗝𝗮𝗺 𝟭× 𝗦𝗲𝗹𝗮𝗺𝗮 𝟮𝟰 𝗝𝗮𝗺 𝗣𝗲𝗻𝘂𝗵'
        });

    } catch (err) {
        console.log('Backup error:', err);
    }
}, 2 * 60 * 60 * 1000);

console.log('🤖 Cyroo Asisten Berjalan...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));