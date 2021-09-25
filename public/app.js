///// User Authentication /////

const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');


const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers

signInBtn.onclick = () => {
    console.log("sfdf");
    auth.signInWithPopup(provider);
};

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if(user){ //signin
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
})

const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingList = document.getElementById('thingList');

let thingsRef; // referense to a database location
let unsubscribe; // turn off realtime stream

auth.onAuthStateChanged(user => {
    if(user) {
        thingsRef = db.collection('things')
        createThing.onclick = () => {
            console.log("add")
            // const {serverTimestamp} = ;
            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        unsubscribe = thingsRef
            .where('uid','==',user.uid)
            .orderBy('createdAt')
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map( doc=> {
                    return `<li>${doc.data().name}</li>`
                });
                thingList.innerHTML = items.join('');
            });

    } else {
        unsubscribe && unsubscribe();
    }
})



