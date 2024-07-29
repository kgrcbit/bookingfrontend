// src/types/react-toastify.d.ts
declare module 'react-toastify' {
    import { ComponentType } from 'react';
  
    export interface ToastContainerProps {
      // Add your props here if needed
    }
  
    export const ToastContainer: ComponentType<ToastContainerProps>;
    export const toast: any; // Replace 'any' with more specific types if available
  
    export default {
      ToastContainer,
      toast,
    };
  }
  