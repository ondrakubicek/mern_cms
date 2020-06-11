import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './shared/context/auth-context';

function Nav() {
    const auth = useContext(AuthContext);
    return (
        <nav>
            <h1>Admin</h1>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/users">Users</Link>
                </li>
                <li>
                    <Link to="/posts">Posts</Link>
                </li>                  
            </ul>
        </nav>
    );
}

export default Nav;
