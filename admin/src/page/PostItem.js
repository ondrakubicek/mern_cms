import React, { useState, useEffect, useContext } from 'react';
import Board from '../component/board';
import { AuthContext } from '../shared/context/auth-context';

import InputImage from '../shared/components/FormElements/InputImage';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH
} from '../shared/util/validators';
import { useForm } from '../shared/hooks/form-hook';

function PostsItem(par) {
  const auth = useContext(AuthContext);
  let errorMessage;
  useEffect(() => {
    fetchItems();
  }, []);


  const [item, setItem] = useState([]);
  const [description, setDescription] = useState("");

  const [postImage, updateImageData] = useState({
    image: [],
    url: ""
  });
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: true
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
    const url = `http://localhost:4000/api/post/item/${par.match.params.id}`;
    const data = await fetch(url, options);
    const item = await data.json();

    setItem(item);
    setDescription(description);
    
    console.log(description);

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
      updateImageData({ url: `http://localhost:4000${image.path}` });
    }
  }

  const patchPostData = async (data) => {
    const options = {
      method: 'PATCH',
      headers: {
        'auth-token': auth.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(`http://localhost:4000/api/post/${item._id}`, options);
    const responseData = await response.json();
    if (responseData.message) {
      alert(responseData.message);
    }
  }

  const updatePostSubmitHandler = (e) => {
    e.preventDefault();
    const patchData = {};
    
    if (item.title !== formState.inputs.title.value) {
      patchData.title = formState.inputs.title.value;
    }

    if (item.description !== description) {
      patchData.description = description;
    }
    patchPostData(patchData);
  }

  const updatePostImageSubmitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('image', postImage.image);

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
      patchPostData({ image: imageData._id });
    }
  }

  return item.title ? (
    <Board>
      <h1>Post: {item.tilte} </h1>
      <form onSubmit={updatePostSubmitHandler}>
        {errorMessage}
        <Input
          element="input"
          id="title"
          type="text"
          label="title"
          initialValue={item.title}
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid name, at least 5 characters."
          onInput={inputHandler}
        />
        <label>Text:</label>
        <CKEditor
            editor={ ClassicEditor }
            data={description}
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                setDescription(data);
            } }
        />
        <Button type="submit">
          Update Post
        </Button>
      </form>

      <form onSubmit={updatePostImageSubmitHandler}>
        <InputImage id="Post-image" name="image" file={postImage.url} changeHandle={(e) => handleImageChange(e)} />
        <Button type="submit">
          Update image
        </Button>
      </form>
    </Board>
  ) : (
      <Board></Board>
    );
}

export default PostsItem;
