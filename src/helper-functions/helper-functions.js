export const isIngredientsCount = (ingredients) => {
    const sum = Object.keys(ingredients)
    .map(igKey => {
        return ingredients[igKey];
    }).reduce((summ, el) => summ + el, 0);
    return sum > 0;
};