const getActivityTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    let period = 'AM';

    if (hours > 12) {
        hours -= 12;
        period = 'PM';
    }

    hours = hours === 0 ? 12 : hours;

    return `${hours}:${minutes} ${period}`;
};

const getActivityDate = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}-${day}-${year}`;
}

module.exports = { getActivityTime, getActivityDate };