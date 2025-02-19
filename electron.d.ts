declare global {
  interface Window {
    electron: {
      ipcRenderer: any;
      send: (channel: string, data: any) => void;
      on: (channel: string, callback: (...args: any[]) => void) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>; // ✅ Added invoke
    };
  }
}

// Ensure the file is treated as a module
export {};
