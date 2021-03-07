import * as CryptoJS from 'crypto-js';

export const updateObject = (oldObject, updatedPropertis) => {
    return {
        ...oldObject,
        ...updatedPropertis
    };
};

export const isIngredientsCount = (ingredients) => {
    if(!ingredients){
        return false;
    }
    const sum = Object.keys(ingredients)
    .map(igKey => {
        return ingredients[igKey];
    }).reduce((summ, el) => summ + el, 0);
    return sum > 0;
};

const checkValidity = (value, rules) => {
    let isValid = true;
    if(!rules) {
        return true;
    }
    if(rules.required) {
        isValid = value.trim() !== '' && isValid;
    }
    if(rules.minLength) {
        isValid = value.trim().length >= rules.minLength && isValid;
    }
    if(rules.maxLength) {
        isValid = value.trim().length <= rules.maxLength && isValid;
    }
    if(rules.isEmail) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
        isValid = re.test(value) && isValid;
    }
    return isValid;
}

export const inputChange = (value, controls, controlName) => {
    const updatedElement = updateObject(controls[controlName], {
        value: value,
        valid: checkValidity(value, controls[controlName].validation),
        touched: true
    });

    const updatedControls = updateObject(controls, {
        [controlName]: updatedElement
    });

    let formIsValid = true;
    for(let inputtIdentifier in updatedControls) {
        if(updatedControls[inputtIdentifier].valid !== undefined) {
            formIsValid = updatedControls[inputtIdentifier].valid && formIsValid;
        }            
    }

    return { controls: updatedControls, formIsValid: formIsValid };
};

export const setHashString = (value, isJson = true) => {
    let resultStr = value;
    if(isJson) {
        resultStr = JSON.stringify(value);
    }
    const ciphertext = CryptoJS.AES.encrypt(resultStr, 'secret key 2021').toString();
    return ciphertext;
};

export const getHashString = (value, isJson = true) => {
    const bytes  = CryptoJS.AES.decrypt(value, 'secret key 2021');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    let finalResult = originalText;
    if(isJson) {
        finalResult = JSON.parse(originalText);
    }    
    return finalResult;
};

export const setlocalStorageItem = (key, value, isJson = true) => {
    const result = setHashString(value, isJson);
    localStorage.setItem(key, result);
};

export const getlocalStorageItem = (key, isJson = true) => {
    const result = localStorage.getItem(key);
    if(!result) {
        return null;
    }
    const result2 = getHashString(result, isJson);
    return result2;
};