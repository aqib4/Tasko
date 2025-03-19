import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/reducers/user/useThunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.scss"; 

// Initialize Toastify

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = await login(values).unwrap();
      localStorage.setItem("token", userData.token); // Store token

      // Show success toast
      toast.success("Login successful!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      navigate("/todo"); // Redirect after successful login
      setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
      toast.error(error?.data?.message || "Login failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="login-form">
            <div className="input-group">
              <label>Email</label>
              <Field type="email" name="email" placeholder="Enter your email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="input-group">
              <label>Password</label>
              <Field type="password" name="password" placeholder="Enter your password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
