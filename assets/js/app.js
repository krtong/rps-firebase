require('dotenv').config();

const firebase = require('firebase');
const inquirer = require('inquirer');
let admin = require('firebase-admin');
let FieldValue = require('firebase-admin').firestore.FieldValue;
// const chalkPipe = require('chalk-pipe')
const axios = require('axios');
const store = {
    user: {
        uid: '',
        name: '',
        username: '',
        textColor: '',
    },
    inGame: false
}
//1. Initialize Firebase
const env = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

// Initialize Firebase
firebase.initializeApp(env);


const startGame = function () {
    const promptList = {
        message: 'Welcome to rock paper scissors',
        type: 'list',
        choices: ['Start'],
        name: 'start'
    };

    inquirer.prompt(promptList).then(() => signUpOrLogIn());
}

startGame()

const signUpOrLogIn = function () {
    const promptList = {
        message: `Would you like to sign up or log in?`,
        type: 'list',
        choices: ['Sign up', 'Log in'],
        name: 'signupOrLogin'
    };

    const cb = function (goto) {
        const next = {
            'Sign up': function () {
                console.log('Lets get you signed up')
                signUp();
            },
            'Log in': function () {
                console.log('lets get you logged in')
                logIn();
            }
        }
        next[goto.signupOrLogin]();
    }

    inquirer.prompt(promptList).then(cb)
}

const signUp = function () {
    const promptList = [{
            message: `please enter the email you'd like to use`,
            type: 'input',
            name: 'email'
        },
        {
            message: `Please enter the password you'd like to use`,
            type: 'password',
            name: 'password'
        }
    ];

    const cb = function (res) {
        const {
            email,
            password
        } = res;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function (response) {
            signUpPartTwo(response.user.uid);
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('oops, there was an error with your sign up')
            console.log(errorCode);
            console.log(errorMessage);
            if (errorCode === 'auth/email-already-in-use') {
                signUpOrLogIn();
            }
        });
    }


    inquirer.prompt(promptList).then(cb)
};

const signUpPartTwo = function (uid) {
    const promptList = [{
            message: 'please enter your name',
            type: 'input',
            name: 'name'
        },
        {
            message: 'please enter your username',
            type: 'input',
            name: 'username'
        },
        {
            message: `What's your favorite color?`,
            type: 'list',
            choices: ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "RebeccaPurple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"],
            name: 'textColor'
        }
    ];

    const cb = function (data) {
        firebase.firestore().collection("users").doc(uid).set(data)
        getUserInformation(uid)
    };

    inquirer.prompt(promptList).then(cb);
}

const logIn = function () {
    inquirer
        .prompt([{
            message: 'Please enter the email associated with your account',
            type: 'input',
            name: 'email'
        }, {
            message: ' Please enter your password associated with your account',
            type: 'password',
            name: 'password'
        }]).then(function (res) {
            firebase.auth().signInWithEmailAndPassword(res.email, res.password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(`oops, it looks like there was an error. (${errorCode})`);
                console.log(`error message: ${errorMessage}`);
                signUpOrLogIn();
                // ...
            }).then(function (res) {
                // console.log('whatever', res.user.uid, 'whatever-end');
                //set userinfomration locally
                getUserInformation(res.user.uid);
            });
        });
};

const getUserInformation = function (uid) {
    const docRef = firebase.firestore().collection("users").doc(uid);
    const cb = doc => {
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            userInformation = doc.data();
            console.log(`Welcome back ${userInformation.name}!`);

            store.user = {
                uid,
                name: userInformation.name,
                textColor: userInformation.textColor,
                username: userInformation.username
            }


            createOrJoinGame()
        };
    };
    const errCB = err => console.log('Error getting document', err);

    let getDoc = docRef.get().then(cb).catch(errCB);
}


const createOrJoinGame = function () {
    const promptList = [{
        message: 'Would you like to create a game or join an existing game?',
        type: 'list',
        choices: ['Create', 'Join'],
        name: 'choice'
    }];

    const cb = res => res.choice === 'Create' ? createGame() : joinGame();

    inquirer.prompt(promptList).then(cb);
};

const createGame = () => {

    console.log(`Let's create a new game.`)
    const promptList = [{
        message: 'Name your game lobby',
        type: 'input',
        name: 'lobbyName'
    }, {
        message: 'How many people do you want in your game?',
        type: 'number',
        name: 'numberOfPlayers'
    }];
    //this is shit for multiplayers across diff timezones
    const date = JSON.stringify(new Date())
    const cb = res => {
        [res.lobbyName, res.numberOfPlayers, store.user.name,store.user.textColor,store.user.username].forEach((a, i) => console.log(i, a))
        firebase.firestore().collection('games').add({
            lobbyName: res.lobbyName,
            maxPlayers: res.numberOfPlayers,
            playerList: [{
                name: store.user.name,
                textColor: store.user.textColor,
                username: store.user.username
            }],
            timeStarted: date,
        })
    }

    inquirer.prompt(promptList).then(cb).catch(err => console.log("226:", err));
};

const joinGame = () => {
    console.log('--------------------------------------------------')
    let idx = 0;
    const lobbyList = [];
    const gameIdArr = [];
    const cbHellLvl1 = games => {
        if (games.empty) {
            console.log('There are no games available');
        } else {
            console.log('')
            
            games.forEach(game => {
                const data = game.data()
                let lobbyName = data.lobbyName;
                let username = data.playerList[0].username;
                const resizeName = (str, max) => str.length > max ? str.split('').slice(0, max).join('') : str += Array(max - str.length).fill('.').join('');
                const maxPlayers = data.maxPlayers;
                const playersInLobby = data.playerList.length;
                const lobbyNameLength = lobbyName.length
                const gameString = `|.${++idx}.|.${resizeName(lobbyName, 40)}.|.${resizeName(username, 20)}.|.${playersInLobby}/${maxPlayers}.|`;
                gameIdArr.push(game.id);
                lobbyList.push(gameString)
            });

            cbHellLvl2(lobbyList);
        };
    };

    const cbHellLvl2 = (choices) => {
        console.log('Currently available games:');
        console.log('  _____________________________________________________________________________');
        const promptList = [{
            message: '|.#.|.Game.Name................................|.Created.By...........|.....|',
            type: 'list',
            choices,
            name: 'gameChoice'
        }];
        inquirer.prompt(promptList).then(cbHellLvl3);
    };

    const cbHellLvl3 = res => {
        console.log('3');
        cbHellLvl4(res.gameChoice);
    };

    const cbHellLvl4 = (choice) => {
        let idx = lobbyList.indexOf(choice)
        console.log('game lobby doc id=', gameIdArr[idx])
        console.log('idk yet lol.')
    };

    firebase.firestore().collection('games').get().then(cbHellLvl1).catch(err => console.log(err));
};



class RockPaperScissors {
    constructor(userId) {
        if (userId !== null) {
            this.userId = userId
        } else {
            this
        }
    };

    methodOne() {};
    methodTwo() {};
}