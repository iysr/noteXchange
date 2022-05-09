//npx webpack
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getMetadata, deleteObject, listAll, getDownloadURL } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, FacebookAuthProvider, signOut, updatePassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAclJslufvhi2_ifkfFflRRLCyZAbULymg",
  authDomain: "notexchange-537d7.firebaseapp.com",
  projectId: "notexchange-537d7",
  storageBucket: "notexchange-537d7.appspot.com",
  messagingSenderId: "624878655853",
  appId: "1:624878655853:web:be486f5771cd9de57ea264",
  measurementId: "G-3V5Q5L5BF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

 let user, bypw=true;
//sign-up
 const signup=(email,password)=>{
createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
isloggedin = true;
user = userCredential.user;
console.log('signed up');
})
.catch((error) => {
  isloggedin = false;
const errorCode = error.code;
const errorMessage = error.message;
if(errorCode=='auth/invalid-email'){
  document.getElementById('errorcodeauth').innerHTML = 'Invalid Email Address';
}
else if(errorCode=='auth/internal-error'){
  document.getElementById('errorcodeauth').innerHTML = 'Wrong Email Address or Password';
}
else{
document.getElementById('errorcodeauth').innerHTML = errorCode;
}
});
}

//sign-in
 const signin=(email,password)=>{
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
isloggedin = true;
user = userCredential.user;
console.log('signed in');

})
.catch((error) => {
  isloggedin = false;
const errorCode = error.code;
const errorMessage = error.message;
if(errorCode=='auth/invalid-email'){
  document.getElementById('errorcodeauth').innerHTML = 'Invalid Email Address';
}
else if(errorCode=='auth/internal-error'){
  document.getElementById('errorcodeauth').innerHTML = 'Wrong Email Address or Password';
}
else if(errorCode=='auth/wrong-password'){
  document.getElementById('errorcodeauth').innerHTML = 'Wrong Password';
}
else{
document.getElementById('errorcodeauth').innerHTML = errorCode;
}

});
}
//forgot password
 const passwordreset=(email)=>{
sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
    isloggedin = false;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if(errorCode=='auth/invalid-email'){
      document.getElementById('errorcodeauth').innerHTML = 'Invalid Email Address';
    }
    else if(errorCode=='auth/missing-email'){
      document.getElementById('errorcodeauth').innerHTML = 'Email Address Cannot be Left Blank';
    }
    else{
    document.getElementById('errorcodeauth').innerHTML = errorCode;
    }
  });
}
 let provider;
//google
 const googleauth = () =>{
  provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    user = result.user;
    isloggedin = true;
    bypw=false;
  }).catch((error) => {
    // Handle Errors here.
    isloggedin = false;
    const errorCode = error.code;
    const errorMessage = error.message;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    if (error.code === 'auth/account-exists-with-different-credential') {
      // User's email already exists.
      // The pending Google credential.
      var pendingCred = error.credential;
      // The provider account's email address.
      var email = error.email;
      // Get sign-in methods for this email.
      auth.fetchSignInMethodsForEmail(email).then(function(methods) {
        // Step 3.
        // If the user has several sign-in methods,
        // the first method in the list will be the "recommended" method to use.
        if (methods[0] === 'password') {
          // Asks the user their password.
          // In real scenario, you should handle this asynchronously.
          var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
          auth.signInWithEmailAndPassword(email, password).then(function(result) {
            // Step 4a.
            return result.user.linkWithCredential(pendingCred);
          }).then(function() {
            // Google account successfully linked to the existing Firebase user.
            goToApp();
          });
          return;
        }
        // All the other cases are external providers.
        // Construct provider object for that provider.
        // TODO: implement getProviderForProviderId.
        var provider = getProviderForProviderId(methods[0]);
        // At this point, you should let the user know that they already have an account
        // but with a different provider, and let them validate the fact they want to
        // sign in with this provider.
        // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
        // so in real scenario you should ask the user to click on a "continue" button
        // that will trigger the signInWithPopup.
        auth.signInWithPopup(provider).then(function(result) {
          // Remember that the user may have signed in with an account that has a different email
          // address than the first one. This can happen as Firebase doesn't control the provider's
          // sign in flow and the user is free to login using whichever account they own.
          // Step 4b.
          // Link to Google credential.
          // As we have access to the pending credential, we can directly call the link method.
          result.user.linkAndRetrieveDataWithCredential(pendingCred).then(function(usercred) {
            // Google account successfully linked to the existing Firebase user.
            goToApp();
          });
        });
      });
    }
  });
}
//facebook
 const facebookauth = () =>{
  provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
    // The signed-in user info.
    user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    bypw=false;
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
}

