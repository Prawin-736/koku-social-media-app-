
// redirect to signIn page

const backToLoginButton = $("#signup-formgroup");

backToLoginButton.on("click",(event)=>{
event.preventDefault();
window.location.href = "http://localhost:3000/api/user/signIn";
});



//post logic

$(document).ready(() => {
    const form = $('#signup-form');
    const errorBox = $('#signup-error-message');
    const successBox = $('#signup-success-message');

    form.on("submit", async (event) => {
        event.preventDefault();
        errorBox.empty().hide();
        successBox.hide();

        const userName = $('#userName').val();
        const dateOfBirth = $('#dateOfBirth').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const gender = $('input[name="gender"]:checked').attr('id') || "";

        const genderMap = {
            maleBox: "male",
            femaleBox: "female",
            otherBox: "other"
        };

        const data = {
            username: userName,
            DOB: dateOfBirth,
            gender: genderMap[gender] || "",
            email,
            password
        };

        try {
            const response = await fetch("/api/user/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {

                if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
                    const firstError = result.errors[0].message || "Unknown error occurred";
                    console.log("First error:", firstError);
                    errorBox.innerHtml="";
                    errorBox.append(`<small class="bg-danger-subtle px-4 py-2 rounded-2">${firstError}</small>`);
                    errorBox.removeClass("d-none").show();
                }
            } 
            if(response.ok) {
                successBox.append(`<small class="bg-success-subtle px-4 py-2 rounded-2">${result.message}</small>`);
                successBox.removeClass("d-none").show();
                form[0].reset();
         
    // Redirectto signIn page after 2 seconds
    setTimeout(() => {window.location.href = "/api/user/signIn"; }, 2000);

            }
        }
         catch (error) {
        console.log(error);
            errorBox.append(`<small class="bg-danger-subtle px-4 py-2 rounded-2">${result.message}</small>`);
            errorBox.removeClass("d-none").show();
        }
    });
});




























// $(document).ready(()=>{
//     const form = $('#signup-form');
//     const errorBox = $('#signup-error-message');
//     const successBox = $('#signup-success-message');

//     form.on("submit", async (event) => {
//         event.preventDefault();
//         errorBox.hide();
//         successBox.hide();
    
//         const userName = $('#userName').val();
//         const dateOfBirth = $('#dateOfBirth').val();
//         const email = $('#email').val();
//         const password = $('#password').val();
    
//         const gender = $('input[name="gender"]:checked').attr('id') || "";
    
//         const genderMap = {
//             maleBox: "male",
//             femaleBox: "female",
//             otherBox: "other"
//         };
    
//         const data = {
//             userName,
//             dateOfBirth,
//             gender: genderMap[gender] || "",
//             email,
//             password
//         };
    
//         console.log("just for checking getting the data :", data);

// //facing issue in this part need ot find solution for this part
//     // try {
//         const response = await fetch("/api/user/signUp", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(data)
//         });
  
//         const result = await response.json();
//         console.log("checking the result",result);
//     });
// });
    //     if (!response.ok) {
    //       // ❌ Show validation errors
    //       const messages = Array.isArray(result.errors)
    //         ? result.errors.map(e => e.msg).join("<br>")
    //         : result.message || "An unknown error occurred.";
  
    //       errorBox.innerHTML = `<small class="bg-danger-subtle px-4 py-2 rounded-2">${messages}</small>`;
    //       errorBox.style.display = "flex";
    //     } else {
    //       // ✅ Show success
    //       successBox.style.display = "flex";
    //       form.reset();
    //     }
    //   } catch (err) {
    //     console.error("Network error:", err);
    //     errorBox.innerHTML = `<small class="bg-danger-subtle px-4 py-2 rounded-2">🔶 Something went wrong. Please try again later.</small>`;
    //     errorBox.style.display = "flex";
    //   }
   

// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.querySelector(".signup__form");
//     const errorBox = document.querySelector(".signup__error-message");
//     const successBox = document.querySelector(".signup__success-message");
  
//     // Hide messages by default
//     errorBox.style.display = "none";
//     successBox.style.display = "none";
  
//     form.addEventListener("submit", async (e) => {
//       e.preventDefault();
  
//       // Clear previous messages
//       errorBox.style.display = "none";
//       successBox.style.display = "none";
  
//       const username = document.getElementById("userName").value.trim();
//       const DOB = document.getElementById("dateOfBirth").value;
//       const email = document.getElementById("email").value.trim();
//       const password = document.getElementById("password").value;
      
//       // Get selected gender
//       const gender = document.querySelector('input[name="gender"]:checked')?.id || "";
  
//       // Map radio button ID to value expected in backend
//       const genderMap = {
//         maleBox: "male",
//         femaleBox: "female",
//         otherBox: "other"
//       };
  
//       const data = {
//         username,
//         DOB,
//         gender: genderMap[gender] || "",
//         email,
//         password
//       };
  
//       try {
//         const response = await fetch("/api/user/signUp", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(data)
//         });
  
//         const result = await response.json();
  
//         if (!response.ok) {
//           // ❌ Show validation errors
//           const messages = Array.isArray(result.errors)
//             ? result.errors.map(e => e.msg).join("<br>")
//             : result.message || "An unknown error occurred.";
  
//           errorBox.innerHTML = `<small class="bg-danger-subtle px-4 py-2 rounded-2">${messages}</small>`;
//           errorBox.style.display = "flex";
//         } else {
//           // ✅ Show success
//           successBox.style.display = "flex";
//           form.reset();
//         }
//       } catch (err) {
//         console.error("Network error:", err);
//         errorBox.innerHTML = `<small class="bg-danger-subtle px-4 py-2 rounded-2">🔶 Something went wrong. Please try again later.</small>`;
//         errorBox.style.display = "flex";
//       }
//     });
//   });
