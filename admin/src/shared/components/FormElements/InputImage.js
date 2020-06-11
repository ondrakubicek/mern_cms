import React, {useState} from 'react';
import styled from 'styled-components'

const StyledInputImage = styled.div`
    margin-top: 120px;
    margin-bottom: 20px;
    input {
        display: block;
    }
    img {
        border: 1px solid #ccc;
        margin-top: 20px;
        max-height: 120px;
    }
`;

const InputImage = props => {
    function handleChange(event) {
        if(event.target.files[0]){
            props.changeHandle(event.target.files[0]);
        } else {
            props.changeHandle("");
        } 
    }
    return (
        <StyledInputImage>
            <input id={props.id} type="file" name={props.name} onChange={handleChange}/>
            <label htmlFor={props.id}>
                <img src={ props.file}/>
            </label>
        </StyledInputImage>
    );
};

export default InputImage;