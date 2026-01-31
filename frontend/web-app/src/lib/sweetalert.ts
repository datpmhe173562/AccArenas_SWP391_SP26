import Swal from 'sweetalert2';

// Toast configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const showSuccess = (message: string, title = 'Thành công!') => {
  return Toast.fire({
    icon: 'success',
    title,
    text: message,
  });
};

export const showError = (message: string, title = 'Lỗi!') => {
  return Toast.fire({
    icon: 'error',
    title,
    text: message,
  });
};

export const showWarning = (message: string, title = 'Cảnh báo!') => {
  return Toast.fire({
    icon: 'warning',
    title,
    text: message,
  });
};

export const showInfo = (message: string, title = 'Thông báo!') => {
  return Toast.fire({
    icon: 'info',
    title,
    text: message,
  });
};

// Confirmation dialog
export const showConfirm = async (
  message: string,
  title = 'Bạn có chắc chắn?',
  confirmButtonText = 'Đồng ý',
  cancelButtonText = 'Hủy'
) => {
  const result = await Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#ef4444',
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};

// Loading dialog
export const showLoading = (message = 'Đang xử lý...') => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const hideLoading = () => {
  Swal.close();
};

// Validation errors
export const showValidationErrors = (errors: Record<string, string>) => {
  const errorList = Object.entries(errors)
    .map(([field, message]) => `<li class="text-left">${message}</li>`)
    .join('');

  return Swal.fire({
    icon: 'error',
    title: 'Lỗi xác thực',
    html: `<ul class="text-sm">${errorList}</ul>`,
    confirmButtonColor: '#4f46e5',
  });
};

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showConfirm,
  showLoading,
  hideLoading,
  showValidationErrors,
};
