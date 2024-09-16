/* eslint-disable react/prop-types */

import React from "react";

const UserList = React.memo(
  ({ userId, onClick, selectedUserId, onlinePeople, online }) => {
    const user = onlinePeople[userId] || {};
    if (!user) {
      return null;
    }

    return (
      <div
        key={userId}
        onClick={() => {
          onClick(userId);
        }}
        className={`contactContainer border-b py-4 px-2 flex items-center gap-8 hover:cursor-pointer hover:bg-white ${
          userId === selectedUserId ? "bg-blue-100" : ""
        }`}
      >
        <div className={`avatar opacity-70 ${online ? "online" : ""}`}>
          <div className='w-10 flex items-center justify-center rounded-full bg-blue-200 text-xl'>
            <div className='h-full w-full flex items-center justify-center'>
              {onlinePeople[userId]?.name ? onlinePeople[userId].name[0] : ""}
            </div>
          </div>
        </div>

        <div className='flex flex-col flex-1'>
          <div className='text-xs text-gray-600'>
            @{onlinePeople[userId].username}
          </div>
          <div className='text-xl'>{onlinePeople[userId].name}</div>
        </div>
      </div>
    );
  }
);

UserList.displayName = "UserList";

export default UserList;
