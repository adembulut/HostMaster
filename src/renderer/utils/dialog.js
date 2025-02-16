const Swal = require('sweetalert2');
const backgroundColor = '#222';
const textColor = '#fff';
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: backgroundColor,
    color: textColor,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

const alertSuccess = (message) => {
    Toast.fire({
        icon: "success",
        title: message
    });
}

const alertError = (message) => {
    Toast.fire({
        icon: "error",
        title: message
    });
}

const alertWarning = (message) => {
    Toast.fire({
        icon: "warning",
        title: message
    });
}

const confirm = (message, callback) => {
    Swal.fire({
        title: "Are you sure?",
        text: message,
        icon: "warning",
        background: backgroundColor,
        color: textColor,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok"
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}


const showMessage = (message, icon = "success", title = "Info") => {
    Toast.fire({
        icon: "success",
        title: "Signed in successfully"
    });
    //
    // Swal.fire({
    //     titleText: title,
    //     text: message,
    //     icon: icon,
    //     confirmButtonText: 'OK',
    //     background: '#222',
    //     color: '#fff'
    // }).then((data) => {
    //     console.log(data);
    // });
}

module.exports = {
    alertSuccess,
    alertError,
    alertWarning,
    confirm,
    showMessage,
}