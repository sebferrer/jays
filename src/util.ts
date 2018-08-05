class ArrayUtil {
    
    static getIndex(array, obj) {
        let index = -1;
        let i = 0;
        while(index === -1 && i < array.length) {
            if(array[i] === obj) {
                index = i;
            }
            i++;
        }
        return index;
    }

    static removeFromArray(array, obj) {
        if(array.includes(obj)) {
            array.splice(this.getIndex(array, obj), 1);
        }
    }

    static addFirstNoDuplicate(array, obj) {
        if(!array.includes(obj)) {
            array.unshift(obj);
        }
    }
}