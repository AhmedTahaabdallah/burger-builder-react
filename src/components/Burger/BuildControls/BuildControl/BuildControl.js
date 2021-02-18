import React from 'react';
import cssClasses from './BuildControl.css';

const buildControl = props => {
    let fontColor = 'white';
    if(props.type === 'salad' && !props.disabled){
        fontColor = '#91ce50';
    }
    if(props.type === 'bacon' && !props.disabled){
        fontColor = '#bf3813';
    }
    if(props.type === 'cheese' && !props.disabled){
        fontColor = '#f4d004';
    }
    if(props.type === 'meat' && !props.disabled){
        fontColor = '#7f3608';
    }
    return (
        <div className={cssClasses.BuildControl}>
            <div className={cssClasses.Label}
            style={{color: fontColor}}>{props.label}</div>
            <button className={cssClasses.Less}
            onClick={props.removed} disabled={props.disabled}
            style={{color: fontColor}}>Less</button>
            <button className={cssClasses.More}
            onClick={props.added}
            style={{color: fontColor}}>More</button>
        </div>
    );
};

export default buildControl;