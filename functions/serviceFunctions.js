import fs from 'fs'
//read all user data from DB
export function readID() {
    try 
    {
        const data = fs.readFileSync('././usersDB.json');
        const obj = JSON.parse(data);
        return obj;
    } catch (err) {
        return [];
    }
}
//re-write all user data in DB with new data
export function writeID(newData) 
{
    fs.writeFileSync('././usersDB.json', JSON.stringify(newData))
}
//encode symbols from the string to url acceptable format
export function urlencode(text)
{
    let encodedText = "";
    for (let i = 0; i < text.length; i++) 
    {
      let charCode = text.charCodeAt(i);
      if (
        (charCode >= 65 && charCode <= 90) || // A-Z
        (charCode >= 97 && charCode <= 122) || // a-z
        (charCode >= 48 && charCode <= 57) || // 0-9
        charCode === 45 || // -
        charCode === 46 || // .
        charCode === 95 || // _
        charCode === 126 // ~
      ) {
        encodedText += text.charAt(i);
      } else {
        encodedText += encodeURIComponent(text.charAt(i));
      }
    }
    return encodedText;
}
//take unix date and create previous, current and next date in certain format
export function newDate(unixDate)
{
const currentDate = new Date (unixToISO(unixDate))
const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() -1);

  const fnextDate = formatDate(nextDate)
  const fpreviousDate = formatDate(previousDate)
  const fcurrentDate = formatDate(currentDate) 
  
return {fnextDate, fcurrentDate ,fpreviousDate}; 
}
    //format any date into yyyy-mm-dd format
    function formatDate(date) 
      {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
//create inline keyboard with number of buttons based on input array
export function createInlineKeyboard(array) 
{
    let keyboard = {
        inline_keyboard: []
    };

    array.forEach(item => {
        keyboard.inline_keyboard.push([{ text: item, callback_data: item }]);
    });

    return keyboard;
}
    //take unix date and convert it into iso date format
    function unixToISO(unixTime) 
    {
      const date = new Date(unixTime * 1000); 
      const isoDate = date.toISOString().split('T')[0]; // taking only date, eliminating time from the string
      return isoDate;
    }
