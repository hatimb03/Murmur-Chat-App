const Message = () => {
  return (
    <>
      <div className='chat chat-start my-2'>
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full'>
            <img
              alt='Tailwind CSS chat bubble component'
              src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
            />
          </div>
        </div>
        <div className='chat-bubble'>
          It was said that you would, destroy the Sith, not join them.
        </div>
        <div className='chat-footer text-xs flex gap-1 items-center opacity:50 text-white'>
          12:42
        </div>
      </div>
      <div className='chat chat-end'>
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full'>
            <img
              alt='Tailwind CSS chat bubble component'
              src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
            />
          </div>
        </div>
        <div className='chat-bubble'>I did not join them man.</div>
        <div className='chat-footer text-xs flex gap-1 items-center opacity:50 text-white'>
          12:42
        </div>
      </div>
    </>
  );
};

export default Message;
