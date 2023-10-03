const setCookie = (name: string, value: string, expiration: number, options: Record<string, any> = {}): void => {
    let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    // Add expiration in 15 days (in milliseconds)
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + expiration); // 15 days from now
    
    // Set the expiration attribute
    updatedCookie += `; expires=${expirationDate.toUTCString()}`;
    
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
