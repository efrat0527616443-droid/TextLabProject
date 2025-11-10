import { useState } from 'react'
import Signup from './Signup/Signup'
import Login from './Login/Login'
import Logout from './Logout/Logout'

{/* הגדרות ערכי ברירת מחדל לכל קובץ בסיסי */ }
// const defaultFile = {
//   id: Date.now(),
//   name: "Untitled",
//   text: "",
//   styles: [
//     {
//       start: 0,
//       end: 1,
//       style: {
//         fontSize: "16px",
//         fontFamily: "Arial",
//         color: "#000000",
//         backgroundColor: "#ffffff",
//         direction: "ltr",
//       }
//     }
//   ],
//   Highlights: [],
//   historyMaxLength: 20,
//   history: []
// };

const UserManager = ({ currentUser, setCurrentUser }) => {

  const [authType, setAuthType] = useState('login');

  return (
    <div className="userManagerContainer">
      {currentUser ? (
        <Logout setCurrentUser={setCurrentUser} />
      ) : (
        <>
          {authType === 'signup' && (
            <Signup
              setCurrentUser={setCurrentUser}
              onSwitch={() => setAuthType('login')}
            />
          )}

          {authType === 'login' && (
            <Login
              setCurrentUser={setCurrentUser}
              onSwitch={() => setAuthType('signup')}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserManager;