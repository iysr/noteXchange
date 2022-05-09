let isloggedin = false;
const subjlevels = {"Additional Mathematics":["Sec 3", "Sec 4", "Sec 5"],
"Biology":["Sec 3, Sec 4", "Sec 5", "H1", 'H2' ,'H3'],
"Chemistry":['Sec 3', 'Sec 4', "Sec 5", 'H1', 'H2',"H3"],
"China Studies in Chinese":['Sec 3','Sec 4','H2'],
"China Studies in English":["H2"],
"Chinese":["Pri 1", "Pri 2","Pri 3","Pri 4","Pri 5","Pri 6","Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H1"],
"Higher Chinese":["Pri 5","Pri 6","Sec 1","Sec 2","Sec 3","Sec 4","Sec 5"],
"Computing":["Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H2"],
"Economics":["Sec 3","Sec 4","Sec 5","H2"],
"English":["Pri 1", "Pri 2","Pri 3","Pri 4","Pri 5","Pri 6","Sec 1","Sec 2","Sec 3","Sec 4","Sec 5"],
"Further Mathematics":["H2"],
"General Paper":["H1"],
"General Studies in Chinese":["H1"],
"Geography":["Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H1","H2","H3"],
"History":["Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H1","H2","H3"],
"Knowledge & Inquiry":["H2"],
"Literature (Chinese)":["Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H2","H3"],
"Literature (English)":["Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H2","H3"],
"Literature (Malay)":["Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H2","H3"],
"Literature (Tamil)":["Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H2","H3"],
"Malay":["Pri 1", "Pri 2","Pri 3","Pri 4","Pri 5","Pri 6","Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H1"],
"Higher Malay":["Pri 5","Pri 6","Sec 1","Sec 2","Sec 3","Sec 4","Sec 5"],
"Mathematics":["Pri 1", "Pri 2","Pri 3","Pri 4","Pri 5","Pri 6","Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H1","H2","H3"],
"Physics":['Sec 3', 'Sec 4', "Sec 5", 'H1', 'H2',"H3"],
"Science":["Pri 1", "Pri 2","Pri 3","Pri 4","Pri 5","Pri 6","Sec 1","Sec 2"],
"Social Studies":['Sec 3', 'Sec 4', "Sec 5"],
"Tamil":["Pri 1", "Pri 2","Pri 3","Pri 4","Pri 5","Pri 6","Sec 1","Sec 2","Sec 3","Sec 4","Sec 5","H1"],
"Higher Tamil":["Pri 5","Pri 6","Sec 1","Sec 2","Sec 3","Sec 4","Sec 5"],
"Translation":["H2"],
"3rd Language (Arabic)":["Sec 1","Sec 2","Sec 3","Sec 4","H1","H2"],
"3rd Language (French)":["Sec 1","Sec 2","Sec 3","Sec 4","H1","H2"],
"3rd Language (German)":["Sec 1","Sec 2","Sec 3","Sec 4","H1","H2"],
"3rd Language (Japanese)":["Sec 1","Sec 2","Sec 3","Sec 4","H1","H2"],
"3rd Language (Malay)":["Sec 1","Sec 2","Sec 3","Sec 4","H1","H2"]
}

//Pages
const authpage=()=>{
    document.getElementById('authpage').style.display='block';
}
const signuppage=()=>{
    document.getElementsByClassName('autha')[0].classList.add('highlight');
    document.getElementsByClassName('autha')[1].classList.remove('highlight');
    document.getElementsByClassName('submit')[0].setAttribute('id',"su");
    document.getElementsByClassName('submit')[0].value = 'Sign Up';
    document.getElementById('prdiv').style.display = 'none';
}
const signinpage=()=>{
    document.getElementsByClassName('autha')[1].classList.add('highlight');
    document.getElementsByClassName('autha')[0].classList.remove('highlight');
    document.getElementsByClassName('submit')[0].setAttribute('id',"li");
    document.getElementsByClassName('submit')[0].value = 'Log In';
    document.getElementById('prdiv').style.display = 'block';
}
signinpage()
const loadsubjs=()=>{
    document.getElementById('upsubject').innerHTML = `<option value="" disabled selected>Select</option>`
    Object.keys(subjlevels).forEach((i)=>{
        document.getElementById('upsubject').innerHTML+=`<option value="${i}">${i}</option>`
    })
}
const openside=()=>{
    document.getElementById('sidebarcontainer').style.width = '100%';
    document.getElementById('sidebar').style.width = '300px';
    document.getElementById('sidebar').style.padding='20px';
}
const closeside=()=>{
    document.getElementById('sidebarcontainer').style.width = '0';
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('sidebar').style.padding='0';
}
const searchbar=()=> {
    document.getElementById('noteslist').style.display = 'block'
    document.getElementById('nonsearch').style.display = 'none'
    document.querySelector('#searchholder .closer').style.display = 'block';

        let filter, ul, li, a,b, i, txtValue,txttwo, txtthree;
        filter = document.getElementById('searchbar').value.toUpperCase();
        ul = document.getElementById("noteslist");
        li = ul.getElementsByTagName('div');
  
        for (i = 0; i < li.length; i++) {
            a=li[i].getElementsByTagName("p")[0];
            b=li[i].getElementsByTagName("p")[1];
            c=li[i].getElementsByTagName('h2')[0]
            txtValue = a.textContent || a.innerText;
            txttwo = b.textContent || b.innerText
            txtthree = c.textContent || c.innerText
            if (txtValue.toUpperCase().indexOf(filter) > -1||txttwo.toUpperCase().indexOf(filter)>-1||txtthree.toUpperCase().indexOf(filter)>-1) {
                li[i].style.display = "inline-block";
            } else {
                li[i].style.display = "none";
            }
        }
}
const endsearch=()=>{
    document.getElementById('noteslist').style.display = 'none'
    document.getElementById('nonsearch').style.display = 'block'
    document.querySelector('#searchholder .closer').style.display = 'none';
    document.getElementById('searchbar').value=''
}
const keyword=(x)=>{
    document.getElementById('searchbar').value = x;
    searchbar()
}
document.getElementById('upsubject').addEventListener('change',()=>{
    val = document.getElementById('upsubject').value;
    document.getElementById('uplevel').innerHTML='';
    subjlevels[val].forEach((i)=>{
        document.getElementById('uplevel').innerHTML += `<option value="${i}">${i}</option>`;
    })
})
document.getElementById('notesupload').addEventListener('change',()=>{
    document.getElementById('filename').innerHTML=document.getElementById('notesupload').files[0].name
})
document.getElementById('searchbar').addEventListener('keypress', searchbar)