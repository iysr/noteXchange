import * as Firebase from './dist/main.js';
let page = 'a', isMobile=false;
//Event listeners
document.addEventListener('click', (e)=>{
    if(e.target.id=='su'){
        Firebase.signup(document.getElementsByClassName('email')[0].value,document.getElementsByClassName('password')[0].value)
        postprocessing()
    }
    else if(e.target.id=='li'){
        Firebase.signin(document.getElementsByClassName('email')[0].value,document.getElementsByClassName('password')[0].value)
        postprocessing()
    }
    else if(e.target.id=='google'){
        Firebase.googleauth();
        postprocessing();
    }
    else if(e.target.id=='facebook'){
        Firebase.facebookauth();
        postprocessing();
    }
    else if(e.target.id=='passwordreset'){
        showpopup('passwordreset');
    }
    else if(e.target.id=='close'){
        closepopup();
    }
    else if(e.target.id=='pwrt'){
        Firebase.passwordreset(document.getElementsByClassName('email')[1].value)
        closepopup();
    }
    else if(e.target.id=='nup'){
        console.log(document.getElementById('notesupload').files)
        Firebase.uploadNotes(document.getElementById('notesupload').files[0], document.getElementById('upsubject').value, document.getElementById('uplevel').value, Firebase.user.displayName, Firebase.user.uid)
        awaitupload()
    }
    else if(e.target.id=='home'){
        Firebase.updateNotes();
        mainpage();
    }
    else if(e.target.id=='upload'){
        uploadpage();
    }
    else if(e.target.id=='logout'){
        Firebase.signout();
        awaitsignout()
    }
    else if(e.target.id=='usernotes'){
        usernotes()
    }
    else if(e.target.classList.contains('note')||e.target.classList.contains('notechild')){
        if(e.target.classList.contains('document')||e.target.parentElement.classList.contains('document')){
            if(e.target.classList.contains('document')){
                e.target.innerHTML+=`<iframe class="showingnotes" src="${Firebase.masterlist[parseInt(e.target.id)].url}"></iframe>`
            }
            else{
                e.target.parentElement.innerHTML+=`<iframe class="showingnotes" src="${Firebase.masterlist[parseInt(e.target.id)].url}"></iframe>`
            }
        }
        else{
        if(e.target.classList.contains('note')){
            if(e.target.classList.contains('ondisplay')){
                e.target.classList.remove('ondisplay')
                e.target.children[3].style.display = 'none';
            }
            else{
                e.target.classList.add('ondisplay')
                e.target.children[3].style.display = 'block';
            }
        }
        else{
            if(e.target.parentElement.classList.contains('ondisplay')){
                e.target.parentElement.classList.remove('ondisplay')
                e.target.parentElement.children[3].style.display = 'none';
            }
            else{
                e.target.parentElement.classList.add('ondisplay')
                e.target.parentElement.children[3].style.display = 'block';
            }
        }
    }
}
    else if(e.target.classList.contains('deletenote')){
        Firebase.deleteNotes(e.target.parentElement.id, e.target.parentElement);
        awaitdeletion()
    }
});
document.addEventListener('keypress', (e)=>{
    if(e.key=='Enter'&&page=='a'){
        if(document.querySelector('#authpage .sidediv').children[0].classList.contains('highlight')){
            Firebase.signup(document.getElementsByClassName('email')[0].value,document.getElementsByClassName('password')[0].value)
            postprocessing()
        }
        else{
            Firebase.signin(document.getElementsByClassName('email')[0].value,document.getElementsByClassName('password')[0].value)
            postprocessing()
        }
    }
})

