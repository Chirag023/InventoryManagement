function uniqueID(timestamp){
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    //return (year+'-'+month+'-'+day);
    return `${year}-${month}-${day}`;
}

export default uniqueID