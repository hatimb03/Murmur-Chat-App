/* eslint-disable react/prop-types */
import UserList from "./UserList";

const UserListSection = ({
  selectedUserId,
  onlinePeople,
  onlinePeopleExcludingUser,
  handleUserClick,
  offlinePeople,
}) => {
  return (
    <div
      className={`left h-full bg-blue-50 w-full md:w-1/3 lg:w-1/4 overflow-auto pt-20 p-6 flex flex-col ${
        selectedUserId ? "hidden md:flex" : "flex"
      }`}
    >
      {Object.keys(onlinePeopleExcludingUser).map((userId) => (
        <UserList
          userId={userId}
          online={true}
          selectedUserId={selectedUserId}
          onlinePeople={onlinePeople}
          key={userId}
          onClick={handleUserClick}
        />
      ))}
      {Object.keys(offlinePeople).map((userId) => (
        <UserList
          userId={userId}
          online={false}
          selectedUserId={selectedUserId}
          onlinePeople={offlinePeople}
          key={userId}
          onClick={handleUserClick}
        />
      ))}
    </div>
  );
};

export default UserListSection;
