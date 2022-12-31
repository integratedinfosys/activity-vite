// https://stackoverflow.com/questions/13898423/javascript-convert-24-hour-time-of-day-string-to-12-hour-time-with-am-pm-and-no
function format24toampm(timeString: string){
    const [hourString, minuteString] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minuteString + (hour < 12 ? "AM" : "PM");
}
export default format24toampm