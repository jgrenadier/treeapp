
//
// See sample code in 
// https://github.com/anandsimmy/custom-context-menu for 
// this component.
// documentation: https://medium.com/@anandsimmy7/creating-a-custom-context-menu-component-using-react-hooks-10bcbc65daae 
//
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './TheContextMenuStyles.css';

const TheContextMenu= ({ targetId, options, classes, dotest}) => {
  //
  // set default states for visible and x/y position
  //
  const [contextData, setContextData]= useState({ visible:false, posX: 0, posY: 0});
  const contextRef= useRef(null);;

  const [isLiSelected, setLiSelected] = useState(false);

  //const handleClick=(event) => {
  //  console.log(event.target.name);
  //}

  //this.handleClick = this.handleClick.bind(this);

  useEffect(() => {
    //
    // useEffect is a Hook that synchronizes with an external system
    //
    const contextMenuEventHandler= (event) => {
      const targetElement= document.getElementById(targetId)
      if(targetElement && targetElement.contains(event.target)){
        // target is present, so prevent default behavior
        event.preventDefault();
        // target is present, so make context menu state to visibie
        setContextData({ ...contextData, visible: true, posX: event.clientX, posY: event.clientY })
      }else if(contextRef.current && !contextRef.current.contains(event.target)){
        // target is NOT present, so make context menu state to not visibie
        setContextData({ ...contextData, visible: false })
      }
    }

    const offClickHandler= (event) => {
      //
      // event for clicking outside of context menu
      //
      if(contextRef.current && !contextRef.current.contains(event.target)){
        setContextData({ ...contextData, visible: false })
      }
    }

    //
    // wire up document so it will fire events when user...
    // 1. enters context menu by right clicking ...or...
    // 2. leaves context menu by clicking outside of context menu
    // 
    document.addEventListener('contextmenu', contextMenuEventHandler)
    document.addEventListener('click', offClickHandler)
    return () => {
      //
      // cleanup by removing event listeners when leaving
      //
      document.removeEventListener('contextmenu', contextMenuEventHandler)
      document.removeEventListener('click', offClickHandler)
    }
  }, [contextData, targetId])

  //
  // useLayoutEffect fires before bowser repaints the screen.
  // This is generally slower that useEffect
  //
  // using the mouse position and offset width and height
  // save the state of the position where the context menu will be 
  // rendered.
  //
  useLayoutEffect(() => {
    if(contextData.posX + contextRef.current?.offsetWidth > window.innerWidth){
      setContextData({ ...contextData, posX: contextData.posX - contextRef.current?.offsetWidth})
    }
    if(contextData.posY + contextRef.current?.offsetHeight > window.innerHeight){
      setContextData({ ...contextData, posY: contextData.posY - contextRef.current?.offsetHeight})
    }
  }, [contextData])

  function handleLiClick(event) {
    setLiSelected(true);
    console.log('clicked on li');
    // console.log(event.target.className);
    // console.log(event.target);
    var s = String(event.target.innerHTML);
    console.log(s);
    setContextData({ ...contextData, visible: false});

    dotest(s, event);
    
  }

  return (
    <div ref={contextRef} className='contextMenu' style={{ display:`${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY }}>
      <div className={`optionsList ${classes?.listWrapper}`}>
        {options.map((option) => (
          <li onClick={handleLiClick} key={option} className={`optionListItem ${classes?.listItem}`}>
            {option}
          </li>
        ))}
      </div>
    </div>
  );
}



export default TheContextMenu;