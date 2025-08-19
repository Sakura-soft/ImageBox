import { setNameAvailable, setUserError } from "@/app/slice/user-slice";
import Logo from "@/components/logo/Logo";
import { Button } from "@/components/ui/button";
import CInput from "@/components/ui/CInput";
import CLoader from "@/components/ui/CLoader";
import useUserApi from "@/hooks/api-hooks/UserApi";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FcOk } from "react-icons/fc";
import { IoMdAlert } from "react-icons/io";

const Singup = () => {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  const { userLoading, userError, nameAvailable, nameLoading } = useSelector(
    (state) => state.user
  );

  const { singUp, userNameAvailable } = useUserApi();

  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const debounceRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setValue("profilePhoto", file);
      setPreviewUrl(URL.createObjectURL(file));
      trigger("profilePhoto");
    } else {
      setPreviewUrl(null);
      setValue("profilePhoto", null);
      trigger("profilePhoto");
    }
  };

  const handleCancelImage = (e) => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setValue("profilePhoto", null);
    trigger("profilePhoto");
  };

  const handleRegister = async (data) => {
    const success = await singUp(data);
    if (success) {
      dispatch(setUserError(null));
      navigate("/auth/Verify-otp");
    }
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (value) {
      debounceRef.current = setTimeout(() => {
        dispatch(setUserError(null));
        userNameAvailable(value);
      }, 1000);
    } else {
      dispatch(setNameAvailable(null));
    }
  };

  useEffect(() => {
    dispatch(setNameAvailable(null));
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-[330px] w-full p-4 flex flex-col overflow-hidden gap-8 items-center justify-center">
      <div className="flex flex-col gap-1 items-center">
        <Logo size="35px" />
        <span className="text-sm text-center">
          Create your new Account with Gmail .
        </span>
      </div>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className=" flex flex-col gap-2.5 w-full items-center"
      >
        <div className="w-full">
          <CInput
            label="UserName"
            id="UserName"
            type="text"
            placeholder="Enter userName here . . . "
            {...register("userName", {
              required: "user name is required !",
              onChange: handleUserNameChange,
              validate: (value) =>
                value.trim() !== "" || "Folder name cannot be empty spaces",
            })}
          />
          {nameAvailable == true && (
            <div className="w-full p-1 text-xs text-green-500 flex items-center justify-between font-medium">
              <span className="flex items-center gap-1">
                <FcOk /> available
              </span>
              {nameLoading && <CLoader className="text-zinc-500" />}
            </div>
          )}
          {nameAvailable == false && (
            <div className="w-full p-1 text-xs text-red-500 flex items-center justify-between font-medium">
              <span className="flex items-center gap-1">
                <IoMdAlert /> not available
              </span>
              {nameLoading && <CLoader className="text-zinc-500" />}
            </div>
          )}
          {errors.userName && (
            <span className="text-red-500 text-xs m-1">
              {errors.userName.message}
            </span>
          )}
        </div>
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
              },
            })}
          />
          {errors.email && (
            <span className="text-red-500 text-xs m-1">
              {errors.email.message}
            </span>
          )}
        </div>
        <div className="w-full">
          <CInput
            accept="image/*"
            label="ProfilePhoto"
            id="profilePhoto"
            profile={true}
            type="file"
            ref={fileInputRef}
            file={previewUrl}
            {...register("profilePhoto", {
              onChange: handleImageChange,
            })}
          />
          {previewUrl && (
            <Button
              type="button"
              className="my-1 hover:bg-red-500/30 smooth"
              onClick={handleCancelImage}
              variant="secondary"
            >
              Cancel
            </Button>
          )}
        </div>
        <div className="w-full">
          <CInput
            label="Password"
            id="Password"
            type="Password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-xs m-1">
              {errors.password.message}
            </span>
          )}
          {userError && (
            <span className="text-red-500 text-xs ml-1">{userError}</span>
          )}
        </div>
        <Button disabled={userLoading} className="mt-2 w-[max-content]">
          {userLoading && <CLoader />} Sing Up
        </Button>
      </form>
      <div className="text-xs flex gap-1.5 w-full justify-end items-end">
        <span className="text-zinc-500 text-xs">Already have account ?</span>
        <Link
          onClick={() => dispatch(setUserError(null))}
          to="/auth/login"
          className="hover:underline font-medium"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Singup;
