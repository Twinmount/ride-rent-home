'use client';

import { useCallback } from 'react';
import { useImmer } from 'use-immer';
import { LoginData, SignupData } from './useAuth';

// Form validation state
export interface FormErrors {
  [key: string]: string;
}

// Login form hook
export const useLoginForm = () => {
  const [formData, updateFormData] = useImmer<LoginData>({
    phoneNumber: '',
    countryCode: '+971',
    password: '',
    rememberMe: false,
  });

  const [errors, updateErrors] = useImmer<FormErrors>({});
  const [touched, updateTouched] = useImmer<Record<string, boolean>>({});

  const updateField = useCallback((field: keyof LoginData, value: string | boolean) => {
    updateFormData(draft => {
      (draft as any)[field] = value;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      updateErrors(draft => {
        delete draft[field];
      });
    }
  }, [updateFormData, updateErrors, errors]);

  const setFieldTouched = useCallback((field: keyof LoginData) => {
    updateTouched(draft => {
      draft[field] = true;
    });
  }, [updateTouched]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9\s]{8,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    updateErrors(() => newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, updateErrors]);

  const resetForm = useCallback(() => {
    updateFormData(() => ({
      phoneNumber: '',
      countryCode: '+971',
      password: '',
      rememberMe: false,
    }));
    updateErrors(() => ({}));
    updateTouched(() => ({}));
  }, [updateFormData, updateErrors, updateTouched]);

  return {
    formData,
    errors,
    touched,
    updateField,
    setFieldTouched,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0 && formData.phoneNumber && formData.password,
  };
};

// Signup form hook
export const useSignupForm = () => {
  const [formData, updateFormData] = useImmer<SignupData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: '+971',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    agreeToTerms: false,
  });

  const [errors, updateErrors] = useImmer<FormErrors>({});
  const [touched, updateTouched] = useImmer<Record<string, boolean>>({});

  const updateField = useCallback((field: keyof SignupData, value: string | boolean) => {
    updateFormData(draft => {
      (draft as any)[field] = value;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      updateErrors(draft => {
        delete draft[field];
      });
    }
  }, [updateFormData, updateErrors, errors]);

  const setFieldTouched = useCallback((field: keyof SignupData) => {
    updateTouched(draft => {
      draft[field] = true;
    });
  }, [updateTouched]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9\s]{8,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors: string[] = [];
      
      if (formData.password.length < 8) {
        passwordErrors.push('at least 8 characters');
      }
      if (!/(?=.*[a-z])/.test(formData.password)) {
        passwordErrors.push('one lowercase letter');
      }
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        passwordErrors.push('one uppercase letter');
      }
      if (!/(?=.*\d)/.test(formData.password)) {
        passwordErrors.push('one number');
      }
      if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
        passwordErrors.push('one special character');
      }

      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain ${passwordErrors.join(', ')}`;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    updateErrors(() => newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, updateErrors]);

  const resetForm = useCallback(() => {
    updateFormData(() => ({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      countryCode: '+971',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      agreeToTerms: false,
    }));
    updateErrors(() => ({}));
    updateTouched(() => ({}));
  }, [updateFormData, updateErrors, updateTouched]);

  const isValid = Object.keys(errors).length === 0 && 
                  formData.firstName && 
                  formData.lastName && 
                  formData.email && 
                  formData.phoneNumber && 
                  formData.password && 
                  formData.confirmPassword && 
                  formData.agreeToTerms;

  return {
    formData,
    errors,
    touched,
    updateField,
    setFieldTouched,
    validateForm,
    resetForm,
    isValid,
  };
};

// Country codes list
export const COUNTRY_CODES = [
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'USA' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'UK' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+974', country: 'QA', flag: '🇶🇦', name: 'Qatar' },
  { code: '+965', country: 'KW', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+973', country: 'BH', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', country: 'OM', flag: '🇴🇲', name: 'Oman' },
];

export default { useLoginForm, useSignupForm };
