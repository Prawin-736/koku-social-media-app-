
import { dp_background_setter,capitalizeFirstTwoCharacter } from "../display-picture.middleware.js";

// this function lets the scroll is inside the inner container this lets the fucntion to scroll the contenet inside innercontainer from both inner and outer
const homeOuterScroll = () => {//important to know
  const innerContainer = document.querySelector('.main-side');
  const outerContainer = document.querySelector('.main-container');

  outerContainer.addEventListener('wheel', function(event) {
    const atTop = innerContainer.scrollTop === 0;
    const atBottom = innerContainer.scrollHeight - innerContainer.scrollTop === innerContainer.clientHeight;

    if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
      return;
    }

    event.preventDefault();
    innerContainer.scrollTop += event.deltaY;
  }, { passive: false });
};
homeOuterScroll();

//----------------------!!!!!!!!!!!!!!! PageSection

//---------homePage
const homePageSection = ()=>{
  
  // adds postingContainer to the home page
  document.addEventListener("DOMContentLoaded",()=>{

  const postingContainer =()=>{
  const postingHTML = `<div class="posting background-white  rounded-3 shadow-sm p-4 mb-2 d-flex  align-items-center justify-content-center" style="height: auto; width: 100%;">
          <div class="subcontainer-posting d-flex " style="width: 100%;">
          <div class="posting__dp" id="posting-dp"></div>
          <a class="posting-action background-white rounded-4 d-flex align-items-center font-color-black " data-bs-toggle="modal" data-bs-target="#post-modal" >Start a post</a>
          </div>  
        </div>`;

        const posting = document.createElement("div");
        posting.innerHTML= postingHTML;
        document.querySelector('.main-side').append(posting); 
  }
    postingContainer();

   });  

  //fetched and adds all the post to the homepage
  const getAllPost = ()=>{
    document.addEventListener("DOMContentLoaded", async ()=>{

   const response = await fetch("/api/post/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });

    const result = await response.json();

     if (response.ok) {
      const userId = result.user;
      const posts = result.posts;

      loadAllPostSection(userId, posts);
     }
     });
}
getAllPost();
}
//---------homePage-------------//

//--------------profilePage
const profilePageSection =()=>{

//-------------------userDetailContainer
const userDetailContainer =async()=>{
document.addEventListener("DOMContentLoaded", async ()=>{
  const response = await fetch("api/user/userDetail",{
    method:"GET",
    credentials:"include",
    headers:{
      "Content-Type": "application/json"
    }
  });

  const result = await response.json();

//date of bith
//formatting Date of birth in required format to display
  const dob = result.DOB;
  const dobObj = new Date(dob);
const formatteddobObj = dobObj.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const allDetailHTML = ` <div class="posting bg-white rounded-3 shadow-sm p-4 mb-2 d-flex align-items-center justify-content-center" style="height: 5rem; width: 100%;">
  <div class="subcontainer-posting d-flex py-0 w-100 align-items-center justify-content-between">
    <div class="d-flex align-items-center" id="userDetail-container">
      <div class="userAccount__dp me-3">
      </div>
      <div class="d-flex flex-column me-3">
        <h5 class="mb-0 pb-0">${result.username}</h5>
        <small>${result.email}</small>
      </div>
      <div class="d-flex flex-column">
        <small><img src="../assets/icon/calendar.svg" alt="calendar" style="width: 1rem;">&nbsp;&nbsp;${formatteddobObj}</small>
        <small><img src="../assets/icon/person.svg" alt="" style="width: 1.4rem;" >&nbsp;&nbsp;Gender: ${result.gender}</small>
      </div>
    </div>
              <button class="btn ms-auto userDetailEdit" type="button" style="cursor: pointer;" ><img src="../assets/icon/pencil-square.svg" alt=""  style="width: .9rem;">&nbsp;Edit</button>

  </div>
</div>`;

    const userDetailContainer = document.createElement("div");
    userDetailContainer.innerHTML= allDetailHTML;
// adding user detail to main-side container
document.querySelector('.main-side').append(userDetailContainer); 

  const dpContainer = document.querySelector('.userAccount__dp');
if (dpContainer) {

  //if user has profile picture
if (result.profilepicture) {
const img = document.createElement('img'); 
img.src = result.profilepicture;
img.alt = "Profile Picture"; 
dpContainer.appendChild(img);
return;
    }
    
  //if user doesnt have profile picture
  const firstTwoLetter = capitalizeFirstTwoCharacter(result.username);
  dpContainer.textContent = firstTwoLetter;
  dpContainer.style.display = "flex";
  dpContainer.style.justifyContent= "center";
  dpContainer.style.alignItems = "center";
  dpContainer.style.fontWeight = "bold";

  dp_background_setter(result.username,dpContainer);

}
}
)}
userDetailContainer();
//-------------------userDetailContainer------------------//

 //fetched and adds all the post to the homepage
  const getAllUserPost = ()=>{
    document.addEventListener("DOMContentLoaded", async ()=>{

   const response = await fetch("/api/post/user", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });

    const result = await response.json();

     if (response.ok) {
      if(result.posts.length === 0){
        const noPostHTML = ` <div class="post bg-white rounded-3 shadow-sm p-2 mb-2 d-flex flex-column " style=" width: 100%;height: auto;" >
      <div class="dashed-box" style=" border: 2px dashed #ccc;
    border-radius: 0.5rem;
    padding: 2rem">
  <div class="post-top bg-white d-flex justify-content-center align-items-center flex-column" style="height: 20rem;">
     <img src="../assets/icon/feather.svg" class="navbar-logo__icon mb-4" style="width: 32px;" alt="koku logo">
      
     <h6>No posts yet. Start sharing your thoughts!</h6>
     <h3>🛏️💤</h3>
    </div>
    </div>
  </div>`;

  const noPostContainer = document.createElement('div');
  noPostContainer.innerHTML=noPostHTML;
  document.querySelector('.main-side').append(noPostContainer); 


      }else{
       const userId = result.user;
      const posts = result.posts;

      // Pass both userId and posts to loadAllPostSection
      loadAllPostSection(userId, posts);
      }
     }
     });
}
getAllUserPost();


const userEditModal = ()=>{
//userEditModal----(action)(on clicking the main button which opens the modal with input has value)
//userEditModal on clicking the main userEditButton it opens the userprofileedit modal with data in input
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", async function (event) {
    const editProfileButton = event.target.closest(".userDetailEdit");

    if (editProfileButton) {
      event.preventDefault();

        const response = await fetch("/api/user/userDetail", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const result = await response.json();

        if (response.ok) {
          const modalElement = document.querySelector("#edit-User-modal");
          const usernameInput = modalElement.querySelector("#edit-User-username");
          usernameInput.value=result.username;
          const dobInput = modalElement.querySelector("#edit-User-dob");
          dobInput.value=result.DOB;
        const genderRadios = document.querySelectorAll('input[name="gender"]');

genderRadios.forEach(radio => {
  radio.checked = radio.value === result.gender;
});


          const bootstrapModal = new bootstrap.Modal(modalElement);
          bootstrapModal.show();
        }

    }
  });
});

//userEditModal(submit updated useDetail)
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", async function (event) {
    const updateProfileButton = event.target.closest(".editUserUpdate");

    if(updateProfileButton){

             const modalElement = document.querySelector("#edit-User-modal");
          const usernameInput = modalElement.querySelector("#edit-User-username");
          const dobInput = modalElement.querySelector("#edit-User-dob");
        const genderInput = document.querySelector('input[name="gender"]:checked')?.value;

        const data = {
            username: usernameInput.value,
            DOB: dobInput.value,
            gender:genderInput
        };

        const response = await fetch("/api/user/userDetail",{
          method:"POST",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(data)
        })

 
if (!response.ok) {
    const result = await response.json();
    if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
        const firstError = result.errors[0].message || "Unknown error occurred";
        console.log("First error:", firstError);

        const errorBox = modalElement.querySelector(".error-container-edit-user-modal");
        if (errorBox) {
            errorBox.textContent = firstError;
            errorBox.style.display = "block"; 
        }
    }
}
        if(response.ok){
          const bootstrapModal = new bootstrap.Modal(modalElement);
   if (bootstrapModal) {
    bootstrapModal.hide();
     }

    window.location.reload();
    
        }

    }

  });

//on clicking cancel it should clear the error message
const modalElement = document.getElementById("edit-User-modal");
const cancelButton = modalElement.querySelector(".edit-User-modal-cancel");

