export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined' || !document.cookie) return;
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  props = {
    path: '/',
    ...props
  };

  let expires = props.expires;
  if (typeof expires === 'number') {
    const date = new Date();
    date.setTime(date.getSeconds() + expires);
    expires = date;
  }

  if (expires instanceof Date) {
    props.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = `${name}=${value}`;
  for (const propName in props) {
    updatedCookie += `; ${propName}`;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += `=${propValue}`;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, '', { expires: -1, path: '/' });
}
