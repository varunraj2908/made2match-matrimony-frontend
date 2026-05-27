// app/(auth)/onboarding/OnboardingContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  type JSX,
} from "react";

export interface FormData {
  /* Step 1 – Basic Details */
  profileCreatedFor: string;
  gender: string;
  day: string;
  month: string;
  year: string;
  motherTongue: string;
  email: string;
  password: string;

  /* Step 2 – Personal & Religious */
  height: string;
  physicalStatus: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  subcaste: string;
  anycaste: boolean;
  jathakam: string;

  /* Step 3 – Location & Professional */
  country: string;
  state: string;
  city: string;
  education: string;
  profession: string;
  income: string;

  /* Step 4 – Additional */
  eatingHabits: string;
  smoking: string;
  drinking: string;

  partnerAgeFrom: string;
  partnerAgeTo: string;
  partnerHeight: string;
  partnerReligion: string;

  familyStatus: string;
  aboutYourself: string;
}

const defaultForm: FormData = {
  /* Step 1 */
  profileCreatedFor: "",
  gender: "",
  day: "",
  month: "",
  year: "",
  motherTongue: "",
  email: "",
  password: "",

  /* Step 2 */
  height: "",
  physicalStatus: "",
  maritalStatus: "",
  religion: "",
  caste: "",
  subcaste: "",
  anycaste: false,
  jathakam: "",

  /* Step 3 */
  country: "",
  state: "",
  city: "",
  education: "",
  profession: "",
  income: "",

  /* Step 4 */
  eatingHabits: "",
  smoking: "",
  drinking: "",

  partnerAgeFrom: "",
  partnerAgeTo: "",
  partnerHeight: "",
  partnerReligion: "",

  familyStatus: "",
  aboutYourself: "",
};

interface OnboardingCtx {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
}

const OnboardingContext = createContext<OnboardingCtx>({
  formData: defaultForm,
  setFormData: () => undefined,
});

export function OnboardingProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [formData, setFormData] =
    useState<FormData>(defaultForm);

  return (
    <OnboardingContext.Provider
      value={{ formData, setFormData }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingCtx {
  return useContext(OnboardingContext);
}