//added the defer keyword to my script tag, to avoid script pre-loading problems


///////////////////////////////////////
//PROGRAM NAME:
//PROGRAM BY
///////////////////////////////////////


//GLOBAL DATA SETS


const gVals = {



}



// CLASSES





//FUNCTIONS DEFINITIONS

const myFuncs = {

    //////////////////////
    //random number function
    //by Alex Merced
    ////////////////////////
    randNum: (num) => {

        return Math.floor(Math.random()*(num+1));

    },

    ///////////////////
    //random number in a range function
    //by Alex Merced
    ///////////////////

    randRange: (floor,ceiling) => {
        let num = 0;
        while(num < floor || num > ceiling){
            num = randNum(ceiling);

        }
        return num;
    }
}


//DOM VARIABLES

const domVals = {



}



//EVENT LISTENERS






//THE PROGRAM
