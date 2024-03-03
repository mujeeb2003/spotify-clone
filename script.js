var carditems=document.querySelector("#carditems");

let playlist=document.querySelector("#playlist")
let songs=[];
let currentSong = new Audio();
var cards=``;

const baseUrl = window.location.origin;

// Construct the absolute path to the audio folder
const audioFolder = `${baseUrl}/audio/`
console.log(audioFolder);

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
    console.log("GETCARDS")
    let audiolist= await fetch(`${baseUrl}/playlist/`);
    let response = await audiolist.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let playlists = []
    for (let index = 3; index < as.length; index++) {
        const element = as[index];
        playlists.push(element.href.split(`/playlist/`)[1]);
    }
    // 
    
    for (const playlist of playlists) {
        cards+=` <div id="card">
        <i class="ri-play-circle-line"></i>
        <img src="./playlist_images/${playlist}.jpg" alt="">
        <h1 class="info">${playlist}</h1>
        <p>Have a listen to our newest playlist of ${playlist}</p>
        </div>`;
        
    }
    carditems.innerHTML=cards;
    
    Array.from(document.querySelectorAll("#card")).forEach(e => {
        e.addEventListener("click", async (dets) => {
            let currenttarget=dets.currentTarget;
            
            // get the children of the elem clicked on
            let title=currenttarget.querySelector("h1")
            let img=currenttarget.querySelector("img").src.split("/playlist_images")[1]
            
            let playlistaudio= await fetch(`${baseUrl}/playlist/${title.textContent}`);
            let res = await playlistaudio.text();
            let div = document.createElement("div")
            div.innerHTML = res;
            let as = div.getElementsByTagName("a")
            songs = []
            for (let index = 0; index < as.length; index++) {
                const element = as[index];
                if (element.href.endsWith(".mp3")) {
                    songs.push(element.title)
                    
                }
            }
            
            
            
            // set the card display to none
            carditems.style.display="none"
            let playimg= playlist.querySelector("#image img");
            playimg.attributes.src=`./playlist_images/${img}`;
            // select the ul to display the songs in the playlist
            let listing = playlist.querySelector('#list ul');
            listing.innerHTML = "";
            for (const song of songs) {
                listing.innerHTML = listing.innerHTML + `
                <li><img class="invert" width="34" src="img/music.svg" alt="">
                <div class="info">
                <h3>${song}</h3>
                <h3>From the playlist of ${title.textContent}</h3>
                </div>
                <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
                </div> 
                </li>`;
            }
            
            playlist.style.display="block"
            
            
            Array.from(document.querySelector("#playlist #list ul").getElementsByTagName("li")).forEach(e => {
                
                e.addEventListener("click", element => {
                    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim(),`/playlist/${title.textContent}/`)
                })
            })
            return songs;
        })
    })
}



async function getsongs(){
    console.log("GETCARDS")
    let audiolist= await fetch(`${baseUrl}/audio/`);
    let response = await audiolist.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
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
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim(),'/audio/')
            
        })
    })
    
    return songs;
}

var gpath;
const playMusic = (track,path, pause = false) => {
    
    gpath=path;
    currentSong.src = `.${path}` + track
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
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        let indextoplay=(index-1)%songs.length;
        if(indextoplay<0){
            indextoplay+=songs.length;
        }
        playMusic(songs[indextoplay],gpath)
        
    })
    
    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        var indextoplay=(index+1)%songs.length;
        
        
        playMusic(songs[indextoplay],gpath)
        
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
        
        currentSong.volume = parseInt(e.target.value) / 100
        
    })
    
    
    // check if user is logged in or no
    var retuser= localStorage.getItem('userlogged');
    var navrighth1=document.querySelector("#navright>h1");
    var navrightlogbut=document.querySelector("#navright .login");
    var navrightoutbut=document.querySelector("#navright .logout");
    var cards=document.querySelectorAll("#card");
    var library=document.querySelectorAll(".songslist ul li");
    // 
    
    if(!retuser){
        cards.forEach((elem)=>{
            elem.style.display="none";
        })
        library.forEach((elem)=>{
            elem.style.display="none";
        })
        navrightoutbut.style.display="none";
        
        carditems.textContent="Please Login or register";
        
    }else{
        navrightoutbut.style.display="block";
        navrighth1.style.display="none";
        navrightlogbut.style.display="none";
    }
    
    
}

main();



// navigation code. 

let back=document.querySelector(".back");
back.addEventListener("click",function(){
    carditems.style.display="flex";
    playlist.style.display="none";
})
