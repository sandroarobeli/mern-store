//  This function takes in sting phone number input and formats as US phone number
export const phoneFormatter = (input) => {
  // if input value is falsy eg if the user deletes the input, then just return
  if (!input) return input;

  // clean the input for any non-digit values.
  const phoneNumber = input.replace(/[^\d]/g, "");

  // phoneNumberLength is used to know when to apply our formatting for the phone number
  const phoneNumberLength = phoneNumber.length;

  // we need to return the value with no formatting if its less than four digits
  // this is to avoid weird behavior that occurs if you  format the area code too early
  if (phoneNumberLength < 4) return phoneNumber;

  // if phoneNumberLength is greater than 4 and less the 7 we start to return
  // the formatted number
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  // finally, if the phoneNumberLength is greater then seven, we add the last
  // bit of formatting and return it.
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`; // 9
};
