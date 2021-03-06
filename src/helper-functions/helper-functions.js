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
    const updatedControls = { 
        ...controls,
        [controlName]: {
            ...controls[controlName],
            value: value,
            valid: checkValidity(value, controls[controlName].validation),
            touched: true
        }
    };

    let formIsValid = true;
    for(let inputtIdentifier in updatedControls) {
        if(updatedControls[inputtIdentifier].valid !== undefined) {
            formIsValid = updatedControls[inputtIdentifier].valid && formIsValid;
        }            
    }

    return { controls: updatedControls, formIsValid: formIsValid };
};