cancelButton.addEventListener("click", () => {
    const errorBox = modalElement.querySelector(".error-container-edit-user-modal");
    if (errorBox) {
        errorBox.textContent = "";         
        errorBox.style.display = "none";    
    }
});

});

}
userEditModal();

}



//--------------profilePage-----------------//

//-------------friendPage
const friendPageSection =()=>{

//------------------load friends page
  document.addEventListener('DOMContentLoaded',async()=>{
const response = await fetch("/api/user/getAllFriends",{
  method:"GET",
  credentials:"include",
   headers:{
      "Content-Type": "application/json"
    }
});

const result = await response.json();

if(response.ok){

  //Adds friendPage structure
const friendPageStructure = `
     <div class=" bg-white rounded-3 shadow-sm mb-2" style="width: 100%; height:3rem; padding: 0.5rem;">
    <div class="d-flex align-items-center justify-content-center w-100"
         style=" border-radius: 0.5rem; ">
      <img src="../assets/icon/friends.svg" alt="friends" style="height: 1.6rem;" class="active-friends-icon me-2">    
      <h5 class="mb-0 me-2" style="font-size: 1rem;">Friends</h5>
      <div class=" d-flex justify-content-center align-items-center" 
           style="width: 22px; height: 22px; border: 1px solid #000; border-radius: 50%; font-size: medium;">
           ${result.currentUser.friend.friendList.length}
      </div>  
    </div>
  </div>

      <div class="d-flex" style="height: 100%;">
      <div class="inside-left" style="width: 20%; height: 100%; " ></div>
      <div class="inside-middle" style="width: 60%; height: 100%;">

<div>
      <div class="bg-white rounded-3 shadow-sm p-4 my-2  d-flex align-items-center justify-content-center" style="height: 2.6rem; max-height:auto; width: 100%; ">
          <img src="../assets/icon/friendRequest.svg" alt="Members" style="width:1.5rem" class="active-friends-icon me-4">
    <h6 class=" pt-1 ms-2"><b>Friend Request</b></h6>
     <div class=" d-flex justify-content-center align-items-center ms-2" 
           style="width: 22px; height: 22px; border: 1px solid #000; border-radius: 50%; font-size: medium;">
           ${result.currentUser.friend.requestReceived.length}
      </div>

    <div class=" ms-auto userTypeButton">
    <button class="btn friendRequestListButton" type="button" data-bs-toggle="collapse" data-bs-target="#friendListCollapse" aria-expanded="false" aria-controls="friendListCollapse" >
    <img src="../assets/icon/caret-down.svg" alt="Members" style="width:0.8rem">
    </button>
    </div>
    </div>

    <div class="collapse" id="friendListCollapse" >
 <div class="friendRequestList mb-2 d-flex flex-column"style="height:auto;">

    </div>
</div>
    
</div>
    </div>

      <div class="inside-right" style="width: 20%; height: 100%;"></div>
      
      </div>`;
      const container = document.createElement("div");
      container.innerHTML=friendPageStructure;
      document.querySelector(".main-side").append(container);


      //adding friends to friendList
      const friendList = new Set(result.currentUser.friend.friendList);
      const friends = result.users.filter((user)=> friendList.has(user._id));

      //if no friends send poster message no friend
if (friendList.size === 0){
        
        const noFriendHTML = ` <div class="post bg-white rounded-3 shadow-sm p-2 mb-2 d-flex flex-column " style=" width: 100%;height: auto;" >
      <div class="dashed-box" style=" border: 2px dashed #ccc;
    border-radius: 0.5rem;
    padding: 2rem">
  <div class="post-top bg-white d-flex justify-content-center align-items-center flex-column" style="height: 20rem;">
     <img src="../assets/icon/feather.svg" class="navbar-logo__icon mb-4" style="width: 32px;" alt="koku logo">
      
     <h6 class="text-center">No friends yet. Send a request and make your first connection! 🌟</h6>
     
    </div>
    </div>
  </div>`;

  const noFriendContainer = document.createElement('div');
  noFriendContainer.innerHTML=noFriendHTML;
  document.querySelector('.inside-middle').append(noFriendContainer); 


      }

      //adds freinds to friendList
      friends.forEach((friend)=>{

         const friendStructure = `

    <div class=" userStructure bg-white rounded-3 shadow-sm p-4 mb-2 d-flex align-items-center justify-content-center" style="height: 3.6rem; width: 100%;">
    <div class="userAccount__dp mx-1">
    
    </div>
    <h6 class=" pt-1 ms-2">${friend.username}</h6>
    <div class=" ms-auto userTypeButton">
    <button class="btn btn-secondary p-0 userButton unFriendButton " data-otherUserId=${friend._id}><small class="px-1">Unfriend</small></button>
    </div>
    </div>`;

      const userContainer = document.createElement("div");
      userContainer.innerHTML=friendStructure;

      const dpContainer = userContainer.querySelector(".userAccount__dp"); 
       //if user has profile picture
if (friend.profilepicture) {
const img = document.createElement('img'); 
img.src = friend.profilepicture;
img.alt = "Profile Picture";
dpContainer.appendChild(img);

    }else{
  //if user doesnt have profile picture
  const firstTwoLetter = capitalizeFirstTwoCharacter(friend.username);
  dpContainer.textContent = firstTwoLetter;
  dpContainer.style.display = "flex";
  dpContainer.style.justifyContent= "center";
  dpContainer.style.alignItems = "center";
  dpContainer.style.fontWeight = "bold";

  dp_background_setter(friend.username,dpContainer);
    }

      document.querySelector(".inside-middle").append(userContainer);

      });
}

  });
//-------------loads friendRequest
 //------------adds friendRequest to friedRequestList container (collapse)
  document.addEventListener("click",async function (event) {
    const friendListButton = event.target.closest(".friendRequestListButton");

    if(friendListButton){
      
      const response = await fetch("/api/user/getAllFriends",{
  method:"GET",
  credentials:"include",
   headers:{
      "Content-Type": "application/json"
    }
});

const result = await response.json();

if(response.ok){
 //adding friends to friendRequestList
      const friendRequestList = new Set(result.currentUser.friend.requestReceived);
      const friends = result.users.filter((user)=> friendRequestList.has(user._id));
      document.querySelector(".friendRequestList").innerHTML="";

      friends.forEach((friend)=>{

         const friendStructure = `

    <div class=" userStructure bg-white rounded-3 shadow-sm p-4 mb-2 d-flex align-items-center justify-content-center border border-secondary" style="height: 3.6rem; width: 100%;">
    <div class="userAccount__dp mx-1">
    
    </div>
    <h6 class=" pt-1 ms-2">${friend.username}</h6>
    <div class=" ms-auto userTypeButton d-flex">
<button class="btn btn-primary p-0 userButton frndConfirmButton ms-1" data-otherUserId="${friend._id}"><small class="px-0 m-1">Confirm</small></button>
<div class=" ms-2"><button class="btn btn-secondary p-0 userButton frndDeleteButton ms-1" data-otherUserId="${friend._id}"><small class="px-1 m-1">Delete</small></button></div>
    </div>
    </div>`;

      const userContainer = document.createElement("div");
      userContainer.innerHTML=friendStructure;

      const dpContainer = userContainer.querySelector(".userAccount__dp"); 
       //if user has profile picture
if (friend.profilepicture) {
const img = document.createElement('img'); 
img.src = friend.profilepicture;
img.alt = "Profile Picture";
dpContainer.appendChild(img);

    }else{
  //if user doesnt have profile picture
  const firstTwoLetter = capitalizeFirstTwoCharacter(friend.username);
  dpContainer.textContent = firstTwoLetter;
  dpContainer.style.display = "flex";
  dpContainer.style.justifyContent= "center";
  dpContainer.style.alignItems = "center";
  dpContainer.style.fontWeight = "bold";

  dp_background_setter(friend.username,dpContainer);
    }

      document.querySelector(".friendRequestList").append(userContainer);
      });

    }
  }
  })

}
//-------------friendPage-------------------//

