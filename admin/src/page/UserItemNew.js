import React, { useState, useContext } from 'react';
import Board from '../component/board';

import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH
} from '../shared/util/validators';
import { useForm } from '../shared/hooks/form-hook';
import { AuthContext } from '../shared/context/auth-context';


function UsersItemNew(props) {
    const auth = useContext(AuthContext);
    const [token, setToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState([]);

    const [formState, inputHandler, setFormData] = useForm(
        {
            name: {
                value: '',
                isValid: false
            },
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

    const createUserSubmitHandler = async event => {
        event.preventDefault();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': auth.authToken,
            },
            body: JSON.stringify({
                'name': formState.inputs.name.value,
                'email': formState.inputs.email.value,
                'password': formState.inputs.password.value
            })
        };
        const url = 'http://localhost:4000/api/user/register';
        const data = await fetch(url, options);

        const result = await data.json();
        if (data.status === 200) {
            props.history.push('/users/');
        } else {
            if (result.message) {
                setErrorMessage(result.message);
                console.log(result.message);
            }
        }
        // const items = await data.json();
    };

    return (
        <Board>
            <h1>Create user</h1>
            <form onSubmit={createUserSubmitHandler}>
                {errorMessage}
                <Input
                    element="input"
                    id="name"
                    type="name"
                    label="Name"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid name, at least 5 characters."
                    onInput={inputHandler}
                />
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
                    CREATE USER
                </Button>
            </form>
        </Board>
    );
}

export default UsersItemNew;