const changepw = (newpw)=>{
  let usr = auth.currentUser;
  updatePassword(usr, newpw).then(() => {
    // Update successful.
  }).catch((error) => {
    // An error ocurred
    // ...
  });
}

//sign out
 const signout=()=>{
  signOut(auth).then(() => {
    // Sign-out successful.
    isloggedin = false;
  }).catch((error) => {
    // An error happened.
  });
  
}
//Storage---------------------------------------------------------------------------------------------------
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();
 let uploadsuccess=false;
 const uploadNotes = (file, subj, lvl, name, uid)=>{
  uploadsuccess=false;
  let d = new Date();
  let str = '';
  str+=d.getFullYear()
  str+=(d.getMonth()+1)
  str+=d.getDate()
  str+=d.getHours()
  str+=d.getMinutes()
  str+=d.getSeconds()
  str+=d.getMilliseconds()
  if(file.name.substring(file.name.length-4)=='docx'){
    str+=file.name.substring(file.name.length-5)
  }
  else{
    str+=file.name.substring(file.name.length-4)
  }
  let notesRef = ref(storage, 'notes/'+str);
  let metadata = {
    customMetadata:{
    'subject': subj,
    'level': lvl,
    'userName':name,
    'userID':uid,
    'filename':file.name,
    }
  }
uploadBytes(notesRef, file, metadata).then((snapshot) => {
  uploadsuccess=true;
  updateNotes()
});
}
 let filedeleted=false, delref;
 const deleteNotes=(i, e)=>{
  filedeleted = false;
  let file = masterlist[parseInt(i)].ref._location.path_;
  let delRef = ref(storage, file);
// Delete the file
deleteObject(delRef).then(() => {
  // File deleted successfully
  filedeleted=true;
  delref = e;
  updateNotes();
}).catch((error) => {
  // Uh-oh, an error occurred!
});
}


 let masterlist;
 const listNotes=()=>{
  masterlist = []
  const listRef = ref(storage, 'notes');
// Find all the prefixes and items.
listAll(listRef)
  .then((res) => {
    res.items.forEach((itemRef) => {
      if(itemRef._location.path_!='notes/undefined'){
        let jsonobj = {
          'ref':itemRef,
          'metas':'',
          'url':''
        }
        let pth = ref(storage, itemRef._location.path_)
        getMetadata(pth)
          .then((meta) => {
            jsonobj.metas= meta
          })
          .catch((error) => {
            console.log('meta error')
          });
        getDownloadURL(pth)
          .then((url) => {
            jsonobj.url= url
          })
          .catch((error) => {
            console.log(error.code)
          });
          masterlist.push(jsonobj)
      }
    });
  }).catch((error) => {
    console.log(error)
  });
}
 const updateNotes=()=>{
  const listRef = ref(storage, 'notes');

// Find all the prefixes and items.
listAll(listRef)
  .then((res) => {
    res.items.forEach((itemRef) => {
      if(itemRef._location.path_!='notes/undefined'){
        let choose=true;
        masterlist.forEach((v)=>{
          if(v.ref._location.path_==itemRef._location.path_) choose=false;
        })
        if(choose){
          let jsonobj = {
            'ref':itemRef,
            'metas':'',
            'url':''
          }
          let pth = ref(storage, itemRef._location.path_)
          getMetadata(pth)
            .then((meta) => {
              jsonobj.metas= meta
            })
            .catch((error) => {
              console.log('meta error')
            });
          getDownloadURL(pth)
            .then((url) => {
              jsonobj.url= url
            })
            .catch((error) => {
              console.log(error.code)
            });
            masterlist.push(jsonobj)
      }
      }
    });
    masterlist.forEach((v,i)=>{
      let ok = false;
      res.items.forEach((x)=>{
        if(v.ref._location.path_==x._location.path_){ ok = true;}
      })
      if(ok==false){
        masterlist.splice(i, 1);
      }
    })
  }).catch((error) => {
    console.log(error)
  });
}
/*-----------------------------------------------------------------------------------------------------*/

