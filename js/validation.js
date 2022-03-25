const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const required = (value) => !value;
const email = (value) => !emailPattern.test(value);
const min = (value, limit) => value.length < limit;
const max = (value, limit) => value.length > limit;
let validationRules = {
  author_name: {
    required,
    min: 4,
    max: 50,
  },
  author_email: {
    required,
    email,
  },
  topic_title: {
    required,
    max: 100,
    min: 4,
  },
  topic_details: {
    required,
  },
};
let validationMessages = {
  author_name: {
    required: "The author name field is required",
    min: "The author name must be at leat 4 characters",
    max: "The author name must be less than 50 characters",
  },
  author_email: {
    required: "The author email field is required",
    email: "write valid email ",
  },
  topic_title: {
    required: "The topic title field is required",
    min: "The topic title must be at leat 4 characters",
    max: "The topic title must be less than 100 characters",
  },
  topic_details: {
    required: "The topic details field is required",
  },
};

function isValidData(formData) {
  for (const key in formData) {
    let value = formData[key];
    for (const ruleKey in validationRules[key]) {
      let validationFunction = validationRules[key][ruleKey];
      let checkValidatity = false;
      if (ruleKey == "min") {
        checkValidatity = min(value, validationFunction);
      } else if (ruleKey == "max") {
        checkValidatity = max(value, validationFunction);
      } else checkValidatity = validationFunction(value);
      if (checkValidatity) {
        document.querySelector(`[name=${key}]`).classList.add("is-invalid");
        document.querySelector(
          `[name=${key}]+.invalid-feedback`
        ).innerHTML += `<br>${validationMessages[key][ruleKey]}`;
      }
    }
  }
  let invalidElements = document
    .getElementById("formVideoRequest")
    .querySelectorAll(".is-invalid");
  if (invalidElements.length) {
    invalidElements.forEach((el) =>
      el.addEventListener("input", function () {
        this.classList.remove("is-invalid");
      })
    );
    return false;
  }
  return true;
}