//--------------membersPage
const memebersPageSection =()=>{

  document.addEventListener('DOMContentLoaded',async()=>{
const response = await fetch("/api/user/getAllUsers",{
  method:"GET",
  credentials:"include",
   headers:{
      "Content-Type": "application/json"
    }
});

const result = await response.json();

const membersPageStructure = `
      <div class=" bg-white rounded-3 shadow-sm mb-2" style="width: 100%; height:3rem; padding: 0.5rem;">
    <div class="d-flex align-items-center justify-content-center w-100"
         style=" border-radius: 0.5rem; ">    
      <img src="../assets/icon/members.svg" alt="Members" style="width: 1.6rem;" class="active-friends-icon me-2">
      <h5 class="mb-0 me-2" style="font-size: 1rem;">Members</h5>
      <div class=" d-flex justify-content-center align-items-center" 
           style="width: 22px; height: 22px; border: 1px solid #000; border-radius: 50%; font-size: medium;">
        ${result.users.length -1}
      </div>  
    </div>
  </div>

      <div class="d-flex" style="height: 100%;">
      <div class="inside-left" style="width: 20%; height: 100%; " ></div>
      <div class="inside-middle" style="width: 60%; height: 100%;">
      </div>
      <div class="inside-right" style="width: 20%; height: 100%;"></div>
      
      </div>`;
      const container = document.createElement("div");
      container.innerHTML=membersPageStructure;
      document.querySelector(".main-side").append(container);

result.users.forEach((user)=>{
  
  if(user._id === result.userId){
    return;
  }

  const userStructure = `

    <div class=" userStructure bg-white rounded-3 shadow-sm p-4 mb-2 d-flex align-items-center justify-content-center" style="height: 3.6rem; width: 100%;">
    <div class="userAccount__dp mx-1">
    
    </div>
    <h6 class=" pt-1 ms-2">${user.username}</h6>
    <div class=" ms-auto userTypeButton">
    </div>
    </div>`;

      const userContainer = document.createElement("div");
      userContainer.innerHTML=userStructure;


      const dpContainer = userContainer.querySelector(".userAccount__dp"); 
       //if user has profile picture
if (user.profilepicture) {
const img = document.createElement('img'); 
img.src = user.profilepicture;
img.alt = "Profile Picture";
dpContainer.appendChild(img);

    }else{
  //if user doesnt have profile picture
  const firstTwoLetter = capitalizeFirstTwoCharacter(user.username);
  dpContainer.textContent = firstTwoLetter;
  dpContainer.style.display = "flex";
  dpContainer.style.justifyContent= "center";
  dpContainer.style.alignItems = "center";
  dpContainer.style.fontWeight = "bold";

  dp_background_setter(user.username,dpContainer);
    }

      //condition for adding what button to add for the user
      if(user.friend.friendList.some(user=>user === result.userId))   {  //checks user is in friendList
        const unFriendStructure = `<button class="btn btn-secondary p-0 userButton unFriendButton "><small class="px-1">Unfriend</small></button>`;
        const unFriendButton = document.createElement("div");
        unFriendButton.innerHTML=unFriendStructure;
        userContainer.querySelector('.userTypeButton').append(unFriendButton);
        userContainer.querySelector(".unFriendButton").setAttribute("data-otherUserId",user._id);

      }else if(user.friend.requestReceived.some(user=>user === result.userId)){   //checks user is in requestReceived

        const requestSentStructure = `<button class="btn btn-outline-primary p-0 userButton requestSentButton "><small class="px-1">Request sent</small></button>`;
        const requestSentButton = document.createElement("div");
        requestSentButton.innerHTML=requestSentStructure;
        userContainer.querySelector('.userTypeButton').append(requestSentButton);
        userContainer.querySelector(".requestSentButton").setAttribute("data-otherUserId",user._id);

      }else if(user.friend.requestSent.some(user =>user === result.userId)){    //checks user is in requestSent
        
        //confirm button
        const confirmStructure = `<button class="btn btn-primary p-0 userButton frndConfirmButton ms-1 "><small class="px-0 m-1">Confirm</small></button>`;
        const confirmButton = document.createElement("div");
        confirmButton.innerHTML=confirmStructure;
        userContainer.querySelector('.userTypeButton').append(confirmButton);
        userContainer.querySelector(".frndConfirmButton").setAttribute("data-otherUserId",user._id);

        //delete button
        const deleteStructure = `<div class=" ms-2"><button class="btn btn-secondary p-0 userButton frndDeleteButton ms-1"><small class="px-1 m-1">Delete</small></button></div>`;
        const deleteButton = document.createElement("div");
        deleteButton.innerHTML=deleteStructure;
        userContainer.querySelector('.userStructure').append(deleteButton);
        userContainer.querySelector(".frndDeleteButton").setAttribute("data-otherUserId",user._id);
      }else{
        const addFriendStructure = `<button class="btn btn-primary p-0 userButton addFriendButton"><small class="px-1">Add friend</small></button>`;
        const addFriendButton = document.createElement("div");
        addFriendButton.innerHTML=addFriendStructure;
        userContainer.querySelector('.userTypeButton').append(addFriendButton);
        userContainer.querySelector(".addFriendButton").setAttribute("data-otherUserId",user._id);

      }


      // userButton is a general tag for all user button to add userId
    const userButtons = userContainer.querySelectorAll(".userButton");
    userButtons.forEach(button => {
    button.setAttribute("data-otherUserId", user._id);
    });

      //finaly after checking the condition then adding to the container.
  document.querySelector(".inside-middle").append(userContainer);

});

  });
}

//----------------------!!!!!!!!!!!!!!! PageSection !!!!!!!!!!!!!!!!!-------------------//

