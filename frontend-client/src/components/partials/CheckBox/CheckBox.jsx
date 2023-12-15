import React from "react"

const CheckBox = (props) => {
    
    const inputRef = React.useRef(null)

    const onChange = () => {
        if (props.onChange) {
            let value = inputRef.current ? inputRef.current : ""
            props.onChange(value)
        }
    }

    return (
        <label className="checkbox">
            <input 
                type="checkbox" 
                ref={inputRef} 
                onChange={onChange} 
                checked={props.checked}
            />
            <span className="checkbox__checkmark">
                <i className="fa-solid fa-check"></i>
            </span>
            {props.label ? props.label : ""}
        </label>
    )
}

export default CheckBox