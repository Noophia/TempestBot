import fs from 'fs'

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
export function writeID(newData) 
{
    fs.writeFileSync('././usersDB.json', JSON.stringify(newData))
}

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

export function date()
{

  const currentDate = new Date();
  const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
  const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() -1);
    function formatDate(date) 
      {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
        
    const fnextDate = formatDate(nextDate)
    const fpreviousDate = formatDate(previousDate)
    const fcurrentDate = formatDate(currentDate)  
  return {fnextDate, fcurrentDate ,fpreviousDate};     
}
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