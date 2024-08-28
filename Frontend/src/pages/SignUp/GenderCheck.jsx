export const GenderCheck = ({ onCheckBoxChange, selectedGender }) => {
  const handleChange = (gender) => {
    if (selectedGender === gender) {
      onCheckBoxChange(""); // Uncheck if the same checkbox is clicked
    } else {
      onCheckBoxChange(gender); // Set the new gender
    }
  };

  return (
    <div className='flex mt-5 text-center'>
      <div className='form-control'>
        <label
          className={`label gap-2 cursor-pointer ${
            selectedGender === "male" ? "" : ""
          }`}
        >
          <span className='label-text text-[#333333]'>Male</span>
          <input
            type='checkbox'
            className='checkbox border-[#333333]'
            checked={selectedGender === "male"}
            onChange={() => handleChange("male")}
          />
        </label>
      </div>
      <div className='form-control'>
        <label
          className={`label gap-2 cursor-pointer ${
            selectedGender === "female" ? "" : ""
          }`}
        >
          <span className='label-text text-[#333333]'>Female</span>
          <input
            type='checkbox'
            className='checkbox border-[#333333]'
            checked={selectedGender === "female"}
            onChange={() => handleChange("female")}
          />
        </label>
      </div>
    </div>
  );
};
