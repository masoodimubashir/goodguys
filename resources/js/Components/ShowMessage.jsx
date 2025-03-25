import Swal from 'sweetalert2';

export const ShowMessage = (icon, message, position = 'top-end', timer = 3000) => {
  if (message) {
    return Swal.fire({
      icon: icon,
      title: message,
      toast: true,
      position: position,
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      customClass: {
        title: 'small-font-toast',
        popup: 'small-font-toast-container'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
  }
};