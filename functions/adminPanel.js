import { getUsers,checkAccess, checkAdminAccess } from "./botFunctions.js";
export async function adminPanel(bot)
{
  bot.command('admin', async (ctx)=>
    {
    console.log(`Admin access = ${checkAdminAccess(ctx.chat.id)}`)
    if(checkAccess(ctx.chat.id)==true && checkAdminAccess(ctx.chat.id) == true)
      ctx.reply('Take it, boy',{ reply_markup: JSON.stringify(adminSelector1) })
    })
    bot.on('callback_query', async (ctx,next) => 
    {
        const action = ctx.update.callback_query.data;
        switch (action)
        {
          case 'getUsers':ctx.editMessageText(`Allowed users:\n${getUsers()}`.replace(',',''))

          break;
          case 'RemoveAccess': ctx.reply('This feature is in developement')
          break;
          case 'cancel': ctx.editMessageText('okay, got you')
        }
        await next();
    })
        
}

const adminSelector1 =
{
  inline_keyboard: 
    [
      [{ text: 'Get authorized users', callback_data: 'getUsers' }],
      [{ text: 'Remove access for specific user', callback_data: 'RemoveAccess' }],
      [{ text: 'Cancel', callback_data: 'cancel' }],
    ]
} 