

module.exports = {
    datefirstload: Date.prototype.firstdate = function (dates) {

        try {
            const date = new Date();
            date.setDate(date.getDate() - dates);
            
            const datevalue = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Bangkok" }).format(date);
            return datevalue;
        } catch (error) {
            console.log(error)
            return "";
        }
    }
}

const Dateload = async (datevalue) => {
    try {


    } catch (error) {
        return "";
    }
}

