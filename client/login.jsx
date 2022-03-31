const helper = require('./helper.js'); // webpack lets us use require

const init = async () => {
  const response = await fetch('/getToken');
  const data = await response.json();

  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');
  const content = document.getElementById('content');
  const randomDomo = document.querySelector('#random');

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
      content);
    return false;
  });

  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    ReactDOM.render(<SignupWindow csrf={data.csrfToken} />,
      content);
    return false;
  })

  ReactDOM.render(<LoginWindow csrf={data.csrfToken} />, content);

  randomDomoFromServer(randomDomo);
};

window.onload = init;

const handleLogin = (e) => {
  e.preventDefault();
  helper.hideError();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;
  const _csrf = e.target.querySelector('#_csrf').value;

  if(!username || !pass) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass, _csrf });

  return false;
}

const handleSignup = (e) => {
  e.preventDefault();
  helper.hideError();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;
  const pass2 = e.target.querySelector('#pass2').value;
  const _csrf = e.target.querySelector('#_csrf').value;

  if(!username || !pass || !pass2) {
    helper.handleError('All fields are required!');
    return false;
  }

  if(pass !== pass2) {
    helper.handleError('Passwords do not match!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass, pass2, _csrf });

  return false;
}

const LoginWindow = (props) => {
  return (
    <form id="loginForm"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Sign in" />
    </form>
  );
};

const SignupWindow = (props) => {
  return (
    <form id="signupForm"
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="pass2">Password:</label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Signup" />
    </form>

  );
}

const ExampleDomo = (props) => {
  let tempName,tempAge,tempLevel;
  if(props.domo[0]) {
    tempName = props.domo[0].name;
    tempAge = props.domo[0].age;
    tempLevel = props.domo[0].level;
  } else {
    tempName = 'Placeholder';
    tempAge = '100';
    tempLevel = '100';
  }

  return (
    <div key={props.domo._id} className="domo">
      <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
      <h3 className="domoName"> Name: {tempName} </h3>
      <h3 className="domoAge"> Age: {tempAge} </h3>
      <h3 className="domoLevel"> Level: {tempLevel} </h3>
    </div>
  );
}

const randomDomoFromServer = async (content) => {
  const response = await fetch('/randomDomo');
  const data = await response.json();
  ReactDOM.render(<ExampleDomo domo={data.domo}/>,content);
}