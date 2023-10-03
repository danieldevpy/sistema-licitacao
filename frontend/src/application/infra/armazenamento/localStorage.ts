// localstorage.ts

const setLocalStorageItem = (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error storing data in Local Storage:', error);
    }
  };
  
  const getLocalStorageItem = (key: string): any | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error retrieving data from Local Storage:', error);
      return null;
    }
  };
  
  export { setLocalStorageItem, getLocalStorageItem };
  