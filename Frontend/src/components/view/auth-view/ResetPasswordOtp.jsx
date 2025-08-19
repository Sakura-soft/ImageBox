import { setUserError } from "@/app/slice/user-slice";
import Logo from "@/components/logo/Logo";
import { Button } from "@/components/ui/button";
import CInput from "@/components/ui/CInput";
import CLoader from "@/components/ui/CLoader";
import useUserApi from "@/hooks/api-hooks/UserApi";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ResetPasswordOtp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { userLoading, userError } = useSelector((state) => state.user);

  const { resetPassOtp } = useUserApi();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleRegister = async (data) => {
    const success = await resetPassOtp(data);
    if (success) {
      dispatch(setUserError(null));
      navigate("/auth/reset-password");
    }
  };

  return (
    <div className="max-w-[330px] w-full p-4 flex flex-col overflow-hidden gap-8 items-center justify-center">
      <div className="flex flex-col gap-1 items-center">
        <Logo size="35px" />
        <span className="text-sm text-center">
          Enter your registered Gmail to receive a Reset OTP .
        </span>
      </div>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className=" flex flex-col gap-2.5 w-full items-center"
      >
        <div className="w-full">
          <CInput
            label="Email"
            id="Email"
            type="Email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
                validate: (value) =>
                  value.trim() !== "" || "Folder name cannot be empty spaces",
              },
            })}
          />
          {errors.email && (
            <span className="text-red-500 text-xs m-1">
              {errors.email.message}
            </span>
          )}
          {userError && (
            <span className="text-red-500 text-xs ml-1">{userError}</span>
          )}
        </div>
        <Button disabled={userLoading} className="mt-2 w-[max-content]">
          {userLoading && <CLoader />} Send
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordOtp;
