export const formatDate = (date) => {
    const current = new Date(date);
    // return current
    const results = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`
    
    return results
}