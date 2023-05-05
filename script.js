

let video = document.querySelector("video");
let recordbtnCont = document.querySelector(".record-btn-cont");
let recordbtn = document.querySelector(".record-btn");
let caputurebtnCont = document.querySelector(".capture-btn-cont");
let caputurebtn = document.querySelector(".capture-btn");
let recordflag = false;
let recorder;
let chuncks=[];//media data in chunks
let transparentColor = "transparent";

let constraints ={
    video:true,
    audio:true,
}
// navigator-> global, browser info
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("alert",(e)=>{
        chuncks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chuncks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{
        //conversion of media chunks data to video
        let blob = new Blob(chuncks,{type:"video/mp4"});
        let videoURL = URL.createObjectURL(blob);

        if(db){
            let videoID = shortid();
            let dbTransaction =db.transaction("video","readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry ={
                id:`vid-$videoID`,
                blobData:blob
            }
            videoStore.add(videoEntry);
        }
        // download video
        // let a = document.createElement("a");
        // a.href = videoURL;
        // a.download = "stream.mp4";
        // a.click();
    })
    
})

recordbtnCont.addEventListener("click",(e)=>{
    if(!recordbtn)return;
     recordflag=!recordflag;
     if(recordflag){
        //start
        recorder.start();
        recordbtn.classList.add("scale-record");
        startTimer();
     }
     else{
        //stop
        recorder.stop();
        recordbtn.classList.remove("scale-record");
        stopTimer();
     }
})
//canvas api search on google how to capture image from video in javascript
caputurebtnCont.addEventListener("click",(e)=>{
    caputurebtn.classList.add("scale-capture");
     let canvas = document.createElement("canvas");
     canvas.width = video.videoWidth;
     canvas.height = video.videoHeight;
    //  getContext provide the 2d tools
    let tool = canvas.getContext("2d");
//    draw image canvas mdn 
    tool.drawImage(video,0,0,canvas.width,canvas.height);
//    filtering
     tool.fillStyle = transparentColor;
     tool.fillRect(0,0,canvas.width,canvas.height);
 
// download image
    let imageURL = canvas.toDataURL();

    if(db){
        let imageID = shortid();
        let dbTransaction =db.transaction("image","readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry ={
            id:`img-${imageID}`,
            url:imageURL
        }
        imageStore.add(imageEntry);
    }
    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();

    setTimeout(()=>{
        caputurebtn.classList.remove("scale-capture");
    },500)

})
let timerID;
let counter =0;// represents total seconds
let timer = document.querySelector(".timer");
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        
        // 1hour = 3600 seconds ,3725sec/3600sec - 1hr  -> 3725%3600-> 125
        // 1min = 60seconds ,125sec/60sec - 2min    -> 125%60-> 5
        // 5 sec
        // 01hr:02min:05sec final time
        let totalSeconds = counter;
        let hours = Number.parseInt(counter/3600);
        totalSeconds = totalSeconds%3600;
        let minutes = Number.parseInt(totalSeconds/60);
        totalSeconds = totalSeconds%60;
        let seconds = totalSeconds;
        hours = (hours<10) ?`0${hours}` : hours;
        minutes = (hours<10) ?`0${minutes}` :minutes ;
        seconds = (hours<10) ?`0${seconds}` : seconds;
        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;

    }
    timerID = setInterval(displayTimer,1000);
}
function stopTimer(){

    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display= "none";
}
//filtering logic
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click",(e)=>{
    
        //get
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;

    })
});


