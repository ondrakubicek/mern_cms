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

function Users(props) {
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
    const url = 'http://localhost:4000/api/user/list';
    const data = await fetch(url, options);
    const items = await data.json();
    setItems(items);
  }

  const createNewUserHandler = () => {
    props.history.push('/users/new');
  };

  const deleteUser = async (userId) => {
    const options = {
      method: 'DELETE',
      headers: {
        'auth-token': auth.authToken,
      }
    };
    const url = `http://localhost:4000/api/user/${userId}`;
    const data = await fetch(url, options);
    fetchItems();
  };

  return (
    <Board>
      <h1>Users</h1>
      <Button onClick={() => createNewUserHandler()}>
        + New User
      </Button>
      <StyledList>
        {items.map(item => (
          <li>
            <StyledListColumn>
              <Link to={`/users/${item._id}`}>
                <span>{item.name}</span>
              </Link>
            </StyledListColumn>
            <StyledListColumn>

              <Link to={`/users/${item._id}`}>
                <span>{item.email}</span>
              </Link>
            </StyledListColumn>
            <StyledListColumn>
              <Button onClick={() => deleteUser(item._id)} danger="danger">
                delete
              </Button>
            </StyledListColumn>
          </li>
        ))}
      </StyledList>

    </Board>
  );
}

export default Users;
