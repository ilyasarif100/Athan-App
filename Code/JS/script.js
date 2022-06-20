//Update Current Clock Function
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

}//end of update clock function

//Get Athan Times from athan API function
const api_url = 'https://api.aladhan.com/v1/timingsByAddress?address=phoenix,%20AZ';
async function getAthanTimes() {
    const response = await fetch(api_url);
    const data = await response.json();

    var fajrAthan = data.data.timings.Fajr;
    var sunrise = data.data.timings.Sunrise;
    var dhuhrAthan = data.data.timings.Dhuhr;
    var asrAthan = data.data.timings.Asr;
    var maghribAthan = data.data.timings.Maghrib; 
    var ishaAthan = data.data.timings.Isha;
    var athanTimes = [fajrAthan, dhuhrAthan, asrAthan, maghribAthan, ishaAthan];
    var id = ["fajr-time", "dhuhr-time", "asr-time", "maghrib-time", "isha-time"];

    var fajrInt = parseInt(fajrAthan.replace(/\D+/g, ""));
    var sunriseInt = parseInt(sunrise.replace(/\D+/g, ""));
    var dhuhrInt = parseInt(dhuhrAthan.replace(/\D+/g, ""));
    var asrInt = parseInt(asrAthan.replace(/\D+/g, ""));
    var maghribInt = parseInt(maghribAthan.replace(/\D+/g, ""));
    var ishaInt = parseInt(ishaAthan.replace(/\D+/g, ""));
    var displayFajrNextAt = ishaInt + ((fajrInt + 2400) - ishaInt) / 2;
    var now = new Date();
    var time = "";
    var timeHours=now.getHours();
    var timeMinutes=now.getMinutes();
    time+=timeHours;
    if(timeMinutes < 10) {
        time+="0"+timeMinutes;
        time = parseInt(time);
    }else {
        time+=timeMinutes;
        time = parseInt(time);
    }
    

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
    //these values represent the time in between prayers to display next prayer on widget
    var nextFajr;
    var nextDhuhr;
    var nextAsr;
    var nextMaghrib;
    var nextIsha;
    
    
    //add both divide by 2, trunc, store in pra
    //convert to string and grab last two digits
    //put last two digits in var and muliply by 0.6
    //convert to string and put it back into original string slice(0,-2)
    //convert that string into int and put it into fajrInt
    function nextPrayer(prayer1,prayer2) {
        var nextPrayer;
        var lastTwoStr = "";
        var lastTwoInt;

        if (prayer2.toString().length == 4 && prayer1.toString().length == 4) {//next fajr
            nextPrayer = Math.trunc((prayer2 + prayer1) / 2).toString();
            lastTwoStr = nextPrayer.toString().slice(-2);
            lastTwoInt = Math.trunc(parseInt(lastTwoStr) * 0.6);
            nextPrayer = nextPrayer.slice(0, -2) + lastTwoInt.toString();
            nextPrayer = parseInt(nextPrayer);
            return nextPrayer;
        } else if (prayer2.toString().length == 3 && prayer1.toString().length == 4) {
            nextPrayer = Math.trunc(((prayer2 + prayer1) - 2400) / 2);
            if (nextPrayer.toString().length <= 2) {
                nextPrayer *= 0.6;
                nextPrayer = Math.trunc(nextPrayer);
                return nextPrayer;
            } else {
                lastTwoStr = nextPrayer.toString().slice(-2);
                lastTwoInt = Math.trunc(parseInt(lastTwoStr) * 0.6);
                nextPrayer = nextPrayer.toString().slice(0, length - 2) + lastTwoInt.toString();
                return nextPrayer;
            }
        } else {
            nextPrayer = (prayer2 + prayer1) / 2;
            return nextPrayer;
        }


    }

    nextFajr = nextPrayer(ishaInt,fajrInt);
    nextDhuhr = sunriseInt;
    nextAsr = nextPrayer(dhuhrInt, asrInt);
    nextMaghrib = nextPrayer(asrInt, maghribInt);
    nextIsha = nextPrayer(maghribInt, ishaInt);
    

    if (time >= fajrInt && time < sunriseInt) {//time for fajr
        document.getElementById("prayerWidgetTitle").innerHTML = "It's time for";
        document.getElementById("prayerName").innerHTML = "Fajr";
        document.getElementById("prayerTime").innerHTML = athanTimes[0] + " AM";
    } else if (time >= nextDhuhr && time < dhuhrInt) {//next dhuhr
        document.getElementById("prayerWidgetTitle").innerHTML = "Next";
        document.getElementById("prayerName").innerHTML = "Dhuhr";
        if(dhuhrInt >= 1200)
            document.getElementById("prayerTime").innerHTML = athanTimes[1] + " PM";
        else
            document.getElementById("prayerTime").innerHTML = athanTimes[1] + " AM";
    }else if (time >= dhuhrInt && time < nextAsr) {//time for dhuhr
        document.getElementById("prayerWidgetTitle").innerHTML = "It's time for";
        document.getElementById("prayerName").innerHTML = "Dhuhr";
        if (dhuhrInt <= 1200)
            document.getElementById("prayerTime").innerHTML = athanTimes[1] + " PM";
        else
            document.getElementById("prayerTime").innerHTML = athanTimes[1] + " AM";
    } else if (time >= nextAsr  && time < asrInt) {//next asr
        document.getElementById("prayerWidgetTitle").innerHTML = "Next";
        document.getElementById("prayerName").innerHTML = "Asr";
        if (dhuhrInt <= 1200)
            document.getElementById("prayerTime").innerHTML = athanTimes[2] + " PM";
        else
            document.getElementById("prayerTime").innerHTML = athanTimes[2] + " AM";
    } else if (time >= asrInt && time < nextMaghrib) {//time for asr
        document.getElementById("prayerWidgetTitle").innerHTML = "It's time for";
        document.getElementById("prayerName").innerHTML = "Asr";
        if (dhuhrInt <= 1200)
            document.getElementById("prayerTime").innerHTML = athanTimes[2] + " PM";
        else
            document.getElementById("prayerTime").innerHTML = athanTimes[2] + " AM";
    } else if (time >= nextMaghrib && time < maghribInt) {//next mahrib
        document.getElementById("prayerWidgetTitle").innerHTML = "Next";
        document.getElementById("prayerName").innerHTML = "Maghrib";
        if (dhuhrInt <= 1200)
            document.getElementById("prayerTime").innerHTML = athanTimes[3] + " PM";
        else
            document.getElementById("prayerTime").innerHTML = athanTimes[3] + " AM";
    } else if (time >= maghribInt && time < nextIsha) {//time for maghrib
        document.getElementById("prayerWidgetTitle").innerHTML = "It's time for";
        document.getElementById("prayerName").innerHTML = "Maghrib";
        if (dhuhrInt <= 1200)
            document.getElementById("prayerTime").innerHTML = athanTimes[3] + " PM";
        else
            document.getElementById("prayerTime").innerHTML = athanTimes[3] + " AM";
    } else if (time >= nextIsha && time < ishaInt) {//next isha
        document.getElementById("prayerWidgetTitle").innerHTML = "Next";
        document.getElementById("prayerName").innerHTML = "Isha";
        if (dhuhrInt <= 1200)
            document.getElementById("prayerTime").innerHTML = athanTimes[4] + " PM";
        else
            document.getElementById("prayerTime").innerHTML = athanTimes[4] + " AM";
    } else if (time >= nextFajr && time < fajrInt) {//next fajr
        document.getElementById("prayerWidgetTitle").innerHTML = "Next";
        document.getElementById("prayerName").innerHTML = "Fajr";
        if (dhuhrInt <= 1200)
            document.getElementById("prayerTime").innerHTML = athanTimes[0] + " PM";
        else
            document.getElementById("prayerTime").innerHTML = athanTimes[0] + " AM";
    } else if (time >= ishaInt || time<nextFajr) {//time for isha
        document.getElementById("prayerWidgetTitle").innerHTML = "It's time for";
        document.getElementById("prayerName").innerHTML = "Isha";
        if (dhuhrInt <= 1200)
            document.getElementById("prayerTime").innerHTML = athanTimes[4] + " PM";
        else
            document.getElementById("prayerTime").innerHTML = athanTimes[4] + " AM";
    }
    console.log(nextFajr)
}



    
//call functions within html script
function initClock() {
    updateClock();
    window.setInterval("updateClock()",  1);
    getAthanTimes();
    window.setInterval("getAthanTimes()", 60000/6);
}