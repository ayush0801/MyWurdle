
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Alert = ({ isOpen, message }) =>
  <>
    {isOpen && toast(message, { toastId: 'alert' })}
  </>


