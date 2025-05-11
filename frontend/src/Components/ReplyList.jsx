import React from "react";

const ReplyList = ({ replies }) => {
  if (!replies || replies.length === 0) {
    return <p className="text-gray-400 ml-6">No replies yet</p>;
  }

  return (
    <div className="ml-6 mt-4 space-y-2">
      {replies.map((reply) => (
        <div key={reply._id} className="bg-white p-3 rounded shadow">
          <div className="flex items-center gap-2">
            <img
              src={reply.owner.avatar}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <p className="text-sm font-medium">{reply.owner.username}</p>
          </div>
          <p className="ml-10 text-gray-700">{reply.content}</p>
        </div>
      ))}
    </div>
  ); 
};

export default ReplyList;
