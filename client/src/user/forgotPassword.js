
// redirect to signIn page
const backToLoginButton = document.querySelector("#back-to-login");

backToLoginButton.addEventListener("click",(event)=>{
event.preventDefault();
window.location.href = "http://localhost:3000/api/user/signIn";
});


const form = document.querySelector('.forgot-password__form');
const errorBox = document.querySelector('#error-box');
const submitButton = document.querySelector('#forgotpage-submit'); 


document.addEventListener("DOMContentLoaded", async ()=>{

form.addEventListener("submit",async(event)=>{

event.preventDefault();

   // Disable submit button to prevent multiple clicks
    submitButton.disabled = true;
    submitButton.textContent = "Sending..."; 

let email = document.querySelector('#forgot-password-email-input').value;

    const response = await fetch("/api/user/forgotPassword",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email})
            });

            const result = await response.json();

            if (!response.ok) {

                 // Re-enable the button since there's an error
        submitButton.disabled = false;
        submitButton.textContent = "Send OTP"; // Restore button text
        
            if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {

            let firstError = `<small class="bg-danger-subtle px-0 py-2 rounded-2">${result.errors[0].message}</small>`;
                    errorBox.innerHTML=firstError;
                    errorBox.classList.remove("d-none");
                    errorBox.style.display="block";
                }
            } 
            if(response.ok){
                console.log("email is succesffuly verified");
                email=""; 
                let minutes=2;
                const now = new Date().getTime();
                 let endTime = now + minutes * 60 * 1000;
                 localStorage.setItem("countdownEndTime", endTime);
                window.location.href = `/api/user/otpverification`;
   
            }
       
})
  });