const postprocessing = () =>{
    if(isloggedin===false){
        window.setTimeout(postprocessing, 100);
    }
    else if(isloggedin===true){
        console.log(Firebase.user)
        mainpage();
    }
}
const awaitupload=()=>{
    if(Firebase.uploadsuccess===false){
        window.setTimeout(awaitupload, 100);
    }
    else if(Firebase.uploadsuccess===true){
        Firebase.updateNotes();
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
    if(Firebase.filedeleted==false){
        window.setTimeout(awaitdeletion, 100);
    }
    else if(Firebase.filedeleted==true){
        document.getElementById('usernotelist').removeChild(Firebase.delref)
    }
}

const showpopup = (id) =>{
    document.getElementById('popupbg').style.display = 'block';
    if(id=='passwordreset'){
        document.getElementById('popup').innerHTML=`<a id="close">&times;</a><h1>Send Password Reset Link</h1><input type="text" placeholder="Email" class="email"><input type="submit" class="submit" value="Submit" id="pwrt">`
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
    document.getElementById('sidebarcontainer').style.width = '0';
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('sidebar').style.padding='0';
    page='a'
}
const mainpage = () =>{
    document.getElementById('authpage').style.display = 'none';
    document.getElementById('mynotespage').style.display = 'none';
    document.getElementById('uploadpage').style.display = 'none';
    document.getElementById('mainpage').style.display = 'block';
    document.getElementById('hnavbar').style.display = 'block';
    Array.from(document.getElementsByClassName('username')).forEach((v)=>{
        v.innerText= Firebase.user.displayName
    })
    document.getElementById('userphoto').setAttribute('src', Firebase.user.photoURL);
    document.getElementById('noteslist').innerHTML = ''
    console.log(Firebase.masterlist)/*!!!!!!*/
    Firebase.masterlist.forEach((v,i)=>{//<iframe class="showingnotes" src="${url}"></iframe>
        if(v.metas.customMetadata.filename.substring(v.metas.customMetadata.filename.length-4)=='.pdf'){
            document.getElementById('noteslist').innerHTML+=`<div class="note" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><p>${v.metas.customMetadata.level}, ${v.metas.customMetadata.subject}</p><p class="right">By ${v.metas.customMetadata.userName}</p><iframe class="showingnotes" src="${v.url}"></iframe></div>`
        }
        else{
            document.getElementById('noteslist').innerHTML+=`<div class="note document" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><p>${v.metas.customMetadata.level}, ${v.metas.customMetadata.subject}</p><p class="right">By ${v.metas.customMetadata.userName}</p></div>`
        }
    })
    page='m'
}
const uploadpage = () =>{
    document.getElementById('authpage').style.display = 'none';
    document.getElementById('mynotespage').style.display = 'none';
    document.getElementById('uploadpage').style.display = 'block';
    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('hnavbar').style.display = 'block';
    page='u'
}
const usernotes=()=>{
    document.getElementById('sidebarcontainer').style.width = '0';
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('sidebar').style.padding='0';
    document.getElementById('authpage').style.display = 'none';
    document.getElementById('mynotespage').style.display = 'block';
    document.getElementById('uploadpage').style.display = 'none';
    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('hnavbar').style.display = 'block';
    page='mn'
    document.getElementById('usernotelist').innerHTML='';
    Firebase.masterlist.forEach((v,i)=>{
        if(v.metas.customMetadata.userID==Firebase.user.uid){
            if(v.metas.customMetadata.filename.substring(v.metas.customMetadata.filename.length-4)=='.pdf'){
                document.getElementById('usernotelist').innerHTML+=`<div class="note" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><img class="deletenote" src="Images/trash-2.webp"><p>${v.metas.customMetadata.level}, ${v.metas.customMetadata.subject}</p><p class="right">By ${v.metas.customMetadata.userName}</p><iframe class="showingnotes" src="${v.url}"></iframe></div>`
            }
            else{
                document.getElementById('usernotelist').innerHTML+=`<div class="note document" id="${i}"><h2 class="notechild">${v.metas.customMetadata.filename}</h2><img class="deletenote" src="Images/trash-2.webp"><p>${v.metas.customMetadata.level}, ${v.metas.customMetadata.subject}</p><p class="right">By ${v.metas.customMetadata.userName}</p></div>`
            }
        }
    })
    if(document.getElementById('usernotelist').innerHTML==''){
        document.getElementById('usernotelist').innerHTML+=`<p>None yet. Start uploading!</p>`
    }
}
Firebase.listNotes();

const mobile=()=>{
    if(page=='a'){
        document.getElementsByClassName('sidediv')[0].style.width = '100%';
        document.getElementsByClassName('sidediv')[0].style.minWidth = '0';
        document.getElementById('mlogo').style.display = 'block';
    }
}
const desktop=()=>{
    if(page=='a'){
        document.getElementsByClassName('sidediv')[0].style.width = '40%';
        document.getElementsByClassName('sidediv')[0].style.minWidth = '400px';
        document.getElementById('mlogo').style.display = 'none';
    }
}
const mobility=()=>{
    if(window.innerWidth<750){mobile(); isMobile=true;}
    else{desktop(); isMobile=false;}
}
window.addEventListener('change', mobility)
window.addEventListener('resize', mobility)
mobility();