let ranges = [[0, 10, "red"], [2, 12, "blue"], [1, 6, "red"]];
// [[0, 2, "red"], [2, 12, "blue"]]

/*

*/

function solve(ranges) {
    const state = [ranges[0]];

    for (let i = 1; i < ranges.length; i++) {
        let RTA = ranges[i];
        const leftBoundRTA = range[0];      // RTA = "rectangle to add"
        const rightBoundRTA = range[1];
        const colorRTA = range[2];
        
        // let leftSpliceIdx = null;
        // let rightSpliceIdx = null;
        const [leftBound, rightBound] = [bsearch(state, leftBoundRTA, rightBoundRTA)[0]];


    }

    return state;
}

function bsearch(state, leftTarget, rightTarget) {
    // let idx = null;
    let range = [];

    let leftPointer = 0;
    let rightPointer = state.length - 1;
    let lSearchIdx = Math.floor((leftPointer+rightPointer) / 2);
    while (leftPointer <= rightPointer) {
        lSearchIdx = Math.floor((leftPointer+rightPointer) / 2);
        let rectangle = state[lSearchIdx];
        let leftBoundRectangle = rectangle[0];
        let rightBoundRectangle = rectangle[1];

        if (leftBoundRectangle <= leftTarget && rightBoundRectangle >= leftTarget) {
            range.push(lSearchIdx);
            break;
        } else if (leftBoundRectangle > leftTarget) {
            rightPointer = lSearchIdx - 1;
        } else {
            //bsearch right side
            leftPointer = lSearchIdx + 1;
        }
    }

    if (range.length === 0) {
        range.push(lSearchIdx);
    }

    //same for right
    let leftPointer1 = 0;
    let rightPointer1 = state.length - 1;
    let rSearchIdx = Math.floor((leftPointer1+rightPointer1) / 2);
    while (leftPointer1 <= rightPointer1) {
        rSearchIdx = Math.floor((leftPointer1+rightPointer1) / 2);
        let rectangle = state[rSearchIdx];
        let leftBoundRectangle = rectangle[0];
        let rightBoundRectangle = rectangle[1];

        if (leftBoundRectangle <= rightTarget && rightBoundRectangle >= rightTarget) {
            range.push(rSearchIdx);
            break;
        } else if (leftBoundRectangle > rightTarget) {
            rightPointer1 = rSearchIdx - 1;
        } else {
            //bsearch right side
            leftPointer1 = rSearchIdx + 1;
        }
    }

    if (range.length === 1) {
        range.push(rSearchIdx);
    }

    return range;
}


function bsearchTarget(state, target) {
    let leftPointer = 0;
    let rightPointer = state.length - 1;
    let searchIdx = Math.floor((leftPointer+rightPointer) / 2);
    while (leftPointer <= rightPointer) {
        let rectangle = state[searchIdx];
        let leftBoundRectangle = rectangle[0];
        let rightBoundRectangle = rectangle[1];

        if (leftBoundRectangle <= target && rightBoundRectangle >= target) {
            return searchIdx;
        } else if (leftBoundRectangle > target) {
            rightPointer = searchIdx - 1;
            searchIdx = Math.floor((leftPointer+rightPointer) / 2);
        } else {
            //bsearch right side
            leftPointer = searchIdx + 1;
            searchIdx = Math.floor((leftPointer+rightPointer) / 2);
        }
    }
    return searchIdx;
}


// const [pizza, cheese] = ["dog", "cat"];
// console.log(cheese);