source.isLoggedIn = function (): boolean {
  return state.authenticated;
};

source.login = function (username: string, password: string) {
  log('login called for user: ' + username);
  // Implement login logic
  state.authenticated = true;
};

source.logout = function () {
  log('logout called');
  state.authenticated = false;
  state.authToken = '';
};

