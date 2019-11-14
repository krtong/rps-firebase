//1. Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyBI3UFKvQpsDMDmueXJskZoK2xH8OA91lY",
    authDomain: "rock-paper-scissors-d0f6c.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-d0f6c.firebaseio.com",
    projectId: "rock-paper-scissors-d0f6c",
    storageBucket: "rock-paper-scissors-d0f6c.appspot.com",
    messagingSenderId: "952999732077",
    appId: "1:952999732077:web:1480680bc6b66aa4da7064"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//2. Misc global functions
let $main = $("#add-shit-here");
let rockOutline = `<i class="far fa-hand-rock"></i>`;
let rockSolid = `<i class="fas fa-hand-rock"></i>`;
const centerDiv = function createJumboTronInCenterOfWindow(html){
   return ` <div class="container h-100">
                <div class="row align-items-center h-100">
                    <div class="col-6 mx-auto">
                        <div class="jumbotron text-center">
                            ${html}
                         </div>
                    </div>
                </div>
            </div>`;
};


//Components: Start screen----------------------------------------
const startButton =  `
<h1 class="display-4">Rock Paper Scissors</h1>
<p class="lead">Press start to continue.</p>
<p class="lead">
    <a class="btn btn-primary btn-lg" href="#" role="button">Start</a>
</p>`;


$main.html(centerDiv(startButton));

//Start Button Clicked => Select Character Page

const createNewChar = function() {
    
return html`
<div class="card">
    <h5 class="card-header">No Character Found</h5>
    <div class="card-body">
        <h5 class="card-title">Create A Character</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
</div>
`}


$("#start").on("click", function () {
    let users = localStorage.getItem('Users');
    console.log(users)
    if (!users) {
        $main.html(centerDiv(createNewChar))
    } else {
        $main.html(centerDiv(welcomeBack))

    }
})