//----------------------!!!!!!!!!!!!!!   LoadAllPostSection
// fetching all the posted post and then adding them to main container..
const loadAllPostSection = (user, posts)=>{
  
      posts.reverse().forEach(element => {

        let allPostsHTML = "";

       allPostsHTML += `<div class="post background-white rounded-3 shadow-sm p-2 mb-2 d-flex flex-column " style=" width: 100%;height: auto;" >
  <div class="post-top background-white d-flex align-items-center no-border" style="height: 3.8rem;">
    <div class="left d-flex mx-1">
<div class="posting__dp"><img src="" alt="Profile Picture"></div>
    <div class="post-user">
      <h6 class="pt-1 ps-2 mb-0 font-color-black">${element.postObj.user.username}</h6>
      <small class="ps-2 font-color-black">${element.postObj.posttime}</small>
    </div>
    </div>
    <div class="middle ms-4 mt-1 btnTypeFriend">

    </div>
    <div class="end ms-auto me-4 dropdown post-dropdown">

    </div>
  </div>
   <div class="post-caption background-white  mb-1 px-2 text-container"  >
   ${element.postObj.caption}
  </div>
   <div class="showmore-container">

    </div>
  <div class="post-image-container bg-info-subtle d-inline-block">
    <img src="${element.postObj.post}"  alt="postImage" class="post-image">
  </div>
  <hr class="my-2 border border-dark">
  <div class="post-botton d-flex background-white justify-content-between" style="width: 100%; height: 2.2rem;">
   <div class="post-like d-flex align-items-center ms-3">
    <button class="like-button btn btn-white px-2 py-0 post-like-button"><div class="mx-1 d-flex align-items-center">
      <img style="width: 1.2rem;" class="mx-1 py-0 post-like-icon" alt="like">
        <p class="position-relative" style="top: 6px; " class="my-0 no-fill font-color-black">Like</p>
        <div class="count-circle post-like-count collapse-count" >${element.postObj.likes.length}</div>
    </div>
    </button>    
    </div>
 <div class="post-comment d-flex align-items-center mx-3">
    <button class="comment-button btn btn-white px-2 py-0 ">
    <div class="post-comment-icon mx-1 d-flex align-items-center">
      <img src="../assets/icon/post-comment.svg" style="width: 1.2rem;" class="mx-1 py-0" alt="comment">
        <p class="position-relative" style="top: 6px; " class="my-0 font-color-black">Comment</p>
        <div class="count-circle comment-length-count collapse-count" >${element.postObj.comment.length}</div>
              <img src="../assets/icon/caret-down.svg" style="width: .8rem;" class="mx-1 py-0" alt="comment">
    </div>
    </button>    
    </div> 
   
</div>
<div class="collapse collapseComment">
<div class="comment-post d-flex px-1 my-2" style="width: 100%;" >
    <textarea name="caption" rows="1" class="post-textarea form-control me-1 comment-input" style="width: 83%;" placeholder="Write a comment..."></textarea>
    <button type="submit" class="btn btn-primary align-self-end comment-post-button"style="height:2.4rem">Comment</button>
</div>
<div class="comment-container"></div>
</div>
</div>`

const postHTML = document.createElement("div");
postHTML.innerHTML= allPostsHTML;


// adding all the post to main-side container
document.querySelector('.main-side').append(postHTML);  


const friendContainer = postHTML.querySelector('.btnTypeFriend');

if (friendContainer) {
  if(user._id === element.postObj.user._id){
    //dont do anything anything if the post belong to the current user.
}else if(user.friend.friendList.some((user)=>user === element.postObj.user._id)){
const unFriendStructure = `<button class="btn btn-outline-secondary p-0 unFriendButton" data-otherUserId="${element.postObj.user._id}" disabled><small class="px-1">Unfriend</small></button>`;
const unFriend = document.createElement('div');
unFriend.innerHTML= unFriendStructure;
friendContainer.append(unFriend);
}else if(user.friend.requestSent.some((user)=>user === element.postObj.user._id)){
const requestSentStructure = `<button class="btn btn-outline-info p-0 requestSentButton" data-otherUserId="${element.postObj.user._id}" disabled><small class="px-1">Request sent</small></button>`;
const requestSent = document.createElement('div');
requestSent.innerHTML= requestSentStructure;
friendContainer.append(requestSent);
}else if(user.friend.requestReceived.some((user)=>user === element.postObj.user._id)){
const requestReceivedStructure = `<button class="btn btn-outline-success p-0" disabled><small class="px-1">Request received</small></button>`;
const requestReceived = document.createElement('div');
requestReceived.innerHTML= requestReceivedStructure;
friendContainer.append(requestReceived);
}else{
const addFriendStructure = `<button class="btn btn-outline-primary p-0 addFriendButton" data-postId="${element.postObj._id}" data-otherUserId="${element.postObj.user._id}" disabled><small class="px-1">Add friend</small></button>`;
const addFriend = document.createElement('div');
addFriend.innerHTML= addFriendStructure;
friendContainer.append(addFriend);
}
}

// adding the postId to the commentPost main class
const commentPost = postHTML.querySelector(".post");
if(commentPost){
        commentPost.setAttribute("data-post-id",element.postObj._id);
        commentPost.setAttribute("data-comment-count",element.postObj.comment.length);
}

// adding the postId to the commentPost button
const commentPostButton = postHTML.querySelector(".comment-post-button");
    if(commentPostButton){
      commentPostButton.setAttribute("data-post-id",element.postObj._id);
      commentPostButton.setAttribute("data-user-id",element.postObj.user._id);


    }
const commentButton = postHTML.querySelector(".comment-button");
    if(commentButton){
        commentButton.setAttribute("data-post-id",element.postObj._id);
        commentButton.setAttribute("data-user-id",element.postObj.user._id);

      }

      const commentTextArea = postHTML.querySelector(".comment-input");
   if(commentTextArea){
      commentTextArea.setAttribute("data-post-id",element.postObj._id);
      commentButton.setAttribute("data-user-id",element.postObj.user._id);

      }

// controlls the overflow and adds showmore for the post caption
function checkOverflow() {

    const captionElement = postHTML.querySelector(".post-caption");


//getting the max-width and max-height value ..
  let maxWidthStr = window.getComputedStyle(captionElement).getPropertyValue("max-width");
  let maxHeightStr = window.getComputedStyle(captionElement).getPropertyValue("max-height");

// here it removes the px from the value and saves only the value and it returns none if the value is none or percentage
  const parsePx = (str) => {//important to know
    if (!str || str === "none"){
     return null;
    } 
    if (str.endsWith("px")){
      return parseFloat(str);
    }
    return null; 
  };

  const maxWidth = parsePx(maxWidthStr);
  const maxHeight = parsePx(maxHeightStr);

  // Compare content size (scroll) with max-width and max-height if there,
  // if scroll doesnt exsist use clientWidth/clientHeight
  // Use clientWidth/clientHeight as fallback if maxWidth/maxHeight is null
  const visibleWidth = maxWidth || captionElement.clientWidth;
  const visibleHeight = maxHeight || captionElement.clientHeight;

  const isHorizontallyOverflowing = captionElement.scrollWidth > visibleWidth;
  const isVerticallyOverflowing = captionElement.scrollHeight > visibleHeight;

 if (isHorizontallyOverflowing || isVerticallyOverflowing) {
  const showMore = `<span class="show-more show-more-toggleButton">... Show more</span>`;
  postHTML.querySelector(".showmore-container").insertAdjacentHTML("beforeend", showMore);
}

}

checkOverflow();


// adds the dropdown only to the owner of the post who is logged In 
const dropdown = (postHTML, element) => {
  let dropdownOption = "";
  if (element.postObj.user._id === element.userId) {
    dropdownOption += `
      <button class="btn dropdown-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="../assets/icon/three-dots-horizontal.svg" style="width: 1.4rem;" alt="horizontal-options">
      </button>
      <ul class="dropdown-menu dropdown-menu-lg-end">
        <li><button class="dropdown-item delete-post" type="button">Delete post</button></li>
        <li><button class="dropdown-item edit-post" type="button" data-bs-toggle="modal" data-bs-target=".editPostModal">Edit post</button></li>
        </ul>
    `;

    // Using insertAdjacentHTML to render the dropdwon html
    const dropdownContainer = postHTML.querySelector(".post-dropdown");
    if (dropdownContainer) {//important to know
      dropdownContainer.insertAdjacentHTML('beforeend', dropdownOption);
    }

    // Add postId to the edit and delete post buttons
    const editPostElement = postHTML.querySelector('.edit-post');
    if (editPostElement) {//important to know
      editPostElement.setAttribute('data-post-id', element.postObj._id);
    }
    const deletePostElement = postHTML.querySelector('.delete-post');
    if (deletePostElement) {
      deletePostElement.setAttribute('data-post-id', element.postObj._id);
    }
    
  }
};
dropdown(postHTML, element);

 //----------------------Show More------------
const showMore = (postHTML) => {
  const showMoreContainer = postHTML.querySelector('.showmore-container');
  if (!showMoreContainer) return;

  showMoreContainer.addEventListener('click', function(event) {
   //important to know
    if (event.target.classList.contains('show-more')) {
      const captionContainer = postHTML.querySelector('.text-container');
      if (captionContainer) {
        captionContainer.style.maxHeight = 'none';
        captionContainer.style.overflow = 'visible';
      }
      event.target.remove();

      // Add Show Less button
      const showLess = document.createElement('span');
      showLess.className = 'show-less show-less-toggleButton';
      showLess.textContent = '... Show less';
      showMoreContainer.append(showLess);
    }

    // Show Less
    if (event.target.classList.contains('show-less')) {
      const captionContainer = postHTML.querySelector('.text-container');
      if (captionContainer) {
        captionContainer.style.maxHeight = '38.4px';
        captionContainer.style.overflow = 'hidden';
      }
      event.target.remove();//important to know

      // Add Show More button
      const showMore = document.createElement('span');
      showMore.className = 'show-more show-more-toggleButton';
      showMore.textContent = '... Show more';
      showMoreContainer.append(showMore);
    }
  });
};
showMore (postHTML);
 //----------------------Show More------------------//

//-----------------------post likes

// addding postId to the post button
const postLike =(postHTML,element)=>{
 const postLikeButton = postHTML.querySelector('.post-like-button');
 const postLikeIcon = postLikeButton.querySelector(".post-like-icon");
    if (postLikeButton) {
      postLikeButton.setAttribute('data-post-id', element.postObj._id);
    
//checking if user already liked the post or not if already liked used fill heart or if not add outline heart
    if(element.postObj.likes.some(like => like._id === element.userId)){
    postLikeIcon.src="../assets/icon/heart-fill.svg";
    postLikeIcon.classList.add("post-like-active");    
  } else {
     postLikeIcon.src="../assets/icon/heart.svg";
    postLikeIcon.classList.remove('post-like-active');
  }
  }
}
postLike(postHTML,element);

//-----------------------post likes-------------------//

// if profile picture exsist for the user adding the profile picture to the post if no profile picture then adding first two letter in capital with color

const profilePicture = ()=>{

  if (element.postObj.user.profilepicture) {

    const img = document.createElement("img");
    img.src = element.postObj.user.profilepicture;
    img.alt = "Profile Picture";

    const dpContainer = postHTML.querySelector('.posting__dp');
    dpContainer.innerHTML="";
    dpContainer.append(img);

     return;

    } else{

      // removes exsisting img form dpContainer
      const dpContainer = postHTML.querySelector('.posting__dp');
      const img = dpContainer.querySelector('img')
      if(img){
        img.remove();
      }

      const firstTwoLetter = capitalizeFirstTwoCharacter(element.postObj.user.username);
  
  dpContainer.textContent = firstTwoLetter;
  dpContainer.style.display = "flex";
  dpContainer.style.justifyContent= "center";
  dpContainer.style.alignItems = "center";
  dpContainer.style.fontWeight = "bold";
  dpContainer.style.color = "black";

  dp_background_setter(element.postObj.user.username,dpContainer);

    }
  }
  profilePicture();
      });
   
}
//----------------------!!!!!!!!!!!!!!   LoadAllPostSection  !!!!!!!!!!!!!!!!!!!----------------------------//

