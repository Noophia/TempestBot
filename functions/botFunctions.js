import { readID, writeID, urlencode } from "./serviceFunctions.js";
import JiraApi from "jira-client";
import { credentials } from "../credentials.js";
import { newDate } from "./serviceFunctions.js";

export function addUser(user) 
{
    const ids = readID();
    ids.push(user);
    writeID(ids);
}
export function removeUser(userId)
{
    const ids = readID();
    const index = ids.indexOf(userId)
    ids.splice(index,1)
    writeID(ids)
}
export function promoteUser(ctx)
{
    removeUser(ctx.chat.id)
    const user = {username : ctx.chat.username, id : ctx.chat.id, admin : true}
    addUser(user);
}
export function getUsers()
{
    let list =[];
    const Users = readID();
    for (let i=0;i<Users.length; i++)
        list.push(`@${Users[i].username} (id = ${Users[i].id})\n`)
    return list;
}
export function checkAccess(userId)
{
    const Users = readID()
    let allowedIDs= [];
    for (let i=0;i<Users.length; i++)
            allowedIDs.push(Users[i].id)


     var authToken;
     if (allowedIDs.includes(userId) == true) authToken = true; else authToken = false;
     return authToken;
}
export function checkAdminAccess(userId)
{
    const Users = readID()
    let ids= [];
    for (let i=0;i<Users.length; i++)
            ids.push(Users[i].id)
    let index = ids.indexOf(userId)
     let authToken;
     if (Users[index].admin === true) authToken = true; else authToken = false;
     return authToken;
}
export async function report(bot)
{
  bot.command('report', async (ctx)=>
  {
    const {fcurrentDate, fnextDate} = newDate(ctx.message.date)
    const jql =
    {
      Total : 'project = TERI AND issuetype = Bug AND status != Closed ORDER BY status DESC',
      Blocked: 'project = TERI AND issuetype = Bug AND status = "Blocked"',
      New : `project = TERI AND issuetype = Bug AND status != Closed AND created >= ${fcurrentDate} AND created < ${fnextDate} order by created DESC`,
      Reopened : `project = TERI AND issuetype = Bug AND status changed from "QA Verification" to Reopened during (${fcurrentDate},${fcurrentDate}) ORDER BY key ASC`,
      Closed : `project = TERI AND issuetype = Bug AND status = Closed AND status changed from "QA Verification" to Closed during (${fcurrentDate},${fcurrentDate}) ORDER BY key ASC`,
      ClosedT: `project = TERI AND issuetype in (Task, Sub-task) AND status changed FROM "QA Verification" to (Closed, Reopened) during (${fcurrentDate},${fcurrentDate})` // Closed tasks for next function
    }
    const issueReport = 
    {
      total: `<a href='https://jira.saber3d.net/issues/?jql=${urlencode(jql.Total)}'><u><b>TOTAL OPEN ISSUES</b></u></a>`,
      blocked: `<a href='https://jira.saber3d.net/issues/?jql=${urlencode(jql.Blocked)}'><u><b>BLOCKED</b></u></a>`,
      new : `<a href='https://jira.saber3d.net/issues/?jql=${urlencode(jql.New)}'><b>NEW ISSUES (Today)</b></a>`,
      reopened : `<a href='https://jira.saber3d.net/issues/?jql=${urlencode(jql.Reopened)}'><b>REOPENED ISSUES (Today)</b></a>`,
      closed : `<a href='https://jira.saber3d.net/issues/?jql=${urlencode(jql.Closed)}'><b>CLOSED ISSUES (Today)</b></a>`,
    }
    if(checkAccess(ctx.chat.id)==true)  
    try 
    {
      const jira = new JiraApi({
        protocol: 'https',
        host: credentials.jiraUrl,
        username: credentials.jiraUser,
        password: credentials.jiraPass,
        apiVersion: '2',
      })
      const issuesSearch = await Promise.all
        ([
        jira.searchJira(jql.Total),
        jira.searchJira(jql.New),
        jira.searchJira(jql.Closed),
        jira.searchJira(jql.Reopened),
        jira.searchJira(jql.Blocked),
        jira.searchJira(jql.ClosedT),
        ])
    const issues =
    {
      total: issuesSearch[0].total,
      new: issuesSearch[1].total,
      closed: issuesSearch[2].total,
      reopened: issuesSearch[3].total,
      blocked: issuesSearch[4].total,
      closedT: issuesSearch[5]
    } 
    const ClosedTasks = issues.closedT.issues.filter(issue => issue.fields.issuetype.name === 'Task' && issue.fields.status.name === 'Closed' || issue.fields.status.name === 'Reopened');
    let TasksList = ''
    if (ClosedTasks.length === 0) 
    {TasksList = ''; console.log('no tasks have been checked')}
    else TasksList ='<b>-Tasks checked:</b> \n'+ ClosedTasks.map(bug =>`<a href='https://jira.saber3d.net/browse/${bug.key}'>${bug.key}</a> — ${bug.fields.status.name}`).join('\n')+'\n';

ctx.replyWithHTML(`#QA_Report\n<u><b>BUILD %BuildNumber%</b></u>\n\n<b>-${issues.closed+issues.reopened} Resolved issues were checked</b>\n${TasksList}<b>-Ad-hoc testing multiplayer / skirmish / campaign maps</b>\n\n <u><b>ISSUES REPORT</b></u>:\n\n${issueReport.total}: ${issues.total}\n${issueReport.blocked}: ${issues.blocked} \n_______________________________________________________\n${issueReport.new}: ${issues.new}\n${issueReport.closed}: ${issues.closed}\n${issueReport.reopened}: ${issues.reopened}`)
      }
        catch (error) 
            {
              console.log(error);
              ctx.reply('Произошла ошибка. Попробуйте позже.');
            } 
  })   
}
