var carditems=document.querySelector("#carditems");
let currentSong = new Audio();
var cards=``;
const basepath= window.location.origin + window.location.pathname.split('/')[0];
console.log("Base path : "+basepath)


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getCards(){
    console.log(`${basepath}/audio/`)
    let audiolist= await fetch(`${basepath}/audio/`);
    let response = await audiolist.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/audio/`)[1])
        }
    }
    
    
    for (const song of songs) {
        cards+=` <div id="card">
        <i class="ri-play-circle-line"></i>
        <img src="album.avif" alt="">
        <h1 class="info">${song.replaceAll("%20", " ")}</h1>
        <p>Surah from Quran</p>
        </div>`;
        
    }
    carditems.innerHTML=cards;
    
    Array.from(document.querySelectorAll("#card")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").innerHTML)
            
        })
    })
}



async function getsongs(){
    let audiolist= await fetch(`${basepath}/audio/`);
    let response = await audiolist.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/audio/`)[1])
        }
    }
    
    let songlist = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songlist.innerHTML = "";
    for (const song of songs) {
        songlist.innerHTML = songlist.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt="">
        <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        <div>Quran</div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="img/play.svg" alt="">
        </div> </li>`;
    }
    
    
    
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            
        })
    })
    return songs;
}


const playMusic = (track, pause = false) => {
    console.log(track);
    currentSong.src = `./audio/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    
    document.querySelector(".playbar").style.height="17%";
    document.querySelector(".playbar").style.display="flex";
    
}

function logout(){
    localStorage.removeItem('userlogged')
}



async function main(){
    await getsongs();
    playMusic(songs[0],true);
    await getCards();
    
    let play=document.querySelector("#play");
    let prev=document.querySelector("#previous");
    let next=document.querySelector("#next");
    
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    
    prev.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        let indextoplay=(index-1)%songs.length;
        if(indextoplay<0){
            indextoplay+=songs.length;
            console.log("index to play:"+indextoplay)
        }
        console.log(indextoplay);
        playMusic(songs[indextoplay])
        
    })
    
    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        var indextoplay=(index+1)%songs.length;
        
        console.log(indextoplay);
        playMusic(songs[indextoplay])
        
    })
    
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    
    document.querySelector("#close").addEventListener('click',()=>{
        currentSong.currentTime = 0 / 100;
        currentSong.pause()
        play.src = "img/play.svg"
        document.querySelector(".playbar").style.height="10%";
        document.querySelector(".playbar").style.display="none";
    })
    
    // sound range.
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        
    })
    
    
    // check if user is logged in or no
    var retuser= localStorage.getItem('userlogged');
    var navrighth1=document.querySelector("#navright>h1");
    var navrightlogbut=document.querySelector("#navright .login");
    var navrightoutbut=document.querySelector("#navright .logout");
    var cards=document.querySelectorAll("#card");
    var library=document.querySelectorAll(".songslist ul li");
    // console.log(library)
    
    if(!retuser){
        cards.forEach((elem)=>{
            elem.style.display="none";
        })
        library.forEach((elem)=>{
            elem.style.display="none";
        })
        navrightoutbut.style.display="none";
        
        carditems.textContent="Please Login or register";
        console.log(cards,navright)
    }else{
        navrightoutbut.style.display="block";
        navrighth1.style.display="none";
        navrightlogbut.style.display="none";
    }
    
    
}

main();




// navigation code. 

