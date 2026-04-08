import { useEffect } from 'react';

function Cursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    let mx = 0, my = 0, fx = 0, fy = 0;
    
    const handleMouseMove = (e) => {
      mx = e.clientX; 
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    let animationFrameId;
    const animFollower = () => {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      animationFrameId = requestAnimationFrame(animFollower);
    };
    animFollower();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cursor"></div>
      <div className="cursor-follower" id="cursorFollower"></div>
    </>
  );
}

export default Cursor;
