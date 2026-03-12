const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
    // TODO: Implement this function
    function toSeconds(timeStr){
        let parts = timeStr.split(" ");
        let time = parts[0];
        let period = parts[1];

        let t = time.split(":");
        let h = parseInt(t[0]);
        let m = parseInt(t[1]);
        let s = parseInt(t[2]);

        if(period === "pm" && h !== 12){
            h += 12;
        }

        if(period === "am" && h === 12){
            h = 0;
        }

        return h*3600 + m*60 + s;
    }

    let startSeconds = toSeconds(startTime);
    let endSeconds = toSeconds(endTime);

    let duration;

    if(endSeconds >= startSeconds){
        duration = endSeconds - startSeconds;
    }else{
        duration = (24*3600 - startSeconds) + endSeconds;
    }

    let h = Math.floor(duration/3600);
    let m = Math.floor((duration%3600)/60);
    let s = duration%60;

    return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}


// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
        function toSeconds(timeStr){
            let parts = timeStr.split(" ");
            let time = parts[0];
            let period = parts[1];
    
            let t = time.split(":");
            let h = parseInt(t[0]);
            let m = parseInt(t[1]);
            let s = parseInt(t[2]);
    
            if(period === "pm" && h !== 12){
                h += 12;
            }
    
            if(period === "am" && h === 12){
                h = 0;
            }
    
            return h*3600 + m*60 + s;
        }
    
        let start = toSeconds(startTime);
        let end = toSeconds(endTime);
    
        let startDelivery = 8*3600;
        let endDelivery = 22*3600;
    
        let idle = 0;
    
        if(start < startDelivery){
            idle += startDelivery - start;
        }
    
        if(end > endDelivery){
            idle += end - endDelivery;
        }
    
        let h = Math.floor(idle/3600);
        let m = Math.floor((idle%3600)/60);
        let s = idle%60;
    
        return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    // TODO: Implement this function
    function toSeconds(time){
        let t = time.split(":");
        let h = parseInt(t[0]);
        let m = parseInt(t[1]);
        let s = parseInt(t[2]);
        
        return h*3600 + m*60 + s;
        }
        
        let shiftSec = toSeconds(shiftDuration);
        let idleSec = toSeconds(idleTime);
        
        let activeSec = shiftSec - idleSec;
        
        let h = Math.floor(activeSec/3600);
        let m = Math.floor((activeSec%3600)/60);
        let s = activeSec%60;
        
        return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
    function toSeconds(time){
        let parts = time.split(":");
        let h = parseInt(parts[0]);
        let m = parseInt(parts[1]);
        let s = parseInt(parts[2]);
        
        return h*3600 + m*60 + s;
        }
        
        let activeSeconds = toSeconds(activeTime);
        
        let quotaSeconds;
        
      
        if(date >= "2025-04-10" && date <= "2025-04-30"){
        quotaSeconds = 6 * 3600;
        }
        else{
        quotaSeconds = (8 * 3600) + (24 * 60);
        }
        
        return activeSeconds >= quotaSeconds;
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
    const fs = require("fs");

    let data = fs.readFileSync(textFile, "utf8");

    let lines = [];
    if (data.trim() !== "") {
        lines = data.trim().split("\n");
    }

    
    for (let line of lines) {
        let parts = line.split(",");
        if (parts[0] === shiftObj.driverID && parts[2] === shiftObj.date) {
            return {};
        }
    }

    
    let shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
    let idleTime = getIdleTime(shiftObj.startTime, shiftObj.endTime);
    let activeTime = getActiveTime(shiftDuration, idleTime);
    let metQuotaValue = metQuota(shiftObj.date, activeTime);

    let hasBonus = false;

   
    let newRecord = {
        driverID: shiftObj.driverID,
        driverName: shiftObj.driverName,
        date: shiftObj.date,
        startTime: shiftObj.startTime,
        endTime: shiftObj.endTime,
        shiftDuration: shiftDuration,
        idleTime: idleTime,
        activeTime: activeTime,
        metQuota: metQuotaValue,
        hasBonus: hasBonus
    };

   
    let newLine =
        newRecord.driverID + "," +
        newRecord.driverName + "," +
        newRecord.date + "," +
        newRecord.startTime + "," +
        newRecord.endTime + "," +
        newRecord.shiftDuration + "," +
        newRecord.idleTime + "," +
        newRecord.activeTime + "," +
        newRecord.metQuota + "," +
        newRecord.hasBonus;

    
    let index = -1;
    for (let i = 0; i < lines.length; i++) {
        let parts = lines[i].split(",");
        if (parts[0] === shiftObj.driverID) {
            index = i;
        }
    }

    
    if (index === -1) {
        lines.push(newLine);
    } else {
        lines.splice(index + 1, 0, newLine);
    }

    
    fs.writeFileSync(textFile, lines.join("\n"));

    return newRecord;

    }
// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
    const fs = require("fs");
    let data = fs.readFileSync(textFile, "utf8").trim().split("\n");
    let header = data[0];
    let rows = data.slice(1);

    for (let i = 0; i < rows.length; i++) {

        let cols = rows[i].split(",");

        if (cols[0] === driverID && cols[2] === date) {
            cols[9] = String(newValue); 
            rows[i] = cols.join(",");
        }

    }

    let newFile = [header, ...rows].join("\n");

    fs.writeFileSync(textFile, newFile);

}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
    const fs = require("fs");

    let data = fs.readFileSync(textFile, "utf8").trim().split("\n");

    let rows = data.slice(1); 

    let count = 0;
    let driverFound = false;

    for (let i = 0; i < rows.length; i++) {

        let cols = rows[i].split(",");

        let id = cols[0].trim();
        let date = cols[2].trim();
        let hasBonus = cols[9].trim();

        if (id === driverID) {

            driverFound = true;

            let monthFromDate = date.split("-")[1]; 

            if (parseInt(monthFromDate) === parseInt(month) && hasBonus === "true") {
                count++;
            }
        }
    }

    if (!driverFound) {
        return -1;
    }

    return count;
}


// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
        const fs = require("fs");
        let data = fs.readFileSync(textFile, "utf8");
        let lines = data.trim().split("\n");
        let totalSeconds = 0;
    
        for (let i = 1; i < lines.length; i++) {
            let parts = lines[i].split(",");
    
            if (parts[0] === driverID) {
                let dateParts = parts[2].split("-");
                let m = parseInt(dateParts[1]);
    
                if (m === month) {
                    let time = parts[7].split(":");
                    let h = parseInt(time[0]);
                    let min = parseInt(time[1]);
                    let s = parseInt(time[2]);
    
                    totalSeconds += h*3600 + min*60 + s;
                }
            }
        }
    
        let h = Math.floor(totalSeconds / 3600);
        let m = Math.floor((totalSeconds % 3600) / 60);
        let s = totalSeconds % 60;
    
        return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
        const fs = require("fs");
    
        let rateData = fs.readFileSync(rateFile, "utf8").trim().split("\n");
        let dayOff = "";
    
        for (let line of rateData) {
            let p = line.split(",");
            if (p[0] === driverID) {
                dayOff = p[1];
            }
        }
    
        let data = fs.readFileSync(textFile, "utf8").trim().split("\n");
    
        let totalSeconds = 0;
    
        for (let i = 1; i < data.length; i++) {
            let parts = data[i].split(",");
    
            if (parts[0] === driverID) {
                let date = parts[2];
                let m = parseInt(date.split("-")[1]);
    
                if (m === month) {
    
                    let d = new Date(date);
                    let dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    
                    if (dayName !== dayOff) {
    
                        let quota;
    
                        if (date >= "2025-04-10" && date <= "2025-04-30") {
                            quota = 6 * 3600;
                        } else {
                            quota = 8 * 3600 + 24 * 60;
                        }
    
                        totalSeconds += quota;
                    }
                }
            }
        }
    
        totalSeconds -= bonusCount * 2 * 3600;
    
        let h = Math.floor(totalSeconds / 3600);
        let m = Math.floor((totalSeconds % 3600) / 60);
        let s = totalSeconds % 60;
    
        return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
        const fs = require("fs");
    
        let rates = fs.readFileSync(rateFile, "utf8").trim().split("\n");
    
        let basePay = 0;
        let tier = 0;
    
        for (let line of rates) {
            let p = line.split(",");
            if (p[0] === driverID) {
                basePay = parseInt(p[2]);
                tier = parseInt(p[3]);
            }
        }
    
        let allowance = 0;
        if (tier === 1) allowance = 50;
        if (tier === 2) allowance = 20;
        if (tier === 3) allowance = 10;
        if (tier === 4) allowance = 3;
    
        function toSeconds(t) {
            let a = t.split(":");
            return parseInt(a[0]) * 3600 + parseInt(a[1]) * 60 + parseInt(a[2]);
        }
    
        let actualSec = toSeconds(actualHours);
        let requiredSec = toSeconds(requiredHours);
    
        if (actualSec >= requiredSec) return basePay;
    
        let missingSec = requiredSec - actualSec;
    
        let allowanceSec = allowance * 3600;
    
        if (missingSec <= allowanceSec) return basePay;
    
        missingSec -= allowanceSec;
    
        let billableHours = Math.floor(missingSec / 3600);
    
        let deductionRatePerHour = Math.floor(basePay / 185);
    
        let salaryDeduction = billableHours * deductionRatePerHour;
    
        let netPay = basePay - salaryDeduction;
    
        return netPay;
    
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
