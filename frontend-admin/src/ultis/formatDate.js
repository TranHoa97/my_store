export const formatDate = (date) => {
    const current = new Date(date);
    // return current
    const results = `${current.getFullYear()} - ${current.getMonth()} - ${current.getDate()}`
    
    return results
}