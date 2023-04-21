import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})

export class DateService {

    daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    daysInMonthLeapYear = [31,29,31,30,31,30,31,31,30,31,30,31];
    leapyear = false;
    monthsInYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    daysInWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // *** This function is deprecated, since we can simply subtract dates to determine number of days
    // checkDaysNumber(dateFrom: string, dateTo: string) {
        
    //     // checking for leap year
    //     // if(year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
    //     // }

    //     let dayFrom = dateFrom.substring(8);
    //     let monthFrom = dateFrom.substring(5, 7);
    //     let yearFrom = dateFrom.substring(0,4);
    
    //     let dayTo = dateTo.substring(8);
    //     let monthTo = dateTo.substring(5, 7);
    //     let yearTo = dateTo.substring(0,4);

    //     if(yearTo < yearFrom) {
    //         return "Invalid. Year To earlier than Year From";
    //     } else if (yearTo === yearFrom && monthTo < monthFrom) {
    //         return "Invalid. Month To earlier than Month From";
    //     } else if (yearTo === yearFrom && monthTo === monthFrom && dayTo < dayFrom) {
    //         return "Invalid. Day To earlier than Day From";
    //     } 

    //     // eg 01/01/2020 - 03/01/2020 = 2 days
    //     if(dayTo > dayFrom && monthTo === monthFrom && yearTo === yearFrom) {
    //         return +dayTo - +dayFrom;
    //     } else if (monthTo > monthFrom && yearTo === yearFrom) {
    //         let monthsDiff = +monthTo - +monthFrom;
    //         let numDays = 0;

    //         // eg Jan to Feb
    //         numDays += ( this.daysInMonth[+monthFrom - 1] - +dayFrom + 1) //eg 31st - 25th
    //         numDays += +dayTo //eg 1st - 5th
    //         // console.log("days to eom: " + this.daysInMonth[+monthFrom - 1]);
    //         // console.log("prev mth: " + (this.daysInMonth[+monthFrom - 1] - +dayFrom));
    //         // console.log("curr mth: " + dayTo);
    //         if(monthsDiff > 1){
    //             //  Oct to Dec = 10, {11}, 12
    //             for (let index = +monthFrom + 1; index < +monthTo; index++) {
    //                 numDays += this.daysInMonth[index];
    //             }
    //         }

    //         return numDays;
    //     }

    //     return 0;
    // }

    getTravelDates(dateFrom: string, dateTo: string) {
        let dayFrom = dateFrom.substring(8, 10);
        let monthFrom = dateFrom.substring(4, 7);
        let yearFrom = dateFrom.substring(11,15);
        let dayOfWeekFrom = dateFrom.substring(0,4);

        console.log("Day: " + dayFrom);
        console.log("Mth: " + monthFrom);
        console.log("Year: " + yearFrom);
        console.log("Day of Week: " + dayOfWeekFrom);
        
        let dayTo = dateTo.substring(8, 10);
        let monthTo = dateTo.substring(4, 7);
        let yearTo = dateTo.substring(11,15);
        let dayOfWeekTo = dateTo.substring(0,4);

        if(yearTo < yearFrom) {
            return "Invalid. Year To earlier than Year From";
        } else if (yearTo === yearFrom && this.monthsInYear.indexOf(monthTo) < this.monthsInYear.indexOf(monthFrom)) {
            return "Invalid. Month To earlier than Month From";
        } else if (yearTo === yearFrom && this.monthsInYear.indexOf(monthTo) < this.monthsInYear.indexOf(monthFrom) && dayTo < dayFrom) {
            return "Invalid. Day To earlier than Day From";
        } 

        var prevMonth: string[] = [];
        var currMonth: string[] = [];
        // eg March 28 - April 4
        if(yearTo === yearFrom && this.monthsInYear.indexOf(monthTo) > this.monthsInYear.indexOf(monthFrom)) {

            let dayIndex = this.daysInWeek.indexOf(dayOfWeekFrom.trim());
            var day!: number;
            console.log("one month to the next");
            for (let index = +dayFrom; index <= this.daysInMonth[this.monthsInYear.indexOf(monthFrom)]; index++) {
                day = dayIndex + index - +dayFrom;
                if(day > 6)
                    day -= 7;
                if(index < 10)
                    prevMonth.push("0" + index + " " + monthFrom + " " + yearFrom  + " " + this.daysInWeek[day]);
                else 
                    prevMonth.push(index + " " + monthFrom + " " + yearFrom  + " " + this.daysInWeek[day]);
            }
            dayIndex = day;
            for (let index = 1; index <= +dayTo; index++) {
                var day = dayIndex + index;
                if(day > 6)
                    day -= 7;
                if(index < 10)
                    currMonth.push("0" + index + " " + monthTo + " " + yearTo + " " + this.daysInWeek[day]);
                else
                    currMonth.push(index + " " + monthTo + " " + yearTo + " " + this.daysInWeek[day]);
            }
        }
        
        if(yearTo === yearFrom && monthTo == monthFrom) {

            let dayIndex = this.daysInWeek.indexOf(dayOfWeekFrom.trim());
            console.log("day index: " + dayIndex + " " + dayOfWeekFrom);
            for (let index = +dayFrom; index <= +dayTo; index++) {
                var day = dayIndex + index - +dayFrom;
                if(day > 6)
                    day -= 7;
                if(index < 10)
                    prevMonth.push("0" + index + " " + monthFrom + " " + yearFrom   + " " + this.daysInWeek[day]);
                else
                    prevMonth.push(index + " " + monthFrom + " " + yearFrom + " " + this.daysInWeek[day]);
            }
        }

        return prevMonth.concat(currMonth);
    }
}