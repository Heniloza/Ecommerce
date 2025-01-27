import { registerFormControls } from "@/config";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../store/auth-slice/index";
import FormCommon from "../../components/common/FormCommon";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  username: "",
  email: "",
  password: "",
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(e) {
    e.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title:data?.payload?.message,
        })
        navigate("/auth/login");
      }else{
        toast({
          title:data?.payload?.message,
          variant:'destructive'
        })
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3-xl font-bold tracking-tight text-foreground">
          Create New Account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium text-primary hover:underline ml-2"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <FormCommon
        formControl={registerFormControls}
        buttonText={"Signup"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default Register;
