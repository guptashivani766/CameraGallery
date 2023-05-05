//open database
// create objectstore
// make transaction
let db;
let openRequest = indexedDB.open("myDataBase");
// bydefault version -1 rhta hai db ka but hm version bhi change kar sakte hai by using below code.
// let openRequest = indexedDB.open("myDataBase",2);
openRequest.addEventListener("success",(e)=>{
    console.log("db success");
    db = openRequest.result;
})
openRequest.addEventListener("error",(e)=>{
    console.log("db error");
})
openRequest.addEventListener("upgradeneeded",(e)=>{
    console.log("db upgrade and also for initial db creation");
    db = openRequest.result;

    db.createObjectStore("video",{keyPath:"id"});
    db.createObjectStore("image",{keyPath:"id"});
})
