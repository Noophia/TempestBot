import { checkAccess,addUser, removeUser, checkAdminAccess, promoteUser } from "./botFunctions.js";
export async function auth(bot)
{
    const accessCode = 'SkibidiBopBop'
    const adminAccessCode = 'Pepega'
    let waitingAccess = false;
    let count = 0;
//Запрос доступа к боту
    bot.command('authorize', async (ctx)=>
        {
            if(checkAccess(ctx.chat.id)==false)
                {
                    ctx.reply('Enter access code');
                    waitingAccess = true;
                    count = 3;
                }
            else ctx.reply('You already have access')
        })
//Введение кода доступа
    bot.hears(accessCode, async (ctx)=>
    {
        if(checkAccess(ctx.chat.id)==false)

            {
                const user = {username : ctx.chat.username, id : ctx.chat.id, admin : false}
                addUser(user);
                ctx.reply(`Access granted!\nWelcome to the team, ${ctx.chat.first_name}!`);
                waitingAccess = false;
            }
    })
    bot.hears(adminAccessCode, async (ctx)=>
    {
        if(checkAccess(ctx.chat.id)==true && checkAdminAccess(ctx.chat.id)==false)
            {
                promoteUser(ctx)
                ctx.reply(`Admin access granted!\nNoice :)`);
                waitingAccess = false;
            }
    })
    bot.on('text', async (ctx,next)=>
    {
        if (waitingAccess == true)
        {
            if (count ==0)
                {
                    ctx.reply('access is forbidden'); 
                    waitingAccess = false;
                }
            else    
                {
                    ctx.reply(`invalid access code, please try again (${count})`);
                    console.log(`Tries left = ${count}`)
                    count -=1;
                }
        console.log(`Waiting for correct access code = ${waitingAccess}`);

        }

        await next()
    })
}