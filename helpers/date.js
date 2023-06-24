import NepaliDate from "nepali-date-converter";

function currentDate() {
    return new Date().toISOString().split('T')[0];
}
  
export function currentNepaliDate() {
    const date = new NepaliDate();
    const nepaliDate = date.getBS();
    const addedMonth = nepaliDate.month + 1;
    const finalDate = {
        year: nepaliDate.year,
        month: addedMonth.toString().length == 1 ? `0${addedMonth}` : addedMonth,
        day: nepaliDate.date.toString().length == 1 ? `0${nepaliDate.date}` : nepaliDate.date
    };
    const formatted = `${finalDate?.year}-${finalDate?.month}-${finalDate?.day}`
    return formatted;
}

export function currentNepaliDateWwithTime() {
    var today = new Date();
var dates = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = dates+' '+time;
 
console.log(dateTime)
    const date = new NepaliDate();
    const nepaliDate = date.getBS();
    const addedMonth = nepaliDate.month + 1;
    const finalDate = {
        year: nepaliDate.year,
        month: addedMonth.toString().length == 1 ? `0${addedMonth}` : addedMonth,
        day: nepaliDate.date.toString().length == 1 ? `0${nepaliDate.date}` : nepaliDate.date
    };
    const formatted = `${finalDate?.year}-${finalDate?.month}-${finalDate?.day} ${time}`
    return formatted;
}