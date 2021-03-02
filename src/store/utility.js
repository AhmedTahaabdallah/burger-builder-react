export const updateObject = (oldObject, updatedPropertis) => {
    return {
        ...oldObject,
        ...updatedPropertis
    };
};