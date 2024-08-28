import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import { getRandomEmoji } from "../../utils/emoji";
const Conversations = () => {
  const { loading, conversations } = useGetConversations();

  return (
    <div className='flex flex-col overflow-y-auto overflow-x-hidden py-2 max-h-[400px]'>
      {conversations.map((val, index) => (
        <Conversation
          key={val._id}
          conversation={val}
          emoji={getRandomEmoji()}
          lastIndex={index === conversations.length - 1}
        />
      ))}
      {loading && <span className='loading loading-spinner mx-auto'></span>}
    </div>
  );
};

export default Conversations;
