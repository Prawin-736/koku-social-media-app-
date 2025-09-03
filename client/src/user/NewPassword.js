



const form = document.querySelector("#new-password__form");
const successBox = document.querySelector("#new-password__success-message");
const errorBox = document.querySelector("#new-password__error-message");

form.addEventListener("submit",async(event)=>{
    
    event.preventDefault();
const newPassword = document.querySelector("#new-password-input").value;
const confirmPassword = document.querySelector("#confirm-password-input").value;

const response = await fetch("api/user/newPassword",{
    method:"POST",
    credentials:"include",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({newPassword,confirmPassword})
})

const result = await response.json();
if(response.ok){

    errorBox.innerHTML="";
    errorBox.style.display="none";

    const successStructure = `<small class="bg-success-subtle py-2 px-3 rounded-2 text-center"  style="width: 100%;">${result.message}</small>`;
    successBox.innerHTML=successStructure;
       successBox.style.display="block";
     
       setTimeout(()=>{
        successBox.innerHTML="";
        successBox.style.display="none";

        document.querySelector("#new-password-input").value="";
        document.querySelector("#confirm-password-input").value="";


        window.location.href = "/api/user/signIn";

        },1000);
       return;

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

})
