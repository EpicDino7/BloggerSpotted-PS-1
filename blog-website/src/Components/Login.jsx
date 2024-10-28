import { useAuth } from "../AuthContext";
import "../StyleSheets/Login.css";
import Navbar from "./Navbar";

const Login = () => {
  const { login } = useAuth();
  return (
    <>
      <Navbar showLoginButton={false} />
      <div className="login-container">
        <h2>Login to BlogWebsite</h2>
        <p>Sign in with your Google account to post blogs</p>
        <button onClick={login} className="google-login-btn">
          Login with Google
        </button>
      </div>
    </>
  );
};

export default Login;