//---------------!!!!!!!!!!!!!!!!!!!!!!!  dropdown section 

const dropdownSection =()=>{
//-------subIssue-dropdown closing issue
// To fix the issue with on clicking outside the switch for display automaticalty closes the dropdown
document.addEventListener('DOMContentLoaded', () => {
  const switchContainer = document.querySelector('#switch-container');
  switchContainer.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});
//-------subIssue-dropdown closing issue---------------//

//------subIssue-onClicking collapse prevent closing dropdown
// To fix the issue when clicking the button of collapse it automaticaly closes wihthout displaying the dropdown ,
//this will make sure when clicking the dropdown-button if it collapse it will make sure not to close (dropdown)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function(event) {
      if (this.getAttribute('data-bs-toggle') === 'collapse') {
        event.stopPropagation();
      }
    });
  });
});
//------subIssue-onClicking collapse prevent closing dropdown---------------//


//-------------profilePicturePreview
// on selectig the file it immediatly creates a image and add the image to previewContainer

const fileInput = document.querySelector(".fileUpload");
const previewContainer = document.querySelector(".previewContainer");

fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {//important to know
            const img = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
            previewContainer.innerHTML = '';                   
            previewContainer.innerHTML = img;                  
            previewContainer.style.display = 'block'; 
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.style.display = 'none';
        previewContainer.innerHTML = '';
    }
});
//-------------profilePicturePreview-----------------//



//----------profilePictureModal cancel button
// on clicking the cancel button it changes display to none and removes the image from container.

const cancelButton =document.querySelector("#profile-upload-cancel");

cancelButton.addEventListener("click",function(){
  fileInput.value = "";
  previewContainer.style.display = 'none';
  previewContainer.innerHTML = '';
});
//----------profilePictureModal cancel button----------------//

//----------------------uploading profilepicture
const uploadButton = document.querySelector('#profile-upload-button');
const uploadInput = document.querySelector('#fileUpload');

uploadButton.addEventListener('click', async (event) => {
  
  event.preventDefault();

  const file = uploadInput.files[0]; 
  if (!file) {
    return;
  }

  // using formdata to send file
  const formData = new FormData(); 
  formData.append("profileImage", file);

  const response = await fetch("/api/user/profilepicture", {
    method: "POST",
     credentials: "include",
     body:formData,
  });

  if(response.ok){

   // Close the modal
   const modal = document.querySelector('#upload-profile-picture-modal'); 
   const modalInstance = bootstrap.Modal.getInstance(modal);
   if (modalInstance) {
   modalInstance.hide();
   }
    // Clear the input and preview
    uploadInput.value="";
    const previewContainer = document.querySelector(".previewContainer");
    previewContainer.innerHTML="";
    previewContainer.style.display="none";
 
    //reload page
    window.location.reload();
  }
  

});
//----------------------uploading profilepicture------------------//

//------------- delete profilepicture
  document.addEventListener("DOMContentLoaded",async()=>{
  const deleteButton = document.querySelector('#profile-picture-remove');

  if(deleteButton){
  deleteButton.addEventListener("click",async(event)=>{

    event.preventDefault();

     const response = await fetch("/api/user/removeprofilepicture", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (response.ok) {
      const navbarUserDp = document.getElementById('navbar-user-dp');
      if(navbarUserDp){
       navbarUserDp.innerHTML="";
      }
      const postingDp = document.getElementById('posting-dp');
      if(postingDp){
      postingDp.innerHTML="";
      }
      
      window.location.reload();
     }    
     });
    }
     });
//------------- delete profilepicture---------------//

//---------------add display mode
const displayModeButton = document.querySelector("#displayMode");
displayModeButton.addEventListener('change', async (event) => {
  const mode = event.target.checked ? 'dark' : 'light';

  const response = await fetch('/api/user/displayMode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ mode })
  });

  // const result = await response.json();

  if(response.ok){
    window.location.reload();
  }
});

//---------------add display mode

//-----------------add account Info (friends count and members count)
document.addEventListener("DOMContentLoaded",async function(event){
  
  const response = await fetch("/api/user/userCount",{
    method:"GET",
    credentials:"include",
    headers:{
      "Content-Type":"application/json"
    }
  });

  const result = await response.json();

  if(response.ok){

  const friendListCountContainer = document.querySelector(".friendsCount");
  const membersListCountContainer = document.querySelector(".membersCount");

if(friendListCountContainer && membersListCountContainer){

  friendListCountContainer.textContent=result.friendsCount;
  membersListCountContainer.textContent=result.membersCount-1;

}
  }
});
//-----------------add account Info------------------//
//-------------logout signOut
const logoutButton = document.querySelector('#dropdown-logout');
logoutButton.addEventListener("click",async(event)=>{

    event.preventDefault();

        const response = await fetch("/api/user/logout", {
            method: "POST",
            credentials: "include",
            headers:{
              "Content-Type":"application/json"
            }
        });

        const result = await response.json();
        if (response.ok) {

          if(result){
             window.location.href = '/api/user/signIn'; 
            sessionStorage.setItem('activeIcon', 'home');
          }
        }

});
//-------------logout-----------------//

//------------logoutAll

const logoutAllButton = document.querySelector("#dropdown-logout-All");
logoutAllButton.addEventListener("click",async(event)=>{
  event.preventDefault();

  const response = await fetch("/api/user/logoutAll",{
    method:"POST",
    credentials:"include",
    headers:{
      "Content-Type":"application/json"
    }
  });

  const result = await response.json();
  if(response.ok){

    if(result){
 
     window.location.href = '/api/user/signIn'; 
            sessionStorage.setItem('activeIcon', 'home');
    }
            
  }
})
//------------logoutAll----------------//
}
dropdownSection();

//---------------!!!!!!!!!!!!!!!!!!!!!!!   dropdown section  !!!!!!!!!!!!!!!!!!!!--------------// 

//---------------!!!!!!!!!!!!!!!!!!!!!!!  navbar Section

const navbarSection = ()=>{

  //---------------navigation bar (checked)
  // all buttons and icon in the main navbar
const homeButton = document.querySelector('#navbar-home');
const homeIcon = document.querySelector('#navbar-main-area__home');

const friendsButton = document.querySelector('#navbar-friends');
const friendsIcon = document.querySelector('#navbar-main-area__friends');

const membersButton = document.querySelector('#navbar-members');
const membersIcon = document.querySelector('#navbar-main-area__members');

const myAccountButton = document.querySelector('#navbar-my-account');
const myAccountIcon = document.querySelector('#navbar-main-area__my-account');

// remove active icon from button 
const deactivateAllIcons=()=> {
    homeIcon.classList.remove('.active-home-icon');
    friendsIcon.classList.remove('active-friends-icon');
    membersIcon.classList.remove('active-members-icon');
    myAccountIcon.classList.remove('active-my-account-icon');
}

// check if already any icon is active and then apply active
const ActivateIcon = ()=>{
    const activeIcon = sessionStorage.getItem('activeIcon');
    deactivateAllIcons();
    if (activeIcon === 'home') {
        homeIcon.classList.add('active-home-icon');
        homePageSection();
    } else if (activeIcon === 'friends') {
        friendsIcon.classList.add('active-friends-icon');
        friendPageSection();
    } else if (activeIcon === 'members') {
        membersIcon.classList.add('active-members-icon');
        memebersPageSection();
    } else if (activeIcon === 'myAccount') {
        myAccountIcon.classList.add('active-my-account-icon');
        profilePageSection();
    } else {
        // default home icon.
        homeIcon.classList.add('active-home-icon');
        homePageSection();
    }
}

// home
homeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    sessionStorage.setItem('activeIcon','home');
    ActivateIcon();
window.location.reload();
});

// friends
friendsButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    sessionStorage.setItem('activeIcon','friends');
    ActivateIcon();
   window.location.reload();

});

// members
membersButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    sessionStorage.setItem('activeIcon','members');
    ActivateIcon();
    window.location.reload();

});

// myaccount
myAccountButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    sessionStorage.setItem('activeIcon','myAccount');
    ActivateIcon();
    window.location.reload();

});

