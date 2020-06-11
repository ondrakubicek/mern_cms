import React, { useState, useEffect, useContext } from 'react';
import Board from '../component/board';
import { AuthContext } from '../shared/context/auth-context';

import InputImage from '../shared/components/FormElements/InputImage';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH
} from '../shared/util/validators';
import { useForm } from '../shared/hooks/form-hook';

function UsersItem(par) {
  const auth = useContext(AuthContext);
  let errorMessage;
  useEffect(() => {
    fetchItems();
  }, []);

  const [item, setItem] = useState([]);
  const [userImage, updateImageData] = useState({
    image: [],
    url: ""
  });
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: item.name,
        isValid: true
      },
      email: {
        value: item.email,
        isValid: true
      },
      role: {
        value: item.role
      }
    },
    false
  );


  const handleImageChange = (val) => {
    var url = URL.createObjectURL(val);
    updateImageData({
      image: val,
      url: url
    });
  }

  const fetchItems = async () => {
    const options = {
      method: 'GET',
      headers: {
        'auth-token': auth.authToken,
      }
    };
    const url = `http://localhost:4000/api/user/item/${par.match.params.id}`;
    const data = await fetch(url, options);
    const item = await data.json();
    setItem(item);

    if (item.image) {
      const options = {
        method: 'GET',
        headers: {
          'auth-token': auth.authToken,
        }
      };
      const url = `http://localhost:4000/api/image/${item.image}`;
      const data = await fetch(url, options);
      const image = await data.json();
      updateImageData({url:`http://localhost:4000${image.path}`});
    }
  }

  const patchUserData = async (data) => {
    const options = {
      method: 'PATCH',
      headers: {
        'auth-token': auth.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`http://localhost:4000/api/user/${item._id}`, options);
    const responseData = await response.json();
    if(responseData.message){
      alert(responseData.message);
    }
  }

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();
    const patchData = {};
    if(item.email !== formState.inputs.email.value){
      patchData.email = formState.inputs.email.value;
    }
    if(item.name !== formState.inputs.name.value){
      patchData.name = formState.inputs.name.value;
    }

    if(item.role !== formState.inputs.role.value){
      patchData.role = formState.inputs.role.value;
    }
    patchUserData(patchData);
  }

  const updateUserImageSubmitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('image', userImage.image);

    const options = {
      method: 'POST',
      headers: {
        'auth-token': auth.authToken,
      },
      body: data // This is your file object
    };
    const imageRespone = await fetch('http://localhost:4000/api/upload/image/', options);
    const imageData = await imageRespone.json();

    if (imageData._id) {
      patchUserData({ image: imageData._id });
    }
  }

  return item.name ? (
    <Board>
      <h1>User: {item.name} </h1>
      <form onSubmit={updateUserSubmitHandler}>
        {errorMessage}
        <Input
          element="input"
          id="name"
          type="name"
          label="Name"
          initialValue={item.name}
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid name, at least 5 characters."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          initialValue={item.email}
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="role"
          type="role"
          label="role"
          validators={[VALIDATOR_MINLENGTH(1)]}
          initialValue={item.role}
          onInput={inputHandler}
        />
        <Button type="submit">
          Update user
        </Button>
      </form>

      <form onSubmit={updateUserImageSubmitHandler}>
        <InputImage id="user-image" name="image" file={userImage.url} changeHandle={(e) => handleImageChange(e)} />
        <Button type="submit">
          Update image
        </Button>
      </form>
    </Board>
  ) : (
      <Board></Board>
    );
}

export default UsersItem;
