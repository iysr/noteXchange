import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-analytics.js";
import { getStorage, ref, uploadBytes, getMetadata, deleteObject, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, FacebookAuthProvider, GithubAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";

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

export let user;
//sign-up
export const signup=(email,password)=>{
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
export const signin=(email,password)=>{
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
export const passwordreset=(email)=>{
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
export let provider;
//google
export const googleauth = () =>{
  provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    user = result.user;
    isloggedin = true;
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
export const facebookauth = () =>{
  provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
  .then((result) => {
    // The signed-in user info.
    user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

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

//check auth status
onAuthStateChanged(auth, (user) => {
if (user) {
// User is signed in, see docs for a list of available properties
// https://firebase.google.com/docs/reference/js/firebase.User
const uid = user.uid;
// ...
} else {
// User is signed out
// ...
}
});

//sign out
export const signout=()=>{
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
export let uploadsuccess=false;
export const uploadNotes = (file, subj, lvl, name, uid)=>{
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
  console.log(snapshot);
});
}
export let filedeleted=false, delref;
export const deleteNotes=(i, e)=>{
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
export let masterlist;
export const listNotes=()=>{
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
export const updateNotes=()=>{
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