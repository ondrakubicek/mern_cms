import React, { useContext } from 'react';
import styled from 'styled-components'
import { AuthContext } from './shared/context/auth-context';

const TopPanelStyled = styled.div`
    background-color: rgb(15, 107, 103);
    width: 100%;
    height: 40px;
    span {
        line-height: 40px;
        float: right;
        font-size: 1.3em;
        color: #fff;
        cursor: pointer;
        padding-right: 20px;
    }
`;

function TopPanel() {
    const auth = useContext(AuthContext);
    return (
        <TopPanelStyled>
           <span onClick={() =>auth.logout()}>
                    ↳ logout
            </span>
        </TopPanelStyled>
    );
}

export default TopPanel;
