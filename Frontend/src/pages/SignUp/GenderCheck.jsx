const GenderCheck = () => {
  return (
    <div className='flex mt-5 text-center'>
      <div className='form-control'>
        <label className={`label gap-2 cursor-pointer`}>
          <span className='label-text text-[#333333]'>Male</span>
          <input type='checkbox' className='checkbox border-[#333333]' />
        </label>
      </div>
      <div className='form-control'>
        <label className={`label gap-2 cursor-pointer`}>
          <span className='label-text text-[#333333]'>Female</span>
          <input type='checkbox' className='checkbox border-[#333333]' />
        </label>
      </div>
    </div>
  );
};

export default GenderCheck;
