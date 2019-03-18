

export default class Filter{
    static filteredArray(arr, key, value){
        const newArray = [];
        for(let i=0; i<arr.length; i++) {
            if(arr[i][key] === value) {
                newArray.push(arr[i]);
            }
         }
        return newArray;
    }
    
}