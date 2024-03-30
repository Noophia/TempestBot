import { date, urlencode } from "./serviceFunctions.js";


const {fpreviousDate, fcurrentDate, fnextDate} = date();

export const jql =
{
  Total : 'project = TERI AND issuetype = Bug AND status != Closed ORDER BY status DESC',
  Blocked: 'project = TERI AND issuetype = Bug AND status = "Blocked"',
  New : `project = TERI AND issuetype = Bug AND status != Closed AND created >= ${fcurrentDate} AND created < ${fnextDate} order by created DESC`,
  Reopened : `project = TERI AND issuetype = Bug AND status changed from "QA Verification" to Reopened during (${fcurrentDate},${fcurrentDate}) ORDER BY key ASC`,
  Closed : `project = TERI AND issuetype = Bug AND status = Closed AND status changed from "QA Verification" to Closed during (${fcurrentDate},${fcurrentDate}) ORDER BY key ASC`,
  ClosedT: `project = TERI AND issuetype in (Task, Sub-task) AND status changed FROM "QA Verification" to (Closed, Reopened) during (${fcurrentDate},${fcurrentDate})` // Closed tasks for next function
}
export const issueReport = 
  {
      total: `<a href='https://jira.saber3d.net/issues/?jql=${urlencode(jql.Total)}'><u><b>TOTAL OPEN ISSUES</b></u></a>`,
      blocked: `<a href='https://jira.saber3d.net/issues/?jql=${urlencode(jql.Blocked)}'><u><b>BLOCKED</b></u></a>`,
      new : `<a href='https://jira.saber3d.net/issues/?jql=${urlencode(jql.New)}'><b>NEW ISSUES (Today)</b></a>`,
      reopened : `<a href='https://jira.saber3d.net/issues/?jql=${urlencode(jql.Reopened)}'><b>REOPENED ISSUES (Today)</b></a>`,
      closed : `<a href='https://jira.saber3d.net/issues/?jql=${urlencode(jql.Closed)}'><b>CLOSED ISSUES (Today)</b></a>`,
  }
    


