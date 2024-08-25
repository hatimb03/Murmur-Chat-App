import Conversation from "./Conversation";

const Conversations = () => {
  return (
    <>
      <div className='flex flex-col overflow-y-auto overflow-x-hidden py-2 max-h-[400px]'>
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
      </div>
    </>
  );
};

export default Conversations;
