import MessageContainer from "../../components/MessageContainer/MessageContainer";
import SideBar from "../../components/SideBar/SideBar";

const Home = () => {
  return (
    <>
      <div className='flex justify-center items-center mx-auto p-3 bg-green-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10'>
        <SideBar />
        <MessageContainer />
      </div>
    </>
  );
};

export default Home;
