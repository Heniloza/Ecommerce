import Form from "@/components/common/FormCommon";
import { loginFormControls } from "@/config";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../store/auth-slice/index";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
   const { toast } = useToast();

  function onSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/shop/home");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3-xl font-bold tracking-tight text-foreground">
          Login to your account
        </h1>
        <p className="mt-2">
          Dont have an account?
          <Link
            className="font-medium text-primary hover:underline ml-2"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <Form
        formControl={loginFormControls}
        buttonText={"Login"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default Login;