// this is when page reloaded it automaticaly check if icon is active and apply active to that icon 
ActivateIcon();

//---------------navigation bar-----------------//

//-------------------------username,dp,load for navbar and posting 
// adding  username,profile picture or first two letter with color then adding all to main navbar (NAVBAR NAME AND DP)
  document.addEventListener("DOMContentLoaded",async()=>{

    const response = await fetch("/api/user/userId", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });

    const result = await response.json();

    if (response.ok) {
      //adding username in navbar
    const userNameBox = document.querySelector('#navbar-user-name');
    userNameBox.textContent=result.username;      
    userNameBox.textContent = result.username;
    userNameBox.style.display = "flex";
    userNameBox.style.alignItems = "center";

    //displayMode toggle setting
    const displayModeInput = document.querySelector("#displayMode");
    if(result.displayMode === 'dark'){
    displayModeInput.checked = true;
    //setting the theme to dark mode
    document.documentElement.setAttribute('data-bs-theme', 'dark');
          localStorage.setItem('theme', 'dark');

    }else if(result.displayMode === 'light'){
    displayModeInput.checked = false;
     document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }else{
   displayModeInput.checked = false;
    document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');

    }

    const navbarDp = document.querySelector("#navbar-user-dp");
    const postingDp = document.querySelector("#posting-dp");

   if (result.profilepicture) {
//adds profile picture to navbar if it exsist
   const image = document.createElement("img");
   image.src = result.profilepicture;
   image.alt = "Profile Picture";

   const navbarDp = document.querySelector("#navbar-user-dp");
   const postingDp = document.querySelector("#posting-dp");

   if(navbarDp){
   navbarDp.innerHTML = "";
   navbarDp.appendChild(image.cloneNode(true));
   }

   if(postingDp){
   postingDp.innerHTML = "";
   postingDp.appendChild(image.cloneNode(true));
   }

    }else{
  
      //remove remove photo button from dropdown
   const removeButtonContainer = document.querySelector(".profile-picture-remove");
if (removeButtonContainer) {
  removeButtonContainer.style.display = "none";
}

    const firstTwoLetter = capitalizeFirstTwoCharacter(result.username);
    navbarDp.textContent=firstTwoLetter;
    

   navbarDp.style.display = "flex";
   navbarDp.style.justifyContent = "center";
   navbarDp.style.alignItems = "center";  
   navbarDp.style.fontWeight = "bold"; 
   navbarDp.style.color = "black";
   if(postingDp){
    postingDp.textContent=firstTwoLetter;
    postingDp.style.display="flex";
    postingDp.style.justifyContent="center";
    postingDp.style.alignItems="center";
    postingDp.style.fontWeight="bold";
    postingDp.style.color = "black";
   }

  // background setter function for setting first two letter
  dp_background_setter(result.username);
    }
  }    
});
//-------------------------username,dp,load for navbar and posting---------------------------------------//

}
navbarSection();

//---------------!!!!!!!!!!!!!!!!!!!!!!!    navbar Section   !!!!!!!!!!!!!!!!!!!--------------// 

//---------------!!!!!!!!!!!!!!!!!!!!!!!   post Section

const postSection =()=>{

// ----------delete post

document.addEventListener("click", async function (event) {
    const deletePost = event.target.closest(".delete-post");

if(deletePost){
  const postId = deletePost.getAttribute("data-post-id");
  const response = await fetch("/api/post/deletePost", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( {postId})
    });

    if(response.ok){
          window.location.reload();
    }
}
});

// ----------delete post-----------//

//---------- editPost caption preview caption input 

document.addEventListener("click",async function (event) {
  
  const editPostButton = event.target.closest(".edit-post");

  if(editPostButton){
  const postId = editPostButton.getAttribute('data-post-id');

  const response = await fetch("/api/post/fetchCaption", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ postId })
    });

    const result = await response.json();

    if(response.ok){

            const modal = document.querySelector('.editPostModal');
      // adds the exsisting caption for the post in caption input
            const caption = modal.querySelector('.edit-Post-textarea');
            caption.value = result.caption;
            caption.style.height = '6rem';

      //adds the postId to updatePost button
      const updateButton = modal.querySelector('.editPostUpdate');
      updateButton.setAttribute('data-post-id', postId);

    }
  }
})
//---------- editPost caption preview caption input-----------------//

//--------------- update caption 

document.addEventListener("click",async function (event) {
  
  const editPostButton = event.target.closest(".editPostUpdate");

  if(editPostButton){
  const postId = editPostButton.getAttribute('data-post-id');
  const captionInput = document.querySelector('.edit-Post-textarea').value;

  const response = await fetch("/api/post/editPost", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ postId ,captionInput})
    });

 if(response.ok){
    // Closing the modal after performing operation.
   const modal = document.querySelector("#edit-post-modal");
   const modalInstance = bootstrap.Modal.getInstance(modal);
   if (modalInstance) {
    modalInstance.hide();
     }

    window.location.reload();
    }
  }
})

//--------------- update caption------------------------//

//-------post like
// event delegation approach to like button (on clicking adds like and remove like) for POST
document.addEventListener("click", async function(event) {
  const postLikeButton = event.target.closest(".post-like-button");

  if (postLikeButton) {

    const productId = postLikeButton.getAttribute("data-post-id");

      const response = await fetch("/api/post/likePost", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId: productId })
      });

      const result = await response.json();

      const likeCount = postLikeButton.querySelector(".post-like-count");
      const postLikeIcon = postLikeButton.querySelector(".post-like-icon");

      if (postLikeIcon.classList.contains("post-like-active")) {
      postLikeIcon.src = "../assets/icon/heart.svg";
        postLikeIcon.classList.remove("post-like-active");
      } else {
         postLikeIcon.src = "../assets/icon/heart-fill.svg";
        postLikeIcon.classList.add("post-like-active");
      }

      likeCount.innerText = result.likes.length;
  }
});

//-------post like---------------//

//------------- friendbutton
//on event delegation approach friend button (on click changes to addfriend and unfriend)

document.addEventListener('click', function(event) {
  if (event.target.closest('.post-friend')) {
    event.preventDefault();

    const friendButton = event.target.closest('.post-friend');
    const friendButtonText = friendButton.querySelector('small');

    if (friendButton.classList.contains('btn-primary')) {
      friendButton.classList.remove('btn-primary');
      friendButton.classList.add('btn-secondary');
      friendButtonText.textContent = 'Unfriend';
    } else {
      friendButton.classList.remove('btn-secondary');
      friendButton.classList.add('btn-primary');
      friendButtonText.textContent = 'Add friend';
    }
  }
});

//------------- friendbutton------------//

//------minor error fixing

// cancel button error for bootstrap modal on clicking throwing due to focus so removing focus
document.querySelectorAll('.editPostCancel, .editPostClose,.editUserCancel').forEach(button => {
  button.addEventListener('click', function () {
    this.blur();
  });
});

//edit  posting modal increases the textarea height when scrolling is active..
document.addEventListener('input', function (event) {
  if (event.target.matches('.edit-Post-textarea')) {
    const textarea = event.target;
    textarea.style.height = 'auto'; // reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // adjust to content
  }
});

//------minor error fixing-------------//

}
postSection();

//---------------!!!!!!!!!!!!!!!!!!!!!!!   post Section  !!!!!!!!!!!!!!!!!!!!--------------//

// -----------------------------------!!!!!!!!!!!!!!!!!  Comment section

const commentSection =()=>{

//------------- setting collapse for comment section 

document.addEventListener("click", function(event) {
const commentButton = event.target.closest(".comment-button");

// manually toggle the collapse for commentSection
if (commentButton) {
// parent container post
const postContainer = commentButton.closest(".post");
const collapseElement = postContainer.querySelector(".collapseComment");

if (collapseElement) {   //important to know
// toggling collapse bootstrap manualy
const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement);
bsCollapse.toggle();
}
}
});
//------------- setting collapse for comment section--------------------//

      
// ---------------profilePicture function for comment function 

const profilePicture =(username,profilePicture,commentHTML)=>{
if (profilePicture) {
const img = document.createElement("img");
img.src = profilePicture;
img.alt = "Profile Picture";

const dpContainer = commentHTML.querySelector(".comment__dp");
dpContainer.innerHTML = "";
dpContainer.append(img);
} else {
const dpContainer = commentHTML.querySelector(".comment__dp");
const img = dpContainer.querySelector("img");
if (img) {
img.remove();
}

const firstTwoLetter = capitalizeFirstTwoCharacter(username);

dpContainer.textContent = firstTwoLetter;
dpContainer.style.display = "flex";
dpContainer.style.justifyContent = "center";
dpContainer.style.alignItems = "center";
dpContainer.style.fontWeight = "bold";

dp_background_setter(username, dpContainer);
}
}

