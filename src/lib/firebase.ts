import { initializeApp, getApps } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'machetecoin-3a788',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Keep track of the confirmation result for the current session
let windowConfirmationResult: ConfirmationResult | null = null;

export const setupRecaptcha = (containerId: string) => {
  if (typeof window === 'undefined') return;
  
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  }
};

export const sendFirebaseOtp = async (phoneNumber: string, appVerifier: any): Promise<{ success: boolean; error?: string }> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    windowConfirmationResult = confirmationResult;
    return { success: true };
  } catch (error: any) {
    console.error("Error sending Firebase OTP:", error);
    return { success: false, error: error.message || 'Error sending SMS' };
  }
};

export const verifyFirebaseOtp = async (code: string): Promise<boolean> => {
  if (!windowConfirmationResult) return false;
  
  try {
    await windowConfirmationResult.confirm(code);
    return true;
  } catch (error) {
    console.error("Error verifying Firebase OTP:", error);
    return false;
  }
};

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
