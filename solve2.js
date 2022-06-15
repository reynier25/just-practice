let someRanges = [[0, 10, "red"], [2, 12, "blue"], [1, 6, "red"]];
// [[0, 2, "red"], [2, 12, "blue"]]
// [[0, 6, "red"], [6, 12, "blue"]]
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
        processBound(state, leftBoundStateIdx, leftBoundRTA, colorRTA, "left");
        processBound(state, rightBoundStateIdx, rightBoundRTA, colorRTA, "right");
        
        let removeNRectangles = rightBoundStateIdx - leftBoundStateIdx;
        console.log("remove n rectangles", removeNRectangles);
        console.log("lbsidx", leftBoundStateIdx);
        console.log("state before", state);
        state.splice(leftBoundStateIdx, removeNRectangles, RTA);
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
        // console.log("should be null", leftStateRectangle);
        if (leftStateRectangle) {
            let leftStateRectangleColor = leftStateRectangle[2];
            if (leftStateRectangleColor === colorRTA) {
                let mergedRectangle = [leftStateRectangle[0], rightBoundRTA, colorRTA];
                state.splice(curIdx, 2, mergedRectangle);
            }
        }
        if (rightStateRectangle) {
            let rightStateRectangleColor = rightStateRectangle[2];
            if (rightStateRectangleColor === colorRTA) {
                let mergedRectangle = [leftBoundRTA, rightStateRectangle[1], colorRTA];
                state.splice(curIdx, 2, mergedRectangle);
            }
        }
        console.log("state after loop", state);
    }

    return state;
}

function processBound(state, bound, boundRTA, colorRTA, bfoundRectangleSide) {
    // console.log("the bound", bound);
    let bfoundRectangle = state[bound];
    let bfoundRectangleLeftBound = bfoundRectangle[0];
    let bfoundRectangleRightBound = bfoundRectangle[1];
    let bfoundRectangleColor = bfoundRectangle[2];

    if (bfoundRectangleColor !== colorRTA) {
        if (boundRTA === bfoundRectangleLeftBound || boundRTA === bfoundRectangleRightBound) {
            return;
        } else if (boundRTA > bfoundRectangleLeftBound && boundRTA < bfoundRectangleRightBound) {
            if (bfoundRectangleSide === "left") {
                bfoundRectangle[1] = boundRTA;
            } else {
                bfoundRectangle[0] = boundRTA;
            }
            return;
        } else {
            return;
        }
    } else {
        if (boundRTA === bfoundRectangleLeftBound || boundRTA === bfoundRectangleRightBound) {
            return;
        } else if (boundRTA > bfoundRectangleLeftBound && boundRTA < bfoundRectangleRightBound) {
            return;
        } else {
            if (bfoundRectangleSide === "left") {
                bfoundRectangle[0] = boundRTA;
            } else {
                bfoundRectangle[1] = boundRTA;
            }
            return;
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



console.log(solve(someRanges));