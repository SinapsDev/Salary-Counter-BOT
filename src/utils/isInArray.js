export const isInArray = (array, value) => {
    // loop into array
    for (let i = 0; i < array.length; i++) {
        // check if value is in array
        if (array[i]._rawData[0] === value) {
            return true;
        }
    }
}