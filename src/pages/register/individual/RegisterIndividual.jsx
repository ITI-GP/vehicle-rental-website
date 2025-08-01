import React from "react";
// import MultiStepForm from "../../../components/MultiStepForm";
import useMultiStepForm from "../../../hooks/useMultiStepForm";
import { PersonalInfoStep, VehicleInfoStep, VehicleImagesStep } from "./steps";
import Button from "../../../components/rentYourVehicle/Button";

const RegisterIndividual = () => {
  const { steps, step, currentStepIndex, isfirstStep, isLastStep, back, next } =
    useMultiStepForm([PersonalInfoStep, VehicleInfoStep, VehicleImagesStep]);
  const StepComponent = step;
  function onSubmit(e) {
    e.preventDefault();
    next();
  }

  return (
    <form className="pt-10" onSubmit={onSubmit}>
      <h1 className="text-2xl font-bold text-center mb-6">
        Individual Registration
      </h1>
      <div>
        {currentStepIndex + 1}/{steps.length}
      </div>
      {/* <MultiStepForm /> */}

      <StepComponent />
      <div className="flex m-20 px-3 justify-around ">
        {!isfirstStep && <Button onClick={back}>Back</Button>}
        <Button type="submit">{isLastStep ? "Finish" : "Next"}</Button>
      </div>
    </form>
  );
};

export default RegisterIndividual;