let page = 'a', isMobile=false;
//Event listeners
document.addEventListener('click', (e)=>{
    if(e.target.id=='su'){
        signup(document.getElementsByClassName('email')[0].value,document.getElementsByClassName('password')[0].value)
        postprocessing()
    }
    else if(e.target.id=='li'){
        signin(document.getElementsByClassName('email')[0].value,document.getElementsByClassName('password')[0].value)
        postprocessing()
    }
    else if(e.target.id=='google'){
        googleauth();
        postprocessing();
    }
    else if(e.target.id=='facebook'){
        facebookauth();
        postprocessing();
    }
    else if(e.target.id=='passwordreset'){
        showpopup('passwordreset');
    }
    else if(e.target.id=='close'){
        closepopup();
    }
    else if(e.target.id=='pwrt'){
        passwordreset(document.getElementsByClassName('email')[1].value)
        closepopup();
    }
    else if(e.target.id=='cpw'){
      if(document.getElementById('pw1').value!=document.getElementById('pw2').value){
        document.getElementById('errorcodecpw').innerHTML = "The passwords do not match."
      }
      else if(document.getElementById('pw2').value.length<6){
        document.getElementById('errorcodecpw').innerHTML = 'Password has to be at least 6 characters long.'
      }
      else{
        changepw(document.getElementById('pw2').value)
        closepopup();
      }
    }
    else if(e.target.id=='nup'){
      if(!document.getElementById('notesupload').files[0]){
        document.getElementById('errorcodeupload').innerHTML='Please select a file.'
      }
      else if(!document.getElementById('upsubject').value){
        document.getElementById('errorcodeupload').innerHTML='Please select the subject.'
      }
      else if(!document.getElementById('uplevel').value){
        document.getElementById('errorcodeupload').innerHTML = 'Please select the level.'
      }
      else if(document.getElementById('notesupload').files[0].name.substring(document.getElementById('notesupload').files[0].name.length-4)!='docx'&&document.getElementById('notesupload').files[0].name.substring(document.getElementById('notesupload').files[0].name.length-4)!='.doc'&&document.getElementById('notesupload').files[0].name.substring(document.getElementById('notesupload').files[0].name.length-4)!='.pdf'){
        document.getElementById('errorcodeupload').innerHTML = 'Please select a different file. Only .pdf, .doc and .docx files are accepted.'
      }
      else{
        uploadNotes(document.getElementById('notesupload').files[0], document.getElementById('upsubject').value, document.getElementById('uplevel').value, user.displayName, user.uid)
        awaitupload()
      }
    }
    else if(e.target.id=='home'){
        updateNotes();
        mainpage();
    }
    else if(e.target.id=='upload'){
        uploadpage();
    }
    else if(e.target.id=='logout'){
        signout();
        awaitsignout()
    }
    else if(e.target.id=='usernotes'){
        usernotes()
    }
    else if(e.target.id=='profpg'||e.target.parentElement.id=='profpg'){
      profilepage()
    }
    else if(e.target.id=='changepw'){
      showpopup('changepassword');
    }
    else if(e.target.id=='aboutpg'){
      aboutpage()
    }
    else if(e.target.id=='dmtoggle'){
      if(dmia) lightmode();
      else darkmode();
    }
    else if(e.target.classList.contains('note')||e.target.classList.contains('notechild')){
        if(e.target.classList.contains('document')||e.target.parentElement.classList.contains('document')){
            if(e.target.classList.contains('document')){
                e.target.innerHTML+=`<iframe class="showingnotes" src="${masterlist[parseInt(e.target.id)].url}"></iframe>`
            }
            else{
                e.target.parentElement.innerHTML+=`<iframe class="showingnotes" src="${masterlist[parseInt(e.target.parentElement.id)].url}"></iframe>`
            }
        }
        else{
        if(e.target.classList.contains('note')){
            if(e.target.classList.contains('ondisplay')){
              if(page=='m'){
                e.target.classList.remove('ondisplay')
                e.target.children[3].style.display = 'none';
              }
              else if(page=='mn'){
                e.target.classList.remove('ondisplay')
                e.target.children[4].style.display = 'none';
              }
            }
            else{
              if(page=='m'){
                e.target.classList.add('ondisplay')
                e.target.children[3].style.display = 'block';
              }
              else if(page=='mn'){
                e.target.classList.add('ondisplay')
                e.target.children[4].style.display = 'block';
              }
            }
        }
        else{
            if(e.target.parentElement.classList.contains('ondisplay')){
              if(page=='m'){
                e.target.parentElement.classList.remove('ondisplay')
                e.target.parentElement.children[3].style.display = 'none';
              }
              else if(page=='mn'){
                e.target.parentElement.classList.remove('ondisplay')
                e.target.parentElement.children[4].style.display = 'none';
              }
            }
            else{
              if(page=='m'){
                e.target.parentElement.classList.add('ondisplay')
                e.target.parentElement.children[3].style.display = 'block';
              }
              else if(page=='mn'){
                e.target.parentElement.classList.add('ondisplay')
                e.target.parentElement.children[4].style.display = 'block';
              }
            }
        }
    }
}
    else if(e.target.classList.contains('deletenote')){
        deleteNotes(e.target.parentElement.id, e.target.parentElement);
        awaitdeletion()
    }
});
document.addEventListener('keypress', (e)=>{
    if(e.key=='Enter'&&page=='a'){
        if(document.querySelector('#authpage .sidediv').children[0].classList.contains('highlight')){
            signup(document.getElementsByClassName('email')[0].value,document.getElementsByClassName('password')[0].value)
            postprocessing()
        }
        else{
            signin(document.getElementsByClassName('email')[0].value,document.getElementsByClassName('password')[0].value)
            postprocessing()
        }
    }
})

