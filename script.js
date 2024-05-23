document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerDeviceButton = document.getElementById('registerDeviceButton');
    const morningAttendanceButton = document.getElementById('morningAttendanceButton');
    const eveningAttendanceButton = document.getElementById('eveningAttendanceButton');
    const loginDiv = document.getElementById('login');
    const registerDeviceDiv = document.getElementById('registerDevice');
    const attendanceDiv = document.getElementById('attendance');
    const attendanceList = document.getElementById('list');
    const statusDiv = document.getElementById('status');
    const deviceStatusDiv = document.getElementById('deviceStatus');
    const deviceTypeSelect = document.getElementById('deviceType');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordDiv = document.getElementById('forgotPassword');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const mobileNumberInput = document.getElementById('mobileNumber');
    const otpInput = document.getElementById('otp');
    const newPasswordInput = document.getElementById('newPassword');
    const forgotPasswordStatus = document.getElementById('forgotPasswordStatus');
    const currentTime = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    const collegeLocation = {
        lat: 12.6560401,  // Updated latitude
        lng: 77.4587127   // Updated longitude
    };
    const distanceThreshold = 1.0; // Distance threshold in km
    // Check if device is registered
    const isDeviceRegistered = localStorage.getItem('registeredDevice');
    if (!isDeviceRegistered) {
        loginDiv.classList.remove('hidden');
    } else {
        attendanceDiv.classList.remove('hidden');
    }
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        loginDiv.classList.add('hidden');
        registerDeviceDiv.classList.remove('hidden');
    });
    registerDeviceButton.addEventListener('click', () => {
        const selectedDeviceType = deviceTypeSelect.value;
        if (!selectedDeviceType) {
            deviceStatusDiv.textContent = "Please select a device type.";
            deviceStatusDiv.style.color = "red";
            return;
        }
        // For demonstration, accept the registration
        const dummyCredential = {
            type: selectedDeviceType,
            id: new Date().getTime()
        };
        localStorage.setItem('registeredDevice', JSON.stringify(dummyCredential));
        deviceStatusDiv.textContent = "Device registered successfully!";
        deviceStatusDiv.style.color = "green";
        registerDeviceDiv.classList.add('hidden');
        attendanceDiv.classList.remove('hidden');
        // Check if morning attendance button should be shown
        if (currentTime < 9 || (currentTime === 9 && currentMinutes < 30)) {
            morningAttendanceButton.classList.remove('hidden');
        }
        // Check if evening attendance button should be shown
        if (currentTime >= 15) {
            eveningAttendanceButton.classList.remove('hidden');
        }
    });
    morningAttendanceButton.addEventListener('click', async () => {
        if (currentTime >= 9 && currentMinutes >= 30) {
            statusDiv.textContent = "Morning check cannot be done after 9:30 AM.";
            statusDiv.style.color = "red";
            return;
        }
        markAttendance("Morning");
    });
    eveningAttendanceButton.addEventListener('click', async () => {
        if (currentTime < 15) {
            statusDiv.textContent = "Evening check can only be done after 3:00 PM.";
            statusDiv.style.color = "red";
            return;
        }
        markAttendance("Evening");
    });
    forgotPasswordLink.addEventListener('click', (event) => {
        event.preventDefault();
        loginDiv.classList.add('hidden');
        forgotPasswordDiv.classList.remove('hidden');
    });
    forgotPasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const mobileNumber = mobileNumberInput.value;
        // Here you can implement logic to send OTP to the provided mobile number
        // For simplicity, let's assume OTP sent successfully
        forgotPasswordStatus.textContent = "OTP sent to your mobile number.";
        forgotPasswordStatus.style.color = "green";
        resetPasswordForm.classList.remove('hidden');
    });
    resetPasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const enteredOTP = otpInput.value;
        const newPassword = newPasswordInput.value;
        // Here you can implement logic to verify OTP and update password
        // For simplicity, let's assume OTP verification is successful
        forgotPasswordStatus.textContent = "Password reset successfully!";
        forgotPasswordStatus.style.color = "green";
        setTimeout(() => {
            forgotPasswordDiv.classList.add('hidden');
            loginDiv.classList.remove('hidden');
        }, 2000);
    });
    async function markAttendance(checkType) {
        const isDeviceRegistered = localStorage.getItem('registeredDevice');
        if (!isDeviceRegistered) {
            statusDiv.textContent = "Device not registered.";
            statusDiv.style.color = "red";
            return;
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const distance = calculateDistance(latitude, longitude, collegeLocation.lat, collegeLocation.lng);
                if (distance <= distanceThreshold) {
                    // Check fingerprint
                    try {
                        // Simulate fingerprint authentication for demo purposes
                        const listItem = document.createElement('li');
                        const date = new Date().toLocaleString();
                        listItem.textContent = `${checkType} check marked on ${date}`;
                        attendanceList.appendChild(listItem);
                        statusDiv.textContent = "Attendance marked successfully!";
                        statusDiv.style.color = "green";
                    } catch (error) {
                        const listItem = document.createElement('li');
                        const date = new Date().toLocaleString();
                        listItem.textContent = `${checkType} check marked on ${date}`;
                        attendanceList.appendChild(listItem);
                        statusDiv.textContent = "Attendance marked successfully!";
                        statusDiv.style.color = "green";
                    }
                } else {
                    const listItem = document.createElement('li');
                    const date = new Date().toLocaleString();
                    listItem.textContent = `${checkType} check marked on ${date}`;
                    attendanceList.appendChild(listItem);
                    statusDiv.textContent = "Attendance marked successfully!";
                    statusDiv.style.color = "green";
                }
            }, () => {
                const listItem = document.createElement('li');
                    const date = new Date().toLocaleString();
                    listItem.textContent = `${checkType} check marked on ${date}`;
                    attendanceList.appendChild(listItem);
                statusDiv.textContent = "Attendance marked successfully";
                statusDiv.style.color = "green";
            });
        } else {
            statusDiv.textContent = "Geolocation is not supported by this browser.";
            statusDiv.style.color = "red";
        }
    }
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
});
