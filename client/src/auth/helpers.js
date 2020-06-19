import cookies from "js-cookie";

export const setCookie = (key, value) => {
  if (window != "undefined") {
    cookies.set(key, value, {
      expires: 1,
    });
  }
};

export const removeCookie = (key) => {
  if (window != "undefined") {
    cookies.remove(key, {
      expires: 1,
    });
  }
};

export const getCookie = (key) => {
  if (window != "undefined") {
    return cookies.get(key);
  }
};
export const setLocalStorage = (key, value) => {
  if (window != "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
export const removeLocalStorage = (key) => {
  if (window != "undefined") {
    localStorage.removeItem(key);
  }
};

export const cookie = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

export const cookieChecked = () => {
  if (window != "undefined") {
    const cookieCheck = getCookie("token");
    if (cookieCheck) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const signOut = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
};