// ---------------profilePicture function for comment section------------//

// ----------------------commentPost function 
const commentPost =async(postId,commentContainer,commentInput)=>{
const response = await fetch("/api/comment", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, commentInput }),
      });

if (response.ok) {
// fetchComment function
fetchComments(postId,commentContainer);
}
}
// ----------------------commentPost function-------------------------------//

// -------------------------comment delete function 

const deleteComment = async(commentDropDownHTML,commentContainer,postId)=>{

commentDropDownHTML.addEventListener("click",async function (event) {
event.preventDefault();
const deleteButton = event.target.closest(".comment-delete-action");

if(deleteButton){
const postContainer = deleteButton.closest(".post");
const commentCountNumber = postContainer.getAttribute("data-comment-count");
let commentCount = postContainer.querySelector(".comment-length-count");

const commentId = deleteButton.getAttribute("data-comment-id");
const queryParams = new URLSearchParams({ commentId });
const response = await fetch(`/api/comment?${queryParams.toString()}`,{
      method:"DELETE",
      credentials:"include",
      headers:{
              "Content-Type": "application/json"
            }
      });

if(response.ok){
// clearing the exsisting comment and fetching comments again.
commentContainer.innerHTML="";
// fetchComment function
fetchComments(postId,commentContainer);
 
// updating the comment count (reducing the comment count number as deleting here..)
let currentCount = parseInt(commentCountNumber) ;
commentCount.innerText = currentCount - 1;
postContainer.setAttribute("data-comment-count", (currentCount - 1).toString());

}
}
});
}
// -------------------------comment delete function-------------------------//

//----------------------------- Comment like function
// event delegation approach to like button (on clicking adds like and remove like) for COMMENT......//
const likeComment = async(commentId,commentHTML)=>{
commentHTML.addEventListener("click",async function(event){
event.preventDefault();
const commentLikeButton = event.target.closest(".comment-like");

if(commentLikeButton){
const commentLikeIcon = commentLikeButton.querySelector('.comment-like-icon');

const response = await fetch("/api/comment/like",{
    method:"POST",
    credentials:"include",
    headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({commentId}),
})

const result = await response.json();

if(response.ok){

  if (commentLikeIcon.classList.contains('comment-like-active')) {
    commentLikeIcon.setAttribute('src', '../assets/icon/heart.svg');
     commentLikeIcon.classList.remove('comment-like-active')
  } else {
    commentLikeIcon.setAttribute('src', '../assets/icon/heart-fill.svg');
    commentLikeIcon.classList.add('comment-like-active');
  }
  let commentLikeCount = commentLikeButton.querySelector(".comment-like-count");
  commentLikeCount.textContent = result.likes.length;
}
}
});
}
//----------------------------- comment like function-----------------------------------//

// ---------------------------------- fetch comment structure function 
const fetchCommentStructure=(comment,result,commentContainer,postId)=>{
let commentStructure = "";
commentStructure += `<div class="each-comment p-0 mx-2 mb-2 mx-2 rounded-3" style="background-color:#e9ecef">
        <div class="top-comment-section d-flex">
          <div class="comment__dp d-flex align-self-center">
            <img class="comment-profile-picture" alt="" style="width: 100%; height:auto; max-height:100%; object-fit:cover">
          </div>
          <div class="user-time d-flex flex-column p-0">
            <div class="p-0">${comment.user.username}</div>
            <div style="font-size: .7rem;" class="p-0 ">${comment.commenttime}</div>
          </div>
          <div class="btn-group dropstart dropdown-container ms-auto me-2 ">
          </div>
        </div>
        <div class="mid-comment-sectin px-4" style="font-size: .9rem; line-height:1.4;">
          ${comment.comment}
        </div>
        <div class="end-comment-section">
        </div>
        <button type="submit" class="comment-like d-flex pe-4 pb-1 ms-auto btn btn-white">
          <img  style="width: 1rem;" class="comment-like-icon mx-1 py-0" alt="like">
          <div class="comment-like-count" style="font-size: .9rem;">${comment.likes.length}</div>
        </button>
      </div>`;

  const commentHTML = document.createElement("div");
  commentHTML.innerHTML = commentStructure;

  // profile picture function
  profilePicture(comment.user.username, comment.user.profilepicture, commentHTML);
  commentContainer.append(commentHTML);

  //check user already liked the comment based on that adds like to comment//
  let commentLikeIcon = commentHTML.querySelector(".comment-like-icon");
  if (comment.likes.some(like => like === result.user)) {
  commentLikeIcon.setAttribute('src', '../assets/icon/heart-fill.svg');
  commentLikeIcon.classList.add('comment-like-active');
  }
  else{
  commentLikeIcon.classList.remove('comment-like-active');
  commentLikeIcon.setAttribute('src', '../assets/icon/heart.svg');
  }

  const commentDropDown = `<button class="btn comment-delete " type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="../assets/icon/three-dots-horizontal.svg" style="width: 1rem;" alt="horizontal-options">
      </button>
      <ul class="dropdown-menu " style="width: auto; min-width:7rem; height:auto; height: auto; max-height:3rem;">
        <li><button class="dropdown-item comment-delete-action" type="button">Delete</button></li>
      </ul>`;

  const commentDropDownHTML = document.createElement("div");
  commentDropDownHTML.innerHTML = commentDropDown;

  //adds dropdown only to the user who posted the comment//
  if (comment.user._id === result.user) {
  const dropdown = commentHTML.querySelector(".dropdown-container");
  dropdown.append(commentDropDownHTML); 
  }

  // delete operation and function//
  const commentDelete = commentDropDownHTML.querySelector(".comment-delete-action");
  commentDelete.setAttribute("data-comment-id",comment._id);

  // deleteComment function 
  deleteComment(commentDropDownHTML,commentContainer,postId);

  // like function
  likeComment(comment._id,commentHTML,commentContainer);
  }

  // ---------------------------------- fetch comment structure function--------------------------------------//

  // -------------------------------------add showmore button function for comment contaier
  const addShowmoreToComment=(commentContainer)=>{
  const showMoreHTML = `<button type="submit" class="btn btn-light show-more show-more-comment-toggleButton p-0 mx-2"><img src="../assets/icon/caret-down.svg" alt="dropdown"><small> More comments...</small></button>`;
  const showMore = document.createElement('div');
  showMore.innerHTML = showMoreHTML;
  commentContainer.append(showMore);
    }
  // -------------------------------------add showmore button function for comment contaier --------------------//



