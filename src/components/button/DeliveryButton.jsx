import React from 'react'
import "./buttonDelivery.css"

const STYLE = [
    "btn--primary--solid",
    "btn--waring--solid",
    "btn--danger--solid",
    "btn--success--solid",
];

const SIZE = [
    "btn--medium",
    "btn--small"
];

export const DeliveryButton = ({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize
}) => {

    const checkButtonStyle = STYLE.includes(buttonStyle) ? buttonStyle : STYLE[0];

    const checkButtonSize = SIZE.includes(buttonSize) ? buttonSize : SIZE[0];

    return (
        <button className={`btn_Delivery ${checkButtonStyle} ${checkButtonSize}`} onClick={onClick} type={type}>
            {children}
        </button>
    )
}