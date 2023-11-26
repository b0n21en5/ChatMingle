import logo from "../../assets/logo.png";
import leaf from "../../assets/leaf.png";
import leaves from "../../assets/leaves.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  loginRoute,
  registerUserRoute,
  resetPasswordRoute,
  updateUserRoute,
} from "../../utills/apiRoutes";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import toast from "react-hot-toast";
import styles from "./Auth.module.css";

const Auth = () => {
  const [auth, setAuth] = useState({
    username: "",
    email: "",
    password: "",
    answer: "",
    profileImg: "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const handleRegisterNewUser = async () => {
    try {
      const formData = new FormData();
      formData.append("username", auth.username);
      formData.append("email", auth.email);
      formData.append("password", auth.password);
      formData.append("answer", auth.answer);
      formData.append("profileImg", auth.profileImg);

      const { data } = await axios.post(registerUserRoute, formData);
      if (data.username) {
        toast.success(`${data.username} successfully registered`);
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleUserLogin = async () => {
    try {
      const { data } = await axios.post(loginRoute, auth);
      if (data.username) {
        toast.success(`${data.username} logged in`);
        dispatch(setUser(data));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const { data } = await axios.put(resetPasswordRoute, auth);
      if (data.username) {
        toast.success("Password resets");
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleInputFields = (e, fieldName) => {
    if (fieldName === "profileImg") {
      setAuth((p) => ({ ...p, [fieldName]: e.target.files[0] }));
    } else {
      setAuth((p) => ({ ...p, [fieldName]: e.target.value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (path === "login") {
      handleUserLogin();
    } else if (path === "reset") {
      handleResetPassword();
    } else {
      handleRegisterNewUser();
    }
  };

  useEffect(() => {
    setAuth({
      username: "",
      email: "",
      password: "",
      answer: "",
      profileImg: "",
    });
  }, [path]);

  return (
    <div className={styles.main}>
      <div className={styles.authCnt}>
        <div>
          <img
            className={styles.leaf}
            src={leaf}
            height={180}
            alt="leaf image"
          />
          <form className={styles.formCnt} onSubmit={handleFormSubmit}>
            <div className={styles.heading}>
              <img src={logo} alt="" />
              <h1>
                Chat Mingle -{" "}
                {path === "login"
                  ? "Login"
                  : path == "reset"
                  ? "Reset"
                  : "Sign Up"}
              </h1>
            </div>

            {path !== "reset" && (
              <label>
                <div>Enter username</div>
                <input
                  type="text"
                  value={auth?.username}
                  onChange={(e) => handleInputFields(e, "username")}
                  required
                />
              </label>
            )}

            {path !== "login" && (
              <label>
                <div>Enter email address</div>
                <input
                  type="text"
                  value={auth.email}
                  onChange={(e) => handleInputFields(e, "email")}
                  required
                />
              </label>
            )}

            <label>
              <div>
                {path === "reset" ? "Enter new password" : "Enter password"}
              </div>
              <input
                type="password"
                value={auth.password}
                onChange={(e) => handleInputFields(e, "password")}
                required
              />
            </label>

            {path !== "login" && (
              <>
                <label>
                  <div>Your favorite food?</div>
                  <input
                    type="text"
                    value={auth.answer}
                    onChange={(e) => handleInputFields(e, "answer")}
                    required
                  />
                </label>

                {path !== "reset" && (
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleInputFields(e, "profileImg")}
                    />
                  </label>
                )}
              </>
            )}

            <div className={styles.btnSec}>
              {path === "login" && (
                <span>
                  Forgot passowrd? <Link to="/auth/reset">Reset</Link>
                </span>
              )}
              <button className={styles.submitBtn} type="submit">
                {path === "login"
                  ? "Login"
                  : path === "reset"
                  ? "Reset now"
                  : "Register"}
              </button>

              <div>
                {path === "login" ? (
                  <span>
                    Don't have account? <Link to="/auth/sign-up">Register</Link>
                  </span>
                ) : (
                  <span>
                    Already registered? <Link to="/auth/login">Login</Link>
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className={styles.right}>
          <img
            width={440}
            height={440}
            src={leaves}
            alt="auth right leaves image"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
