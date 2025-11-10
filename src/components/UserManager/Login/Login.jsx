import { useState } from 'react';
import './Login.css';

const Login = ({ setCurrentUser, onSwitch }) => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      setCurrentUser(user);
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="loginContainer">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>

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

        <button type="submit">Login</button>

      </form>
      <p>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch}>Sign Up</button>
      </p>
    </div>
  );
};

export default Login;
