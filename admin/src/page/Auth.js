import React, { useState, useContext } from 'react';
import styled from 'styled-components'

import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH
} from '../shared/util/validators';
import { useForm } from '../shared/hooks/form-hook';
import { AuthContext } from '../shared/context/auth-context';

const LoginBox = styled.div`
    width: 300px;
    height: 300px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20vh;
    h1 {color: #fff;}
    form {
        text-align: left;
        color: #fff;
    }
`;

function Auth() {
 

    const auth = useContext(AuthContext);
    const [toke, setToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState([]);

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const authSubmitHandler = async event => {
        event.preventDefault();
        const options = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                'email': formState.inputs.email.value,
                'password': formState.inputs.password.value
            })
        };
        const url = 'http://localhost:4000/api/user/login';
        const data = await fetch( url, options);

        const result = await data.json();
        if(data.status === 200) {
            auth.login(true);
            auth.setToken(result.token);
        } else {
            if(result.message){
                setErrorMessage(result.message);
                console.log(result.message);
            }
        }
    };


    return (
        <LoginBox>
            <h1>Login</h1>
            <form onSubmit={authSubmitHandler}>
                {errorMessage}
                <Input
                    element="input"
                    id="email"
                    type="email"
                    label="E-Mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid email address."
                    onInput={inputHandler}
                />
                <Input
                    element="input"
                    id="password"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid password, at least 5 characters."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>
                   LOGIN
                </Button>
            </form>
        </LoginBox>
    );
}

export default Auth;
