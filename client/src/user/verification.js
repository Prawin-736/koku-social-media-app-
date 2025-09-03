
// countdown function to start the timer
let interval;
function countdown(minutes) {
    //  Check if we already stored endTime in localStorage
    let endTime = localStorage.getItem("countdownEndTime");


    if (endTime) {
        // converting to int
        endTime = parseInt(endTime);
    }


    // clears previous timer
    if (interval){
       clearInterval(interval);
    }  

    // setInterval  to run the code for every one second (1000ms)
    interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        const mins = Math.floor(distance / (1000 * 60));
        const secs = Math.floor((distance % (1000 * 60)) / 1000);

        // disabling the resendbutton here
        const counter = document.querySelector("#timer");
        const resendButton = document.querySelector("#resendOtpButton");
        const otpMessage = document.querySelector("#otpMsg");
        otpMessage.textContent="Please wait before requesting new OTP.";

        if (distance <= 0) {

            // clearing the setInterval when time is zero so the function will not run after timer is 0.
            clearInterval(interval);

            // clear stored end time from localStorage.
            localStorage.removeItem("countdownEndTime"); 

            // getting the resend button back again after the timer is over
            resendButton.classList.add("btn-secondary");
            resendButton.classList.remove("disabled");
            resendButton.textContent="Resend OTP";
            otpMessage.textContent="Didn't receive the code? click above to try again.";

        } if (counter) {
    counter.innerHTML = `Resend OTP in ${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
       }, 1000);
}


// on page load fetching userEmail and starting the counter for OTp 
document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('load', async function () {

      const response = await fetch('/api/user/userEmail',{
        method:'GET',
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        }
      });
      
      const result = await response.json();
      if(response.ok){
     const userEmail=document.querySelector("#verify-user-email");
     userEmail.textContent="";
    userEmail.textContent=result.email;

const resendButton = document.querySelector("#resendOtpButton");
resendButton.setAttribute("data-user-email", result.email);

    // starts the counter for OTP new request
     countdown(2);

    }

});
});


// Resend otp button
const resendButton = document.querySelector("#resendOtpButton");

resendButton.addEventListener("click",async (event) => {
    event.preventDefault();
const email = resendButton.getAttribute("data-user-email");
    let minutes = 2;
    const now = new Date().getTime();
    let endTime = now + minutes * 60 * 1000;

    const response = await fetch("/api/user/resendOtp",{
        method:'POST',
        credentials:"include",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({email})
    });

   if(response.ok){
    // Store new endTime in 1) localStorage ,2)start the countdown ,3)reload the page 
    localStorage.setItem("countdownEndTime", endTime);

    countdown(2);

    location.reload();
   }

});


// OTP validation +redirecting to NewPassword
const form = document.querySelector(".verify__form");
const successBox = document.querySelector(".verify__success-message");
const errorBox = document.querySelector(".verify__error-message");

document.addEventListener("DOMContentLoaded",()=>{

form.addEventListener("submit",async (event)=>{

    event.preventDefault();
const otpInput = document.querySelector("#otp-input").value;

try{
    const response = await fetch('/api/user/otpverification',{
        method:'POST',
        headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify({otpInput}),
    })

    const result = await response.json();
    
    if(response.ok){
    
    errorBox.innerHTML="";
    errorBox.style.display="none";

    const successStructure =`<small class="bg-success-subtle rounded-2 py-2 px-3 text-center ">${result.message}</small>`
   successBox.innerHTML="";
   successBox.innerHTML=successStructure;
   successBox.style.display="block";
       setTimeout(() => {
           successBox.innerHTML="";
           successBox.style.display="none";

           errorBox.innerHTML="";
           errorBox.style.display="none";

           resendButton.classList.add("btn-secondary");
            resendButton.classList.remove("disabled");
            resendButton.textContent="Resend OTP";
            const otpMessage = document.querySelector("#otpMsg");
            otpMessage.textContent="Didn't receive the code? click above to try again.";
           document.querySelector("#otp-input").value="";
         clearInterval(interval);
    window.location.href = "/api/user/newPassword";
    }, 1000);
    }else{
 
    successBox.innerHTML="";
   successBox.style.display="none";
  
   const errorMsg = result.errors?.[0]?.message;
   const errorStructure =`<small class="bg-danger-subtle py-2 px-3 rounded-2 text-center"  style="width: 100%;">${errorMsg}</small>`
   errorBox.innerHTML="";
   errorBox.innerHTML=errorStructure;
   errorBox.style.display="block";
    return;
    }           
    }catch (error) {
    console.error("verification error : ", error);
    }
  
})
});



