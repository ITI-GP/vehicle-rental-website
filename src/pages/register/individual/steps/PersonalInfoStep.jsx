import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPersonalInfo } from "../individualSlice";

const PersonalInfoStep = () => {
  const dispatch = useDispatch();
  const [info, setInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
    dispatch(setPersonalInfo({ ...info, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-4">
      <input
        name="fullName"
        placeholder="Full Name"
        className="w-full p-2 border rounded"
        value={info.fullName}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={info.email}
        onChange={handleChange}
      />
      <input
        name="phone"
        placeholder="Phone"
        className="w-full p-2 border rounded"
        value={info.phone}
        onChange={handleChange}
      />
    </div>
  );
};

export default PersonalInfoStep;
