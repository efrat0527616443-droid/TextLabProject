import { useState } from 'react'
import './App.css'
import TextLab from './components/TextLab/TextLab'
import UserManager from './components/UserManager/UserManager'
// import Logout from './components/Logout/Logout'

// {/* הגדרות ערכי ברירת מחדל לכל קובץ בסיסי */ }
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

// {/* הגדרות ערכי ברירת מחדל לכל משתמש חדש */ }
// const user = {
//   name: 'efrat',
//   id: 0,
//   password: '123',
//   files: [{ ...defaultFile }]
// }

const App = () => {

  // const users = [user]
  // localStorage.setItem("users", JSON.stringify(users));

  // const users = JSON.parse(localStorage.getItem("users")) || [];

  const [currentUser, setCurrentUser] = useState(null);

  return (
      <>
        <UserManager currentUser={currentUser} setCurrentUser={setCurrentUser}/>
        {currentUser && <TextLab userID={currentUser.id} />}
      </>
  )
}

export default App