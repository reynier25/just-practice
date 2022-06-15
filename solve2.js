let someRanges = [[0, 10, "red"], [2, 12, "blue"], [1, 6, "red"], [20, 30, "magenta"], [3, 18, "red"], [5, 15, "blue"]];
// [[0, 10, "red"]]
// [[0, 2, "red"], [2, 12, "blue"]]
// [[0, 6, "red"], [6, 12, "blue"]]
// [[0, 6, "red"], [6, 12, "blue"], [20, 30, "magenta"]]
// [[0, 22, "red"], [22, 30, "magenta"]]
// expect: [[0, 5, "red"], [5, 15, "blue"], [15, 22, "red"], [22, 30, "magenta"]]
// actual: [ [ 0, 5, 'red' ], [ 5, 15, 'blue' ], [ 22, 30, 'magenta' ] ]

let ranges2 = [[2, 10, "red"], [4, 8, "blue"]];

/*

*/

function solve(ranges) {
    const state = [ranges[0]];

    for (let i = 1; i < ranges.length; i++) {
        let RTA = ranges[i];            // RTA = "rectangle to add"
        const leftBoundRTA = RTA[0];
        const rightBoundRTA = RTA[1];
        const colorRTA = RTA[2];
        
        // let leftSpliceIdx = null;
        // let rightSpliceIdx = null;
        const findBounds = bsearch(state, leftBoundRTA, rightBoundRTA);
        const [leftBoundStateIdx, rightBoundStateIdx] = [findBounds[0], findBounds[1]];

        //splice in RTA, resize other rectangles, merge where needed etc.
        processBounds(state, leftBoundStateIdx, rightBoundStateIdx, leftBoundRTA, rightBoundRTA, colorRTA);

        // console.log("state after processing", state);
        
        let removeNRectangles = rightBoundStateIdx - leftBoundStateIdx - 1;
        if (removeNRectangles < 0) removeNRectangles = 0;
        // console.log("remove n rectangles", removeNRectangles);
        // console.log("lbsidx", leftBoundStateIdx);
        // console.log("rbsidx", rightBoundStateIdx);
        console.log("state before", state);
        state.splice(leftBoundStateIdx+1, removeNRectangles, RTA);
        console.log("state after", state);

        //final step (?) check rectangles to immediate left and right for mergeability (same color)
        let leftStateRectangle = null;
        let rightStateRectangle = null;
        let curIdx = leftBoundStateIdx + 1;
        if (curIdx - 1 >= 0) {
            leftStateRectangle = state[curIdx - 1];
        }
        if (curIdx + 1 < state.length) {
            rightStateRectangle = state[curIdx + 1]
        }
        // console.log("should be 0, 2", leftStateRectangle);
        if (leftStateRectangle) {
            let leftStateRectangleColor = leftStateRectangle[2];
            if (leftStateRectangleColor === colorRTA) {
                let mergedRectangle = [leftStateRectangle[0], state[curIdx][1], colorRTA];
                state.splice(curIdx - 1, 2, mergedRectangle);
                curIdx--;
            }
        }
        if (rightStateRectangle) {
            let rightStateRectangleColor = rightStateRectangle[2];
            if (rightStateRectangleColor === colorRTA) {
                let mergedRectangle = [state[curIdx][0], rightStateRectangle[1], colorRTA];
                state.splice(curIdx, 2, mergedRectangle);
            }
        }
        console.log("state after loop", state);
    }

    return state;
}

