// cookies.ts
const setCookie = (name: string, value: string, options: Record<string, any> = {}): void => {
    let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
    for (const optionKey in options) {
      updatedCookie += `; ${optionKey}`;
      const optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += `=${optionValue}`;
      }
    }
  
    document.cookie = updatedCookie;
  };
  
  const getCookie = (name: string): string | undefined => {
    const matches = document.cookie.match(
      new RegExp(`(?:^|; )${String(name).replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`)
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };
  
  export { setCookie, getCookie };
  