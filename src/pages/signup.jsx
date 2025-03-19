import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../redux/reducers/user/useThunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Signup.scss";

const Signup = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Name must be at least 3 characters").required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await signup(values).unwrap();

      // Show success toast
      toast.success("Signup successful! Redirecting...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => navigate("/login"), 3000); // Redirect after 3s
    } catch (error) {
      toast.error(error?.data?.message || "Signup failed. Please try again.", {
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
    <div className="signup-container">
      <h2>Sign Up</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="signup-form">
            <div className="input-group">
              <label>Name</label>
              <Field type="text" name="name" placeholder="Enter your name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

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
              {isSubmitting || isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
