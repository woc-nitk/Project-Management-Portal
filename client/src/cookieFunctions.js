const getCookie = (cname) => {
  const name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

const setCookie = (cName, cValue, hours) => {
  let d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${cName}=${cValue};${expires};path=/`;
};

// export default getCookie;
export { getCookie, setCookie };
