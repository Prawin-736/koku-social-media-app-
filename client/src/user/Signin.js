
// redirect to signup page
 const signUpPage = document.querySelector('#redirect-signup');
signUpPage.addEventListener("click",(event)=>{
    event.preventDefault();
    window.location.href ="http://localhost:3000/api/user/signUp";
});

// redirect to forgot password page
const forgotPassordPage = document.querySelector('#redirect-forgot-password');
forgotPassordPage.addEventListener('click',(event)=>{
    event.preventDefault();
    window.location.href ="http://localhost:3000/api/user/forgotPassword";
});


// Login logic 
document.addEventListener("DOMContentLoaded",()=>{

    const loginForm = document.querySelector('#login__form');
    const loginEmail = document.querySelector('#form-input');
    const loginPassword = document.querySelector('#form-password');
    const successBox = document.querySelector('#success-box');
    const errorBox = document.querySelector('#error-box');

    loginForm.addEventListener("submit",async(event)=>{

        event.preventDefault();

        errorBox.innerHTML = "";
        errorBox.style.display= "none";

        successBox.innerHTML="";
        successBox.style.display="none";

     const email = loginEmail.value.trim();
     const password = loginPassword.value.trim();
        const data = {
            email:email,
            password:password
        }

        try{
            const response = await fetch("/api/user/signIn",{
            method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                 credentials: "include"
            });
            const result = await response.json();

            // error message
            if (!response.ok) {
                if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
            let firstError = `<small class="bg-danger-subtle px-4 py-2 rounded-2">${result.errors[0].message}</small>`;
                    errorBox.innerHTML=firstError;
                    errorBox.classList.remove("d-none");
                    errorBox.style.display="block";                }
            } 
            // success message
            if(response.ok) {
                let successBoxStructure = `<small class="bg-success-subtle px-4 py-2 rounded-2">${result.message}</small>`;
                successBox.innerHTML=successBoxStructure;
                successBox.classList.remove("d-none");
                successBox.style.display="block";
  
            setTimeout(() => {
                // consider loginForm is a <form> element
              loginForm.reset(); 
              errorBox.innerHTML = "";
              errorBox.style.display = "none";
              successBox.innerHTML = "";
              successBox.style.display = "none";
              window.location.href = "/api/main";
              }, 500);
              }
              }catch (error) {
              const errorMessage = error.message;
             if(errorMessage){
            let errorBoxStructure = `<small class="bg-danger-subtle px-4 py-2 rounded-2">${errorMessage}</small>`;
             errorBox.innerHTML=errorBoxStructure;
            errorBox.classList.remove("d-none");
            errorBox.style.display="block";
        }
        }

    }); 
});
