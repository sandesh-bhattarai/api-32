const generateRandomString = (len = 100) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const length = chars.length;
    let random = "";
    for(let i = 1; i <= len; i++) {
        let randomPosition = Math.floor(Math.random() * (length - 1))
        random += chars[randomPosition];
    }
    return random;
}

const generateDateTime = (min) => {
    const today = new Date();
    const minutes = today.getMinutes()
    today.setMinutes(minutes + Number(min))
    return today;
}

module.exports = {
    generateRandomString,
    generateDateTime
}