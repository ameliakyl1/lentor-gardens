// Shared validation used by both the client-side form script and the server-side API route.
// Keep this file dependency-free so it can run in both environments unchanged.

export type EnquiryFormData = {
  fullName: string;
  mobileNumber: string;
  email: string;
  propertyInterest: string;
  preferredUnitType: string;
  preferredContactMethod: string;
  preferredViewingDate: string;
  message: string;
  consentEnquiry: boolean;
  consentMarketing: boolean;
  honeypot: string;
};

export type ValidationErrors = Partial<Record<keyof EnquiryFormData, string>>;

// Accepts +65 8/9XXXXXXX, 65 8/9XXXXXXX, or bare 8/9XXXXXXX (Singapore mobile prefixes).
const SG_MOBILE_REGEX = /^(\+?65)?[89]\d{7}$/;

export function normaliseSgMobile(value: string): string {
  return value.replace(/[\s-]/g, "");
}

export function isValidSgMobile(value: string): boolean {
  return SG_MOBILE_REGEX.test(normaliseSgMobile(value));
}

export function isValidEmail(value: string): boolean {
  if (!value) return true; // email is optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateEnquiry(data: EnquiryFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (data.honeypot && data.honeypot.trim() !== "") {
    // Silent bot trap — caller should treat this as a fake success, not surface an error.
    errors.honeypot = "spam";
    return errors;
  }

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name.";
  }
  if (!data.mobileNumber || !isValidSgMobile(data.mobileNumber)) {
    errors.mobileNumber = "Please enter a valid Singapore mobile number (e.g. 9123 4567).";
  }
  if (data.email && !isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.preferredContactMethod) {
    errors.preferredContactMethod = "Please select a preferred contact method.";
  }
  if (!data.consentEnquiry) {
    errors.consentEnquiry = "Please confirm you consent to being contacted about this enquiry.";
  }

  return errors;
}
