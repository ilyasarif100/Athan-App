
function updateClock() {
    var now = new Date();
    var dname = now.getDay();
    
        mo = now.getMonth();
        dnum = now.getDate();
        hou = now.getHours();
        min = now.getMinutes();
        sec = now.getSeconds();
        pe = " AM"

    if(hou == 0) {
        hou = 12;
    }
    if(hou > 12) {
        hou -= 12;
        pe = " PM";
    }

    Number.prototype.pad = function(digits) {
        for(var n = this.toString(); n.length < digits; n = 0 + n);
            return n;
    }

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ids = ["dayName", "month", "dayNum", "hour", "minutes", "seconds", "period"];
    var values = [week[dname], months[mo], dnum.pad(2), hou.pad(2), min.pad(2), sec.pad(2), pe];


    for(var i = 0; i<ids.length; i++)
    document.getElementById(ids[i]).firstChild.nodeValue = values[i];

}

const api_url = 'https://api.aladhan.com/v1/timingsByAddress?address=phoenix,%20AZ';
async function getAthanTimes() {
    const response = await fetch(api_url);
    const data = await response.json();

    var fajrAthan = data.data.timings.Fajr;
    var dhuhrAthan = data.data.timings.Dhuhr;
    var asrAthan = data.data.timings.Asr;
    var maghribAthan = data.data.timings.Maghrib; 
    var ishaAthan = data.data.timings.Isha;
    var athanTimes = [fajrAthan, dhuhrAthan, asrAthan, maghribAthan, ishaAthan];
    var id = ["fajr-time", "dhuhr-time", "asr-time", "maghrib-time", "isha-time"];

    for (let i = 0; i < athanTimes.length; i++) {
        if (athanTimes[i].charAt(0) == "0") {
            athanTimes[i] = athanTimes[i].replace('0','');
            document.getElementById(id[i]).innerHTML = athanTimes[i] + " AM";
        } else {
            //convert first 2 chars of athanTimes[i] to num and store in var
            var num = athanTimes[i].substring(0, 2);
            var stringNum = ""
            //check if var > 12
            if (num > 12) {
                num-=12;
                //convert to string
                stringNum += num.toString();
                //replace first 2 chars of athanTimes[i] with new string var
                athanTimes[i] = stringNum + athanTimes[i].slice(2, athanTimes[i].length);
            }
                
                
            document.getElementById(id[i]).innerHTML = athanTimes[i] + " PM";
        }   
    }
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
}
        
function initClock() {
    updateClock();
    window.setInterval("updateClock()",  1);
    getAthanTimes();
    window.setInterval("getAthanTimes()", 60000);
}