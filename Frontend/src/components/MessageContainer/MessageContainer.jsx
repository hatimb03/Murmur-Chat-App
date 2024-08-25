import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";

const MessageContainer = () => {
  const noChatSelected = true;
  return (
    <>
      <div className='md:min-w-[450px] flex flex-col justify-between max-h-[100vh] '>
        {noChatSelected ? (
          <NoChatSelected />
        ) : (
          <>
            {/* Header */}
            <div className='bg-[#333333] px-4 py-2 mb-2'>
              <span className='label-text'>To:</span>{" "}
              <span className='font-bold'>Hatim</span>
            </div>

            <Messages />
            <MessageInput />
          </>
        )}
      </div>
    </>
  );
};

export default MessageContainer;

export const NoChatSelected = () => {
  return (
    <div className='flex items-center justify-center w-full h-full text-[#333333]'>
      <div className='px-4 text-center sm:text-lg md:text-xl font-semibold flex flex-col items-center gap-2'>
        <p>Welcome Hatim B 👋 </p>
        <p>Select a chat to start messaging</p>
        <TiMessages className='text-3xl md:text-6xl text-center' />
      </div>
    </div>
  );
};
