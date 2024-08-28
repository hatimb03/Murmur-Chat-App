import useConversations from "../../zustand/useConversations";

const Conversation = ({ conversation, emoji, lastIndex }) => {
  const { selectedConversation, setSelectedConversation } = useConversations();
  const isSelected = selectedConversation?._id === conversation._id;

  return (
    <>
      <div
        onClick={() => setSelectedConversation(conversation)}
        className={`flex gap-2 items-center hover:bg-[#2d2a3e] text-[#333333] hover:text-white rounded px-2 cursor-pointer w-full 
          ${isSelected ? "bg-[#2d2a3e] text-white" : ""}`}
      >
        <div className='avatar online'>
          <div className='w-12 rounded-full'>
            <img src={conversation.profilePic} alt='user avatar' />
          </div>
        </div>
        <div className='name flex flex-col flex-1'>
          <div className='flex gap-3 justify-between'>
            <p className='font-bold '>{conversation.fullName}</p>
            <span>{emoji}</span>
          </div>
        </div>
      </div>

      {!lastIndex && <div className='divider divider-primary h-1'></div>}
    </>
  );
};

export default Conversation;
