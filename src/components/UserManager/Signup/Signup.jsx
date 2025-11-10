import { useState } from 'react';
import './Signup.css';

const Signup = ({ setCurrentUser, onSwitch }) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  {/* טיפול בבקשת התחברות */ }
  const handleSubmit = (e) => {

    e.preventDefault();

    // בדיקה שכל השדות מלאים
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill all fields');
      return;
    }

    // בדיקת תקינות מייל
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email');
      return;
    }

    // בדיקת תקינות סיסמה
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    // בדיקה האם המייל כבר קיים
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === formData.email)) {
      alert('Email already exists!');
      return;
    }

    // יצירת משתמש חדש ושמירתו ב-localStorage
    const newUser = { id: Date.now(), ...formData, files: [] };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // עדכון המשתמש ב-App
    setCurrentUser(newUser);
  };

  return (
    <div className="signupContainer">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>

      </form>
      <p>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch}>Login</button>
      </p>
    </div>
  );
};

export default Signup;
