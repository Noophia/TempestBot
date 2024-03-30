import { checkAccess, removeUser, report } from './functions/botFunctions.js';
import { Telegraf } from 'telegraf';
import { adminPanel} from './functions/adminPanel.js';
import { auth } from './functions/authorization.js';
import { tokens } from './credentials.js';


const bot_token = tokens.teri_token;
const bot = new Telegraf(bot_token)


// мониторинг всех сообщений боту
bot.on('message', async (ctx, next) => {console.log(ctx.message); await next()}) 
//Запуск бота в телеге
bot.start(async(ctx)=>
{
    if(checkAccess(ctx.chat.id)==true)
        ctx.reply(`Welcome, ${ctx.chat.first_name}! What shall we do today?`)
    else ctx.reply ('use /authorize command to get access to the bot')
})
auth(bot)
adminPanel(bot)

bot.command('removeAccess', async (ctx)=>
{
    if (checkAccess(ctx.chat.id)==true)
    {
        const userId = parseInt(ctx.message.text.split(' ')[1]);
        if (!isNaN(userId)) 
        {
            removeUser(userId);
            ctx.reply(`Access for ID ${userId} is revoked!`);
        } 
        else ctx.reply('User with this ID is not found, or you forgot to enter user ID')
    }
})
bot.command('report', async (ctx)=>
{
    if(checkAccess(ctx.chat.id)==true)
        report(ctx)   
})

bot.launch()
