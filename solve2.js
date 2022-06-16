const someRanges = [[0, 10, "red"], [2, 12, "blue"], [1, 6, "red"], [20, 30, "magenta"], [3, 22, "red"], [5, 15, "blue"]];
const someRanges2 = [[0, 10, "red"], [2, 12, "blue"], [1, 6, "red"], [20, 30, "magenta"], [3, 18, "red"], [5, 15, "blue"]];
const someRanges3 = [[0, 10, "red"], [2, 12, "blue"], [1, 6, "red"], [20, 30, "magenta"], [3, 18, "red"], [5, 15, "blue"], [40, 45, "teal"], [33, 36, "black"]];
const someRanges4 = [[5, 8, "red"], [2, 4, "blue"], [1, 6, "black"]];

// some test cases, all pass:
console.log(solve(someRanges));
console.log(solve(someRanges2));
console.log(solve(someRanges3));
console.log(solve(someRanges4));


// the console.log on line 78 prints the state after each loop through the testcase array, to show how the state mutates as each rectangle is added.

// someRanges
// [[0, 10, "red"]]                                         process [2, 12, "blue"]
// [[0, 2, "red"], [2, 12, "blue"]]                         process [1, 6, "red"]
// [[0, 6, "red"], [6, 12, "blue"]]                         process [20, 30, "magenta"]
// [[0, 6, "red"], [6, 12, "blue"], [20, 30, "magenta"]]    process [3, 22, "red"]
// [[0, 22, "red"], [22, 30, "magenta"]]                    process [5, 15, "blue"]
// expect: [[0, 5, "red"], [5, 15, "blue"], [15, 22, "red"], [22, 30, "magenta"]]

//someRanges2
// [[0, 10, "red"]]                                         process [2, 12, "blue"]
// [[0, 2, "red"], [2, 12, "blue"]]                         process [1, 6, "red"]
// [[0, 6, "red"], [6, 12, "blue"]]                         process [20, 30, "magenta"]
// [[0, 6, "red"], [6, 12, "blue"], [20, 30, "magenta"]]    process [3, 18, "red"]
// [[0, 18, "red"], [20, 30, "magenta"]]                    process [5, 15, "blue"]
// expect: [[0, 5, "red"], [5, 15, "blue"], [15, 18, "red"], [20, 30, "magenta"]]

//someRanges3
//same as someRanges3, but continue:
// [[0, 5, "red"], [5, 15, "blue"], [15, 18, "red"], [20, 30, "magenta"]]                       process [40, 45, "teal"]
// [[0, 5, "red"], [5, 15, "blue"], [15, 18, "red"], [20, 30, "magenta"], [40, 45, "teal"]]     process [33, 36, "black"]
// expect: [[0, 5, "red"], [5, 15, "blue"], [15, 18, "red"], [20, 30, "magenta"], [33, 36, "black"], [40, 45, "teal"]]

/*

*/

function solve(ranges) {
    const state = [ranges[0]];

    for (let i = 1; i < ranges.length; i++) {
        const RTA = ranges[i];            // RTA = "rectangle to add"
        const leftBoundRTA = RTA[0];
        const rightBoundRTA = RTA[1];
        const colorRTA = RTA[2];
        
        const findBounds = bsearch(state, leftBoundRTA, rightBoundRTA);
        const [leftBoundStateIdx, rightBoundStateIdx] = [findBounds[0], findBounds[1]];

        // variable armageddon
        let idx = processBounds(state, leftBoundStateIdx, rightBoundStateIdx, leftBoundRTA, rightBoundRTA, colorRTA);
        // processBounds returns the index of the rectangle we added to state. we use this index below to check either side for mergeable rectangles.
        // only the immediate left and right rectangles need to be checked.
        // console.log("immediately after processBounds", state);

        //final step (?) check rectangles to immediate left and right for mergeability (same color)
        const leftStateRectangle = idx - 1 >= 0 ? state[idx - 1] : null;
        const rightStateRectangle = idx + 1 < state.length ? state[idx + 1] : null;

        if (leftStateRectangle) {
            const leftStateRectangleColor = leftStateRectangle[2];
            if (leftStateRectangleColor === colorRTA) {
                const mergedRectangle = [leftStateRectangle[0], state[idx][1], colorRTA];
                state.splice(idx - 1, 2, mergedRectangle);
                idx--;
            }
        }
        if (rightStateRectangle) {
            const rightStateRectangleColor = rightStateRectangle[2];
            if (rightStateRectangleColor === colorRTA) {
                const mergedRectangle = [state[idx][0], rightStateRectangle[1], colorRTA];
                state.splice(idx, 2, mergedRectangle);
            }
        }
        // console.log("state after loop:", state);
    }

    return state;
}

