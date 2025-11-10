import { useState } from 'react';
import './Logout.css';

const Logout = ({ setCurrentUser }) => {

    return (
        <div className="LogoutContainer">
            <button type="button" onClick={() => setCurrentUser(null)}>Log out</button>
        </div>
    );
};

export default Logout;
