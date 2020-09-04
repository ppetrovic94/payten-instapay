export const getCookie = (cookieName) => {
  const cookies = document.cookie.split(';');
  return cookies.find((cookie) => cookie.search(cookieName) !== -1);
};

export const getTrackingData = (cookieId) => {
  const cookie = getCookie(cookieId);

  return cookie ? cookie.replace(`${cookieId}=`, '').trim() : undefined;
};
