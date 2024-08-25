const Conversation = () => {
  return (
    <>
      <div className='flex gap-2 items-center hover:bg-[rgba(140,136,158,1)] rounded px-2 cursor-pointer w-full'>
        <div className='avatar online'>
          <div className='w-12 rounded-full'>
            <img
              src='https://avatar.iran.liara.run/public/9'
              alt='user avatar'
            />
          </div>
        </div>
        <div className='name flex flex-col flex-1'>
          <div className='flex gap-3 justify-between'>
            <p className='font-bold text-[#333333]'>Hatim</p>
            <span>🐯</span>
          </div>
        </div>
      </div>
      <div className='divider divider-primary h-1'></div>
    </>
  );
};

export default Conversation;
