export const dateRange = [13, 69];
export const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };



export function dateIsHigher(dob) {
    if (Date.now() - dob.getTime() < 0) {
        return true;
    }
    return false;
}

export function subtractYearsToDate(date, years) {
    date.setFullYear(date.getFullYear() - years);
    return date;
}

export function dateIsOnRange(range, check) {
    var dateMin = subtractYearsToDate(new Date(), range[0]);
    var dateMax = subtractYearsToDate(new Date(), range[1]);

    if (check > dateMax && check < dateMin) {
        return true;
    }
    return false;
}

function calculate_days(from, to) {
    if (from.getTime() > to.getTime()) {
        to.setFullYear(to.getFullYear() + 1);
    }
    let diff = to.getTime() - from.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}
export function calculate_age(dob) {
    // age
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);

    let birthday = [dob.getDate(), dob.getMonth()];
    // full year days
    let today = new Date();
    let nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    let daysToNextYear = calculate_days(today, nextYear); // 364

    // days from today to your birthday
    let bday = new Date(today.getFullYear(), birthday[1], birthday[0]);
    let daysToYourBirthday = calculate_days(today, bday);

    // regular age: more days to your birthday 
    if (daysToYourBirthday > Math.floor(daysToNextYear / 2)) {
        return {
            regular: Math.abs(age_dt.getUTCFullYear() - 1970),
            actuarial: Math.abs(age_dt.getUTCFullYear() - 1970)
        }
    }
    // actuarial age : less days
    return {
        regular: Math.abs(age_dt.getUTCFullYear() - 1970),
        actuarial: Math.abs(age_dt.getUTCFullYear() + 1 - 1970)
    }


}
