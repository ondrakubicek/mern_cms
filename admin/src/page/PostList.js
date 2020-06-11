import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components'
import Board from '../component/board';
import { AuthContext } from '../shared/context/auth-context';
import { Link } from 'react-router-dom';

import Button from '../shared/components/FormElements/Button';

const StyledListColumn = styled.span`
  flex:1;
  &:last-child{
    text-align: right;
  }
`;

const StyledList = styled.ul`
  list-style: none;
  border: 1px solid #ccc;
  padding: 0;
  border-radius: 2px;
  box-shadow: 1px ;
  overflow: hidden;
  li {
    padding: 1em;
    display: flex;
    color: #000;
    border-bottom: 1px solid #ccc;
    &:last-child{
      border: none;
    }
    a {
      text-decoration: none;
      color: inherit;
    }
    span {
      margin-right: 20px;
    }


    &:hover {
      background-color: #eee;
    }
  }
`;

function PostList(props) {
  const auth = useContext(AuthContext);

  useEffect(() => {
    fetchItems();
  }, []);

  const [items, setItems] = useState([]);


  const fetchItems = async () => {
    const options = {
      method: 'GET',
      headers: {
        'auth-token': auth.authToken,
      }
    };
    const url = 'http://localhost:4000/api/post/list';
    const data = await fetch(url, options);
    const items = await data.json();
    setItems(items);
  }

  const createNewPostHandler = () => {
    props.history.push('/posts/new');
  };

  const deletePost = async (userId) => {
    const options = {
      method: 'DELETE',
      headers: {
        'auth-token': auth.authToken,
      }
    };
    const url = `http://localhost:4000/api/post/${userId}`;
    const data = await fetch(url, options);
    fetchItems();
  };

  return (
    <Board>
      <h1>Posts</h1>
      <Button onClick={() => createNewPostHandler()}>
        + New Post
      </Button>
      <StyledList>
        {items.map(item => (
          <li>
            <StyledListColumn>
              <Link to={`/posts/${item._id}`}>
                <span>{item.title}</span>
              </Link>
            </StyledListColumn>
            <StyledListColumn>

              <Link to={`/posts/${item._id}`}>
                <span>{item.description}</span>
              </Link>
            </StyledListColumn>
            <StyledListColumn>
              <Button onClick={() => deletePost(item._id)} danger="danger">
                delete
              </Button>
            </StyledListColumn>
          </li>
        ))}
      </StyledList>

    </Board>
  );
}

export default PostList;