//------------------- fetch comments function 
const fetchComments = async(postId,commentContainer)=>{
const queryParams = new URLSearchParams({ postId });
const response = await fetch(`/api/comment?${queryParams.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  });

const result = await response.json();
if (response.ok) {
const comments = result.comment.reverse();

    // conditon to display only first two comment
for(let i=0 ;i<2 && i<result.comment.length;i++){
const comment = comments[i];
// calling comment Structure function
fetchCommentStructure(comment,result,commentContainer,postId);

};

//this should consider when i is more than 2 it should perform
//here this should add showmore button after first two iteration inside the comment container and should be less than equal to 2 
if(result.comment.length > 2){
// addShowmoreToComment function
addShowmoreToComment(commentContainer);
} 

// on clicking showmore button display all comments inside commentContainer 
commentContainer.addEventListener("click",async function (event) {
const showmoreButton = event.target.closest(".show-more-comment-toggleButton");
if(showmoreButton){
commentContainer.innerHTML="";

comments.forEach((comment)=>{
fetchCommentStructure(comment,result,commentContainer,postId);
})
}
})
}
}
//------------------- fetch comments function----------------------------------//

  // ---------------------Posting comment
  // ---------------------posting comment on clicking comment-post-button ACTION
  document.addEventListener("click", async function (event) {
    const commentPostButton = event.target.closest(".comment-post-button");
     
    if (commentPostButton) {
      const postId = commentPostButton.getAttribute("data-post-id");
      const postContainer = commentPostButton.closest(".post");
      const commentCountNumber = postContainer.getAttribute("data-comment-count");
      let commentCount = postContainer.querySelector(".comment-length-count");
      let commentInputValue = postContainer.querySelector(".comment-input").value;
      const commentContainer = postContainer.querySelector(".comment-container");
      commentContainer.innerHTML = "";
     
      // commentPost function
     commentPost(postId,commentContainer,commentInputValue);

     postContainer.querySelector(".comment-input").value = "";
     postContainer.querySelector(".comment-input").style.height = "auto";

    // updating the comment count
    let currentCount = parseInt(commentCountNumber) ;
    commentCount.innerText = currentCount + 1;
    postContainer.setAttribute("data-comment-count", (currentCount + 1).toString());
    }

  });

  // ---------------------Posting comment--------------------------//

  // ---------Posting comment input Enter
  // ---------Posting comment input on clicking ENTER should submit and on clicking shift+ENTER move to next line ACTION

  document.addEventListener("keydown",function (event){
  const commentInput = event.target.closest(".comment-input");

  if(commentInput && event.key === "Enter" && !event.shiftKey) {

  event.preventDefault();

  const postContainer = commentInput.closest(".post");
  const commentContainer = postContainer.querySelector(".comment-container");
  commentContainer.innerHTML = "";

  const postId = commentInput.getAttribute("data-post-id");
  const commentCountNumber = postContainer.getAttribute("data-comment-count");
  let commentCount = postContainer.querySelector(".comment-length-count");

  const valueCommentInput = commentInput.value;
  // commentPost function
  commentPost(postId,commentContainer,valueCommentInput);
  postContainer.querySelector(".comment-input").value = ""; 
  postContainer.querySelector(".comment-input").style.height = "auto";

  // updating the comment count
  let currentCount = parseInt(commentCountNumber) ;
  commentCount.innerText = currentCount + 1;
  postContainer.setAttribute("data-comment-count", (currentCount + 1).toString());
  }
  })

// ---------Posting comment input Enter---------------------//

//--------------main comment button 
// ------------------------on clicking main comment button should fetch all comments ACTION
   document.addEventListener("click", async function(event) {
  const commentButton = event.target.closest(".comment-button");

  if(commentButton){
  const postContainer = commentButton.closest(".post");
  const commentContainer = postContainer.querySelector(".comment-container");
  commentContainer.innerHTML = "";
  const postId = commentButton.getAttribute("data-post-id");
  
  // fetchComment function
  fetchComments(postId,commentContainer);
  }
  });
 // -----------------main comment button---------------------------//
 }
 commentSection();

 // -----------------------------------!!!!!!!!!!!!!!!!!    Comment section   !!!!!!!!!!!!-------------------------------------//

//-----------!!!!!!!!!!!!!!!!  postingSection

//-------------!!!!!!!!!!!!    friendSection
const friendSection = ()=>{
  
  //----------------------------addFriend
  const addFriend = ()=>{

    document.addEventListener("click",async function (event) {
      const addFriendButton = event.target.closest(".addFriendButton");

      if(addFriendButton){
      const otherUserId = addFriendButton.getAttribute('data-otherUserId');

  

      const response = await fetch('/api/user/addFriend',{
        method:"POST",
        credentials:"include",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({otherUserId})
      })


    if(response.ok){
    
      window.location.reload();
    }
      }
    });

  }
  addFriend();
  //----------------------------addFriend------------------------------//

//---------------------------unFriend
const unFriend =()=>{

  document.addEventListener("click",async function(event){
    const unFriendButton = event.target.closest(".unFriendButton");

    if(unFriendButton){
      const otherUserId = unFriendButton.getAttribute('data-otherUserId');

      const response = await fetch("/api/user/unFriend",{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({otherUserId})
      });

      if(response.ok){
        window.location.reload();
      }
    }
  })
}
unFriend();
//---------------------------unFriend----------------------------------//

//---------------------------cancelFriendRequest
  const cancelFriendRequest =()=>{
    document.addEventListener("click",async function (event) {
      
      const cancelButton = event.target.closest(".requestSentButton");
      if(cancelButton){
      const otherUserId = cancelButton.getAttribute('data-otherUserId');

      const response = await fetch("/api/user/cancelFriendRequest",{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({otherUserId})
      });
      
      if(response.ok){
        window.location.reload();
      }
    }
    })
  }
  cancelFriendRequest();
  //---------------------------cancelFriendRequest---------------------//
  //-------------------------confirmFriendRequest
  const confirmFriendRequest = ()=>{

    document.addEventListener("click",async function (event) {
      const confirmButton = event.target.closest(".frndConfirmButton");
      if(confirmButton){
        const otherUserId = confirmButton.getAttribute('data-otherUserId');

        const response = await fetch("/api/user/confirmFriendRequest",{
          method:"POST",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({otherUserId})
        });

        if(response.ok){
          window.location.reload();
        }
      }
    })
  }
  confirmFriendRequest();
  //-------------------------confirmFriendRequest-----------------------//

  //-------------------------deleteFriendRequest
  const deleteFriendRequest =()=>{

    document.addEventListener("click",async function (event) {
      const deleteButton = event.target.closest(".frndDeleteButton");
      
      if(deleteButton){
        const otherUserId = deleteButton.getAttribute('data-otherUserId');

        const response = await fetch("/api/user/deleteFriendRequest",{
          method:"POST",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({otherUserId})
        });

        if(response.ok){
          window.location.reload();
        }
      }
    })
  }
  deleteFriendRequest();
  //-------------------------deleteFriendRequest-------------------------//
  
}
friendSection();
//-------------!!!!!!!!!!!!    friendSection    !!!!!!!!!!!!---------------------------//

const postingSection =()=>{

const fileInput = document.querySelector(".post-file-upload");
const captionInput = document.querySelector("#post-textarea-caption");
const previewContainer = document.querySelector(".postPreviewContainer");
const cancelButton =document.querySelector("#post-upload-cancel");

//-------preview container Post modal
// on selectig the file it immediatly creates a image and add the image to previewContainer
if(fileInput){
fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
            previewContainer.innerHTML = '';                   
            previewContainer.innerHTML = img;                  
            previewContainer.style.display = 'block'; 
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.style.display = 'none';
        previewContainer.innerHTML = '';
    }
});
}
//-------preview container Post modal----------//

//---------cancel button -postModal 
// on clicking the cancel button it changes display to none and removes the image from container.
const postingaction = document.querySelector(".posting-action");

if(postingaction){
postingaction.addEventListener("click",function(){
const errorContainer = document.querySelector(".error-container-post-modal");
errorContainer.innerHTML = "";
errorContainer.style.display="none";
});
}

cancelButton.addEventListener("click",function(){
  if(fileInput){
  fileInput.value = "";
  previewContainer.style.display = 'none';
  previewContainer.innerHTML = '';
  }
  if(captionInput){
    captionInput.value="";
  }
})
//---------cancel button -postModal----------------//

//---------adjust caption input
// adjust the caption container based on the size of caption on input
document.addEventListener('input', function (event) {//important to know
  if (event.target.matches('.post-textarea')) {
    const textarea = event.target;
    textarea.style.height = 'auto'; // reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // set to scrollHeight
  }
});
//---------adjust caption input---------------//

//--------posting the post action
const postProfileForm = document.querySelector("#postProfileForm");

postProfileForm.addEventListener("submit",async(event)=>{

  event.preventDefault();
  const captionInput = document.querySelector("#post-textarea-caption");
  const uploadPostInput = document.querySelector("#post-file-upload");
  const file = uploadPostInput.files[0];
  const caption = captionInput.value;  
  const errorMessageContainer = document.createElement("div");


  // throws error when no image is selected is selected for post
if (!file) {
  const errorMessageHtml = `<small class="bg-danger-subtle px-4 py-2 rounded-2 ">🖼️ Please select an image to share your post.</small>`;
  
  errorMessageContainer.classList.add("w-100","d-flex" ,"justify-content-start");
  errorMessageContainer.innerHTML = errorMessageHtml; 
  
  const container = document.querySelector(".error-container-post-modal");
  container.style.display="block";
  container.innerHTML="";
  container.appendChild(errorMessageContainer);
  
  return;
}

//using formdata to send image 
  const formData = new FormData(); 

  formData.append("postImage", file);
  formData.append("caption", caption);

  const response = await fetch("/api/post", {
    method: "POST",
     credentials: "include",
     body:formData,
  });

  if(response.ok){

   const modalElement = document.querySelector('#post-modal');
   const modalInstance = bootstrap.Modal.getInstance(modalElement);

   //after posting post, hides the modal and reloades the page.
   modalInstance.hide();
    location.reload();
  }

});
//--------posting the post action----------//
}
postingSection();

//-----------!!!!!!!!!!!!!!!!   postingSection   !!!!!!!!------------------//



