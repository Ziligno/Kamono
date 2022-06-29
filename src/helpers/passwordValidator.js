export function passwordValidator(password) {
  if (!password) return "Password can't be empty.";
  if (password.length < 5)
    return "Password must be at least 5 characters long.";
  return "";
}

export function detailsValidator(password) {
  if (!password) return "Enter all details.";
  return "";
}

export function phoneNumberValidator(phoneNumber) {
  if (!phoneNumber) return "Enter all details.";
  if (phoneNumber.length < 10) return "Invalid Phone Number";
  return "";
}
