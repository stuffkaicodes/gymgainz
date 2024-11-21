import React, {useState, useEffect} from 'react';
import { useSwipeable } from 'react-swipeable';

function SwipeableComponent({onSwipeLeft, onSwipeRight, children}) {
    const [swiped, setSwiped] = useState(false);

    const handlers = useSwipeable({
      onSwipedLeft: () => {
        setSwiped(true);
        if (onSwipeLeft) onSwipeLeft();
      },
      onSwipedRight: () => {
        setSwiped(false);
        if (onSwipeRight) onSwipeRight();
      },
      preventDefaultTouchmoveEvent: true,
    });  
    
//     const handlers = useSwipeable({
//     onSwipedLeft: () => console.log('Swiped left!', index),
//     onSwipedRight: () => console.log('Swiped right!', index),
//     preventDefaultTouchmoveEvent: true, // Prevent default touchmove event
//   });

  return (
    <div {...handlers} style={{ display:'flex', cursor: 'pointer' }}>
        {children}
        {/* {swiped && (
        <div>
        //   style={{
        //     // position: 'absolute',
        //     // right: 0,
        //     width: '5rem',
        //     height: '100%',
        //     backgroundColor: 'darkred',
        //     display: 'flex',
        //     alignItems: 'center',
        //     justifyContent: 'center',
        //     zIndex: 999,
        //     marginLeft: 'auto', // Push the delete button to the right
        //   }}
        // >
        //   <button onClick={onDelete} style={{ backgroundColor:'transparent', color: 'white' }}>
        //     Delete
        //   </button>
        </div>
    //   )} */}
    </div>
  );
}

export default SwipeableComponent; 