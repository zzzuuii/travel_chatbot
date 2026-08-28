// 何時何分→分
export function timeToMinutes(time: string) {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
}

//分→何時何分 
export function minutesToTime(minutes: number) {
    const hour = Math.floor(minutes / 60) % 24;
    const minute = minutes % 60;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// 予算を数字に変換
export function getBudgetLimit(budget: string) {
    switch (budget) {
        case "Around S$30":
            return 30;
        case "Around S$50":
            return 50;
        case "Around S$100":
            return 100;
        case "More than S$100":
            return Infinity;
        default:
            return Infinity;
    }
}

export function getDayOfWeek(date: string) {
    return new Date(date + "T00:00:00").getDay();
}

export function getMinEndTime(startTime: string) {
    const [hour, minute] = startTime.split(":").map(Number);
    const totalMinutes = hour * 60 + minute + 1;
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;

    return `${String(newHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;
}

// MM-DD-YYYYに変換する
export function formatDateForOneMap(date: string) {
    const [year, month, day] = date.split("-");
    return `${month}-${day}-${year}`;
}