function processBounds(state, leftRectangleStateIdx, rightRectangleStateIdx, leftBoundRTA, rightBoundRTA, colorRTA) {
    // console.log("the bound", bound);
    let leftRectangle = state[leftRectangleStateIdx];
    let leftRectangleLeftBound = leftRectangle[0];
    let leftRectangleRightBound = leftRectangle[1];
    let leftRectangleColor = leftRectangle[2];

    let rightRectangle = state[rightRectangleStateIdx];
    let rightRectangleLeftBound = rightRectangle[0];
    let rightRectangleRightBound = rightRectangle[1];
    let rightRectangleColor = rightRectangle[2];

    let leftContained = leftBoundRTA > leftRectangleLeftBound && leftBoundRTA < leftRectangleRightBound;
    let rightContained = rightBoundRTA > rightRectangleLeftBound && rightBoundRTA < rightRectangleRightBound;
    let leftOverlapsLeft = leftBoundRTA === leftRectangleLeftBound;
    let leftOverlapsRight = leftBoundRTA === leftRectangleRightBound;
    let rightOverlapsLeft = rightBoundRTA === rightRectangleLeftBound;
    let rightOverlapsRight = rightBoundRTA === rightRectangleRightBound;
    
    let threeSameColor = leftRectangleColor && rightRectangleColor && colorRTA;
    let inSameRectangle = leftRectangleStateIdx === rightRectangleStateIdx;

    if (inSameRectangle && leftContained && rightContained && threeSameColor) {
        let newLeftRectangle = [leftRectangleLeftBound, leftBoundRTA, colorRTA];
        let centerRectangle = [leftBoundRTA, rightBoundRTA, colorRTA];
        let newRightRectangle = [rightBoundRTA, rightRectangleRightBound, colorRTA];
        state.splice(leftRectangleStateIdx, 1, centerRectangle);
        state.splice(leftRectangleStateIdx, 0, newLeftRectangle);
        state.splice(leftRectangleStateIdx + 1, 0, newRightRectangle);
        return;
    } 

    //set up precise splice index and count
    let spliceStartIdx;
    let spliceEndIdx;
    let value;
    let rectanglesToSpliceOut = rightRectangleStateIdx - leftRectangleStateIdx - 1;
    //cases:
    //leftBoundRTA === leftRectangleLeftBound: startIdx is leftRectangleStateIdx, value is [leftBoundRTA, rightBoundRTA, colorRTA]
    //leftBoundRTA === leftRectangleRightBound: startIdx is leftRectangleStateIdx+1
    //rightBoundRTA === rightRectangleRightBound: endIdx is rightRectangleStateIdx
    //rightBoundRTA === rightRectangleLeftBound: endIdx is rightRectangleStateIdx-1
    //handle endIdx = -1 edge case: unshift into state
    //handle startIdx = state.length: push into state
    //leftBoundRTA > leftRectangleLeftBound (in between): startIdx is leftRectangleStateIdx+1
    //leftBoundRTA < leftRectangleLeftBound (to the left): startIdx is leftRectangleStateIdx
    //rightBoundRTA < rightRectangleLeftBound: endIdx is rightRectangleStateIdx
    //rightBoundRTA > rightRectangleLeftBound: endIdx is rightRectangleStateIdx+1

    

    //left
    if (leftRectangleColor !== colorRTA) {
        if (leftBoundRTA === leftRectangleLeftBound) {
            //max rectangles we could add: 1
            //min: delete many

        } else if (leftBoundRTA === leftRectangleRightBound) {
            //max: 1
            //min: delete many
        } else if (leftBoundRTA > leftRectangleLeftBound && leftBoundRTA < leftRectangleRightBound) {
            // leftContained = true;
            //max: 2
            //min: delete many
        } else if (leftBoundRTA < leftRectangleLeftBound) {
            //max: 1
            //min: delete many
        } else if (leftBoundRTA > leftRectangleRightBound) {
            //max: 1
            //min: delete many
        }
    } else {
        if (leftBoundRTA === leftRectangleLeftBound) {

        } else if (leftBoundRTA === leftRectangleRightBound) {

        } else if (leftBoundRTA > leftRectangleLeftBound && leftBoundRTA < leftRectangleRightBound) {
            leftContained = true;

        } else if (leftBoundRTA < leftRectangleLeftBound) {

        } else if (leftBoundRTA > leftRectangleRightBound) {
            
        }
    }

    //right
    if (rightRectangleColor !== colorRTA) {
        if (rightBoundRTA === rightRectangleLeftBound) {

        } else if (rightBoundRTA === rightRectangleRightBound) {

        } else if (rightBoundRTA > rightRectangleLeftBound && rightBoundRTA < rightRectangleRightBound) {
            rightContained = true;

        } else if (rightBoundRTA < rightRectangleLeftBound) {

        } else if (rightBoundRTA > rightRectangleRightBound) {

        }
    } else {
        if (rightBoundRTA === rightRectangleLeftBound) {

        } else if (rightBoundRTA === rightRectangleRightBound) {

        } else if (rightBoundRTA > rightRectangleLeftBound && rightBoundRTA < rightRectangleRightBound) {
            rightContained = true;

        } else if (rightBoundRTA < rightRectangleLeftBound) {

        } else if (rightBoundRTA > rightRectangleRightBound) {
            
        }
    }

}

function bsearch(state, leftTarget, rightTarget) {
    let bounds = [];
    bounds.push(bsearchTarget(state, leftTarget));
    bounds.push(bsearchTarget(state, rightTarget));
    return bounds;
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
    if (searchIdx === -1) searchIdx = 0;
    if (searchIdx === state.length) searchIdx = state.length - 1;
    return searchIdx;
}



console.log(solve(ranges2));