const postprocessing = () =>{
    if(isloggedin===false){
        window.setTimeout(postprocessing, 100);
    }
    else if(isloggedin===true){
        updateNotes();
        mainpage();
        updateNotes();
        mainpage();
    }
}
const awaitupload=()=>{
    if(uploadsuccess===false){
        window.setTimeout(awaitupload, 100);
    }
    else if(uploadsuccess===true){
        updateNotes();
        mainpage();
    }
}
const awaitsignout=()=>{
    if(isloggedin===true){
        window.setTimeout(awaitsignout, 100);
    }
    else if(isloggedin===false){
        authpage();
    }
}
const awaitdeletion=()=>{
    if(filedeleted==false){
        window.setTimeout(awaitdeletion, 100);
    }
    else if(filedeleted==true){
        document.getElementById('usernotelist').removeChild(delref)
    }
}

const showpopup = (id) =>{
    document.getElementById('popupbg').style.display = 'block';
    if(id=='passwordreset'){
      document.getElementById('popup').innerHTML=`<a id="close">&times;</a><h1>Send Password Reset Link</h1><input type="text" placeholder="Email" class="email"><input type="submit" class="submit" value="Submit" id="pwrt">`
      darklight()
  }
  if(id=='changepassword'){
    document.getElementById('popup').innerHTML=`<a id="close">&times;</a><h1>Change Password</h1><input type="password" class="password" id="pw1" placeholder="New Password"><input type="password" class="password" id="pw2" placeholder="Re-Enter New Password"><p id="errorcodecpw"></p><input type="submit" class="submit" value="Submit" id="cpw">`
    darklight()
    document.getElementById('errorcodecpw').style.color = '#ff7a19'
  }
}
const closepopup = () =>{
    document.getElementById('popupbg').style.display = 'none';
}
const authpage=()=>{
    document.getElementById('authpage').style.display = 'block';
    document.getElementById('mynotespage').style.display = 'none';
    document.getElementById('uploadpage').style.display = 'none';
    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('hnavbar').style.display = 'none';
    document.getElementById('aboutpage').style.display = 'none';
    document.getElementById('sidebarcontainer').style.width = '0';
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('sidebar').style.padding='0';
    document.getElementById('profilepage').style.display = 'none';
    page='a'
    mobility()
    darklight();
}
const mainpage = () =>{
    document.getElementById('authpage').style.display = 'none';
    document.getElementById('mynotespage').style.display = 'none';
    document.getElementById('uploadpage').style.display = 'none';
    document.getElementById('mainpage').style.display = 'block';
    document.getElementById('aboutpage').style.display = 'none';
    document.getElementById('hnavbar').style.display = 'block';
    Array.from(document.getElementsByClassName('username')).forEach((v)=>{
        v.innerText= user.displayName
    })
    Array.from(document.getElementsByClassName('userphoto')).forEach((v)=>{
      v.setAttribute('src', user.photoURL);
    })
    document.getElementById('noteslist').innerHTML = ''
    document.getElementById('recentslist').innerHTML=''
    document.getElementById('profilepage').style.display = 'none';
    masterlist.forEach((v,i)=>{
        if(v.metas.customMetadata.filename.substring(v.metas.customMetadata.filename.length-4)=='.pdf'){
            document.getElementById('noteslist').innerHTML+=`<div class="note" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><p><a onclick="keyword('${v.metas.customMetadata.level}')">${v.metas.customMetadata.level}</a>, <a onclick="keyword('${v.metas.customMetadata.subject}')">${v.metas.customMetadata.subject}</a></p><p class="right"><a onclick="keyword('${v.metas.customMetadata.userName}')">By ${v.metas.customMetadata.userName}</a></p><iframe class="showingnotes" src="${v.url}"></iframe></div>`
        }
        else{
            document.getElementById('noteslist').innerHTML+=`<div class="note document" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><p><a onclick="keyword('${v.metas.customMetadata.level}')">${v.metas.customMetadata.level}</a>, <a onclick="keyword('${v.metas.customMetadata.subject}')">${v.metas.customMetadata.subject}</a></p><p class="right"><a onclick="keyword('${v.metas.customMetadata.userName}')">By ${v.metas.customMetadata.userName}</a></p></div>`
        }
    })
    if(masterlist.length<=10){
      let v;
      for(let i=masterlist.length-1; i>=0; i--){
        v = masterlist[i];
        if(v.metas.customMetadata.filename.substring(v.metas.customMetadata.filename.length-4)=='.pdf'){
          document.getElementById('recentslist').innerHTML+=`<div class="note" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><p><a onclick="keyword('${v.metas.customMetadata.level}')">${v.metas.customMetadata.level}</a>, <a onclick="keyword('${v.metas.customMetadata.subject}')">${v.metas.customMetadata.subject}</a></p><p class="right"><a onclick="keyword('${v.metas.customMetadata.userName}')">By ${v.metas.customMetadata.userName}</a></p><iframe class="showingnotes" src="${v.url}"></iframe></div>`
        }
        else{
          document.getElementById('recentslist').innerHTML+=`<div class="note document" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><p><a onclick="keyword('${v.metas.customMetadata.level}')">${v.metas.customMetadata.level}</a>, <a onclick="keyword('${v.metas.customMetadata.subject}')">${v.metas.customMetadata.subject}</a></p><p class="right"><a onclick="keyword('${v.metas.customMetadata.userName}')">By ${v.metas.customMetadata.userName}</a></p></div>`
        }
      }
    }
    else{
      for(let i=masterlist.length-1; i>=masterlist.length-11; i--){
        v = masterlist[i];
        if(v.metas.customMetadata.filename.substring(v.metas.customMetadata.filename.length-4)=='.pdf'){
          document.getElementById('recentslist').innerHTML+=`<div class="note" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><p><a onclick="keyword('${v.metas.customMetadata.level}')">${v.metas.customMetadata.level}</a>, <a onclick="keyword('${v.metas.customMetadata.subject}')">${v.metas.customMetadata.subject}</a></p><p class="right"><a onclick="keyword('${v.metas.customMetadata.userName}')">By ${v.metas.customMetadata.userName}</a></p><iframe class="showingnotes" src="${v.url}"></iframe></div>`
        }
        else{
          document.getElementById('recentslist').innerHTML+=`<div class="note document" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><p><a onclick="keyword('${v.metas.customMetadata.level}')">${v.metas.customMetadata.level}</a>, <a onclick="keyword('${v.metas.customMetadata.subject}')">${v.metas.customMetadata.subject}</a></p><p class="right"><a onclick="keyword('${v.metas.customMetadata.userName}')">By ${v.metas.customMetadata.userName}</a></p></div>`
        }
      }
    }
    page='m'
    darklight();
    mobility()
}
const uploadpage = () =>{
    document.getElementById('authpage').style.display = 'none';
    document.getElementById('mynotespage').style.display = 'none';
    document.getElementById('uploadpage').style.display = 'block';
    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('aboutpage').style.display = 'none';
    document.getElementById('hnavbar').style.display = 'block';
    document.getElementById('profilepage').style.display = 'none';
    page='u'
    darklight();
}
const usernotes=()=>{
    document.getElementById('sidebarcontainer').style.width = '0';
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('sidebar').style.padding='0';
    document.getElementById('authpage').style.display = 'none';
    document.getElementById('mynotespage').style.display = 'block';
    document.getElementById('uploadpage').style.display = 'none';
    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('aboutpage').style.display = 'none';
    document.getElementById('hnavbar').style.display = 'block';
    document.getElementById('profilepage').style.display = 'none';
    page='mn'
    document.getElementById('usernotelist').innerHTML='';
    masterlist.forEach((v,i)=>{
        if(v.metas.customMetadata.userID==user.uid){
            if(v.metas.customMetadata.filename.substring(v.metas.customMetadata.filename.length-4)=='.pdf'){
                document.getElementById('usernotelist').innerHTML+=`<div class="note" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><img class="deletenote" src="Images/trash.webp"><p>${v.metas.customMetadata.level}, ${v.metas.customMetadata.subject}</p><p class="right">By ${v.metas.customMetadata.userName}</p><iframe class="showingnotes" src="${v.url}"></iframe></div>`
            }
            else{
                document.getElementById('usernotelist').innerHTML+=`<div class="note document" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><img class="deletenote" src="Images/trash.webp"><p>${v.metas.customMetadata.level}, ${v.metas.customMetadata.subject}</p><p class="right">By ${v.metas.customMetadata.userName}</p></div>`
            }
        }
    })
    if(document.getElementById('usernotelist').innerHTML==''){
        document.getElementById('usernotelist').innerHTML+=`<p>None yet. Start uploading!</p>`
    }
    darklight();
}
const aboutpage=()=>{
  document.getElementById('sidebarcontainer').style.width = '0';
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('sidebar').style.padding='0';
    document.getElementById('authpage').style.display = 'none';
    document.getElementById('mynotespage').style.display = 'none';
    document.getElementById('uploadpage').style.display = 'none';
    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('aboutpage').style.display = 'block';
    document.getElementById('hnavbar').style.display = 'block';
    document.getElementById('profilepage').style.display = 'none';
    page='abt'
    darklight();
}
const profilepage=()=>{
  document.getElementById('sidebarcontainer').style.width = '0';
  document.getElementById('sidebar').style.width = '0';
  document.getElementById('sidebar').style.padding='0';
  document.getElementById('authpage').style.display = 'none';
  document.getElementById('mynotespage').style.display = 'none';
  document.getElementById('uploadpage').style.display = 'none';
  document.getElementById('mainpage').style.display = 'none';
  document.getElementById('aboutpage').style.display = 'block';
  document.getElementById('hnavbar').style.display = 'block';
  document.getElementById('profilepage').style.display = 'block';
  if(bypw==false){
    document.getElementById('changepw').style.display = 'none';
  }
  else{
    document.getElementById('changepw').style.display = 'block';
  }
  let noofnotes=0;
  masterlist.forEach((v)=>{
    if(v.metas.customMetadata.userID==user.uid){
      noofnotes+=1;
    }
  })
  document.getElementsByClassName('number')[0].innerHTML = noofnotes;
  darklight();
}
listNotes();

