import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SuccessMessage = (message) => {
  setTimeout(() => toast.success(message, {
    position: "bottom-right",
    autoClose: 2000,
    theme: "colored",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }), 10)
}

export const ErrorMessage = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 2000,
    theme: "colored",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}