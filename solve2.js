let ranges = [[0, 10, "red"], [2, 12, "blue"], [1, 6, "red"]];
// [[0, 2, "red"], [2, 12, "blue"]]
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

    }

    return state;
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
    return searchIdx;
}
