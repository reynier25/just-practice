let ranges = [[0, 10, "red"], [2, 12, "blue"], [1, 6, "red"]];
// [[0, 2, "red"], [2, 12, "blue"]]

/*

*/

// 1 be completely to the left, no overlap - insert, left and right bounds are both to the left and
// if there is a previous rectangle, the bounds are completely to the right of that one.
// 2 be completely to the right, no overlap - we don't know for sure to insert yet, we have to keep 
// iterating.
// 3 overlap left side
// 4 overlap right side
// 5 contained within completely, with room on either side
// 6 envelop the rectangle


function solve(ranges) {
    const state = [ranges[0]];

    for (let i = 1; i < ranges.length; i++) {
        let range = ranges[i];
        const leftBoundRTA = range[0];      // RTA = "rectangle to add"
        const rightBoundRTA = range[1];
        const colorRTA = range[2];
        
        // let insertionIndex = null;
        for (let j = 0; j < state.length; j++) {
            let rectangle = ranges[j];
            const leftBoundRectangle = rectangle[0];    // Rectangle = rectangle in our state
            const rightBoundRectangle = rectangle[1];
            const colorRectangle = rectangle[2];

            const isSameColor = colorRTA === colorRectangle;
            let fullyInserted = false;

            switch (helper(leftBoundRTA, rightBoundRTA, leftBoundRectangle, rightBoundRectangle, isSameColor)) {
                // same color cases
                case 1:
                    if (rightBoundRTA === leftBoundRectangle) {     //mergeable;merge RTA into left side of rectangle
                        rectangle[0] = leftBoundRTA;
                        fullyInserted = true;
                    } else {
                        // splice into the state
                        state.splice(j, 0, range);
                        fullyInserted = true;
                    }
                    break;
                case 2:
                    //etc
                    // Note:
                    // it's possible the rectangle isn't yet "fully inserted", in which case we keep fullyInserted
                    // as false, and continue looping through j until it is fully inserted.
                    break;
                case 3:

                    break;
                case 4:

                    break;
                case 5:

                    break;
                case 6:

                    break;
                
                // different color cases
                case -1:

                    break;
                case -2:
                    
                    break;
                case -3:

                    break;
                case -4:

                    break;
                case -5:

                    break;
                case -6:
                    //actually don't need + and - for 6, because if the rectangle we're adding
                    // envelops completely, color doesn't matter of the rectangle beneath.
                    break;
                
            }
            
            if (fullyInserted) {
                break;
            }

        }


    }

    return state;
}


function helper(newRLeft, newRRight, stateRLeft, stateRRight, color) {
    let sign = color === true ? 1 : -1;
    // positives mean colors are the same; negatives mean they're different
    if (newRRight <= stateRLeft) {          // completely to left
        return 1*sign;
    } else if (newRLeft >= stateRRight) {   // completely to right
        return 2*sign;
    } else if (newRRight > stateRLeft && newRRight < stateRRight) {    // overlaps left side
        return 3*sign;
    } else if (newRLeft < stateRRight && newRLeft > stateRLeft) {    // overlaps right side
        return 4*sign;
    } else if (newRLeft <= stateRLeft && newRRight >= stateRRight) {    // envelops
        return 5*sign;
    } else if (newRLeft > stateRLeft && newRRight < stateRRight) {      // is enveloped
        return 6*sign;
    }
}