function processBounds(state, leftRectangleStateIdx, rightRectangleStateIdx, leftBoundRTA, rightBoundRTA, colorRTA) {
    const leftRectangle = state[leftRectangleStateIdx];
    const leftRectangleLeftBound = leftRectangle[0];
    const leftRectangleRightBound = leftRectangle[1];
    const leftRectangleColor = leftRectangle[2];

    const rightRectangle = state[rightRectangleStateIdx];
    const rightRectangleLeftBound = rightRectangle[0];
    const rightRectangleRightBound = rightRectangle[1];
    const rightRectangleColor = rightRectangle[2];

    const leftContained = leftBoundRTA > leftRectangleLeftBound && leftBoundRTA < leftRectangleRightBound;
    const rightContained = rightBoundRTA > rightRectangleLeftBound && rightBoundRTA < rightRectangleRightBound;
    
    const threeSameColor = leftRectangleColor && rightRectangleColor && colorRTA;
    const inSameRectangle = leftRectangleStateIdx === rightRectangleStateIdx;

    // this is for when a rectangle is added and is enveloped by a rectangle (different color of course) and total rectangle count increments by 2
    // handled this as a special case, can maybe try to refactor this away
    if (inSameRectangle && leftContained && rightContained && threeSameColor) {
        // console.log("in here");
        const newLeftRectangle = [leftRectangleLeftBound, leftBoundRTA, leftRectangleColor];
        const centerRectangle = [leftBoundRTA, rightBoundRTA, colorRTA];
        const newRightRectangle = [rightBoundRTA, rightRectangleRightBound, rightRectangleColor];
        // console.log("init state", state);
        state.splice(leftRectangleStateIdx, 1, centerRectangle);
        state.splice(leftRectangleStateIdx, 0, newLeftRectangle);
        state.splice(leftRectangleStateIdx + 2, 0, newRightRectangle);
        // console.log("result state", state);
        return leftRectangleStateIdx+1;
    } 

    //set up for precise splice index and count
    let spliceStartIdx;
    let spliceEndIdx;
    const value = [leftBoundRTA, rightBoundRTA, colorRTA];

    //cases:
    //leftBoundRTA === leftRectangleLeftBound: startIdx is leftRectangleStateIdx
    //leftBoundRTA === leftRectangleRightBound: startIdx is leftRectangleStateIdx+1
    //rightBoundRTA === rightRectangleRightBound: endIdx is rightRectangleStateIdx
    //rightBoundRTA === rightRectangleLeftBound: endIdx is rightRectangleStateIdx-1
    //handle endIdx = -1 edge case: unshift into state
    //handle startIdx = state.length: push into state
    //leftBoundRTA > leftRectangleLeftBound && < leftRectangleRightBound (in between): startIdx is leftRectangleStateIdx+1
    //leftBoundRTA < leftRectangleLeftBound (to the left): startIdx is leftRectangleStateIdx
    //leftBoundRTA > leftRectangleLeftBound (to the right): startIdx is leftRectangleStateIdx+1
    //rightBoundRTA < rightRectangleRightBound && > rightRectangleLefttBound: endIdx is rightRectangleStateIdx
    //rightBoundRTA > rightRectangleRightBound (to the right): endIdx is rightRectangleStateIdx+1
    //rightBoundRTA < rightRectangleRightBound (to the left): endIdx is rightRectangleStateIdx-1

    // general note: asymmetry in how splice treats extreme left and right; splicing at an index outside array bounds to the left (-1) will error.
    // splicing at an index outside array bounds to the right will not error, will behave exactly as .push.

    if (leftBoundRTA === leftRectangleLeftBound) {
        spliceStartIdx = leftRectangleStateIdx;
    } else if (leftBoundRTA === leftRectangleRightBound) {
        spliceStartIdx = leftRectangleStateIdx+1;
    } else if (leftBoundRTA > leftRectangleLeftBound && leftBoundRTA < leftRectangleRightBound) {
        spliceStartIdx = leftRectangleStateIdx + 1;
        leftRectangle[1] = leftBoundRTA;                    //resize leftRectangle through its right bound
    } else if (leftBoundRTA < leftRectangleLeftBound) {
        spliceStartIdx = leftRectangleStateIdx;
    } else if (leftBoundRTA > leftRectangleLeftBound) {
        spliceStartIdx = leftRectangleStateIdx + 1;
    }

    if (rightBoundRTA === rightRectangleRightBound) {
        spliceEndIdx = rightRectangleStateIdx;
    } else if (rightBoundRTA === rightRectangleLeftBound) {
        spliceEndIdx = rightRectangleStateIdx-1;
    } else if (rightBoundRTA < rightRectangleRightBound && rightBoundRTA > rightRectangleLeftBound) {
        spliceEndIdx = rightRectangleStateIdx;
        rightRectangle[0] = rightBoundRTA;
    } else if (rightBoundRTA > rightRectangleRightBound) {
        spliceEndIdx = rightRectangleStateIdx+1;
    } else if (rightBoundRTA < rightRectangleLeftBound) {
        spliceEndIdx = rightRectangleStateIdx - 1;
    }

    if (spliceEndIdx === -1) {
        state.unshift(value);
        return 0;
    }

    if (spliceStartIdx === state.length) {
        state.push(value);
        return state.length-1;
    }

    state.splice(spliceStartIdx, spliceEndIdx - spliceStartIdx, value);
    return spliceStartIdx;
}

function bsearch(state, leftTarget, rightTarget) {
    const bounds = [];
    bounds.push(bsearchTarget(state, leftTarget));
    bounds.push(bsearchTarget(state, rightTarget));
    return bounds;
}

function bsearchTarget(state, target) {
    let leftPointer = 0;
    let rightPointer = state.length - 1;
    let searchIdx = Math.floor((leftPointer+rightPointer) / 2);
    while (leftPointer <= rightPointer) {
        const rectangle = state[searchIdx];
        const leftBoundRectangle = rectangle[0];
        const rightBoundRectangle = rectangle[1];

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


