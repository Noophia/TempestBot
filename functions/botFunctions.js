import { readID, writeID } from "./serviceFunctions.js";
import JiraApi from "jira-client";
import { credentials } from "../credentials.js";
import { jql, issueReport } from "./jira.js";

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
export async function report(ctx)
{
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
}
