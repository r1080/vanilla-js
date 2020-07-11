validateForm = () => {
  const form = document.forms['form'];
  userNameHandler(form['username'].value);
  emailHandler(form['email'].value);
  passwordHandler(form['password'].value, form['password2'].value)
  return false;
}

passwordHandler = (password, password2) => {

  let errorMessage = '';
  const passwordOneDOM = document.getElementById('password').parentElement;
  const passwordTwoDOM = document.getElementById('password2').parentElement;

  if (password.length < 7) {
    errorMessage = 'Password must be at least 6 characters';
    setErrorHandler(passwordOneDOM, errorMessage);
    return false;
  }
  if (password2 !== password) {
    errorMessage = 'Passwords do not match';
    setErrorHandler(passwordTwoDOM, errorMessage);
    return false;
  }
  setSuccessHandler(passwordOneDOM);
  setSuccessHandler(passwordTwoDOM);
}

emailHandler = (email) => {
  let errorMessage = '';
  const emailDOM = document.getElementById('email').parentElement;
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    setSuccessHandler(emailDOM);
  } else {
    errorMessage = 'Email is not valid';
    setErrorHandler(emailDOM, errorMessage);
  }
}

userNameHandler = (username) => {
  let errorMessage = '';
  const userNameDOM = document.getElementById('username').parentElement;
  if (username.length < 3) {
    errorMessage = 'Username must be at least 3 characters';
  } else if (username.length > 14) {
    errorMessage = 'Username must be less than 15 characters';
  } else {
    setSuccessHandler(userNameDOM);
    return;
  }
  setErrorHandler(userNameDOM, errorMessage);
}

setErrorHandler = (element, errorMessage) => {
  element.setAttribute("class", "form-control error");
  errorElement = element.querySelector('small');
  errorElement.innerHTML = errorMessage;
}

setSuccessHandler = (element) => {
  element.setAttribute("class", "form-control success");
}