const mobile=()=>{
    if(page=='a'){
        document.getElementsByClassName('sidediv')[0].style.width = '100%';
        document.getElementsByClassName('sidediv')[0].style.minWidth = '0';
        document.getElementById('mlogo').style.display = 'block';
    }
    else if(page=='m'){
      document.getElementById('searchbar').style.maxWidth="100%"
      document.getElementById('searchbar').style.float='none'
    }
    document.getElementById('popup').style.width = '80%';
}
const desktop=()=>{
    if(page=='a'){
        document.getElementsByClassName('sidediv')[0].style.width = '40%';
        document.getElementsByClassName('sidediv')[0].style.minWidth = '400px';
        document.getElementById('mlogo').style.display = 'none';
    }
    else if(page=='m'){
      document.getElementById('searchbar').style.maxWidth="200px"
      document.getElementById('searchbar').style.float='right'
    }
    document.getElementById('popup').style.width = '50%';
}
const mobility=()=>{
    if(window.innerWidth<750){mobile(); isMobile=true;}
    else{desktop(); isMobile=false;}
}

let dmia = null;
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

const darkmode=()=>{
  document.getElementsByClassName('sidediv')[0].style.background = '#333'
  document.getElementById('mainpage').style.background='#333'
  document.getElementById('aboutpage').style.background='#333'
  document.getElementById('uploadpage').style.background='#333'
  document.getElementById('profilepage').style.background='#333'
  document.getElementById('mynotespage').style.background='#333'
  document.getElementById('popup').style.background='#333'
  Array.from(document.getElementsByTagName('input')).forEach((v)=>{
    v.style.color = 'white'
    v.style.borderColor = 'white'
  })
  Array.from(document.getElementsByTagName('select')).forEach((v)=>{
    v.style.color = 'white'
    v.style.borderColor = 'white'
  })
  Array.from(document.getElementsByTagName('label')).forEach((v)=>{
    v.style.color = 'white'
    v.style.borderColor = 'white'
  })
  Array.from(document.getElementsByTagName('a')).forEach((v)=>{
    if(v.parentElement.id!='sidebar'){
      v.style.color = 'white';
    }
  })
  Array.from(document.getElementsByTagName('p')).forEach((v)=>{
    v.style.color = 'white'
  })
  Array.from(document.getElementsByTagName('h1')).forEach((v)=>{
    v.style.color = 'white'
  })
  Array.from(document.getElementsByTagName('h2')).forEach((v)=>{
    v.style.color = 'white'
  })
  Array.from(document.getElementsByClassName('note')).forEach((v)=>{
    v.style.borderColor = 'white'
  })
  Array.from(document.getElementsByClassName('deletenote')).forEach((v)=>{
    v.setAttribute('src','Images/trashwhite.webp')
  })
  Array.from(document.getElementsByTagName('option')).forEach((v)=>{
    v.style.color = 'black'
  })
  Array.from(document.getElementsByClassName('profbutton')).forEach((v)=>{
    v.style.borderColor = 'white'
  })
  document.getElementById('errorcodeauth').style.color = '#ff7a19'
  document.getElementById('errorcodeupload').style.color = '#ff7a19'
  document.getElementById('dmtoggle').setAttribute('src','Images/moon.webp')
  document.getElementById('mlogo').setAttribute('src','Images/logo_white.webp')
  dmia=true
}
const lightmode=()=>{
  document.getElementsByClassName('sidediv')[0].style.background = 'white'
  document.getElementById('mainpage').style.background='#fff'
  document.getElementById('aboutpage').style.background='#fff'
  document.getElementById('uploadpage').style.background='#fff'
  document.getElementById('profilepage').style.background='#fff'
  document.getElementById('mynotespage').style.background='#fff'
  document.getElementById('popup').style.background='#fff'
  Array.from(document.getElementsByTagName('input')).forEach((v)=>{
    v.style.color = 'black'
    v.style.borderColor = '#02293e'
  })
  Array.from(document.getElementsByTagName('select')).forEach((v)=>{
    v.style.color = 'black'
    v.style.borderColor = '#02293e'
  })
  Array.from(document.getElementsByTagName('label')).forEach((v)=>{
    v.style.color = 'black'
    v.style.borderColor = '#02293e'
  })
  Array.from(document.getElementsByTagName('a')).forEach((v)=>{
    if(v.parentElement.id!='sidebar'){
      v.style.color = 'black';
    }
    if(v.classList.contains('highlight')){
      v.style.color = 'white'
    }
  })
  Array.from(document.getElementsByTagName('p')).forEach((v)=>{
    v.style.color = 'black'
    if(v.classList.contains('username')){
      v.style.color = 'white'
    }
  })
  Array.from(document.getElementsByTagName('h1')).forEach((v)=>{
    v.style.color = 'black'
  })
  Array.from(document.getElementsByTagName('h2')).forEach((v)=>{
    v.style.color = 'black'
  })
  Array.from(document.getElementsByClassName('note')).forEach((v)=>{
    v.style.borderColor = '#02293e'
  })
  Array.from(document.getElementsByClassName('deletenote')).forEach((v)=>{
    v.setAttribute('src','Images/trash.webp')
  })
  Array.from(document.getElementsByTagName('option')).forEach((v)=>{
    v.style.color = 'black'
  })
  Array.from(document.getElementsByClassName('profbutton')).forEach((v)=>{
    v.style.borderColor = '#02293e'
  })
  document.getElementById('hamburger').style.color = 'white'
  document.getElementById('errorcodeauth').style.color = '#ff7a19'
  document.getElementById('errorcodeupload').style.color = '#ff7a19'
  document.getElementById('dmtoggle').setAttribute('src','Images/sun.webp')
  document.getElementById('mlogo').setAttribute('src','Images/logo.webp')
  dmia=false
}
const darklight=()=>{
  if(dmia==true){
    darkmode()
  }
  else if(dmia==false){
    lightmode()
  }
  else{
    if(userPrefersDark){
      darkmode();
    }
    if(userPrefersLight){
      lightmode();
    }
  }
}

window.addEventListener('change', mobility)
window.addEventListener('resize', mobility)
mobility();
darklight()