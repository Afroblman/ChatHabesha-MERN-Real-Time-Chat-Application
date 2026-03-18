import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";

const ClearMessagesPage = ({ onCloseClearMsgPage, selectedUser }) => {
  const { deleteMessagesBoth, deleteMessagesSelf } = useContext(ChatContext);
  const [deleteForBoth, setDeleteForBoth] = useState(false);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-[#1F2937] text-white rounded-lg w-[90%] max-w-md flex flex-col gap-5 p-5"
    >
      <p>
        Are you sure you want delete all message history with{" "}
        {selectedUser.fullName}?
      </p>
      <div className="flex items-center gap-3">
        <input
          id="deleteForBoth"
          type="checkbox"
          className="w-6 h-6"
          checked={deleteForBoth}
          onChange={(e) => setDeleteForBoth(e.target.checked)}
        />
        <label htmlFor="deleteForBoth">
          Also delete for {selectedUser.fullName}
        </label>
      </div>
      <div className="flex justify-end gap-8">
        <button
          onClick={onCloseClearMsgPage}
          className="cursor-pointer hover:bg-gray-100/20 p-1 rounded-lg w-20 text-center"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (deleteForBoth) {
              deleteMessagesBoth(selectedUser._id);
              onCloseClearMsgPage();
            } else {
              deleteMessagesSelf(selectedUser._id);
              onCloseClearMsgPage();
            }
          }}
          className="cursor-pointer hover:bg-red-300/20 p-1 rounded-lg text-red-400 w-20 text-center"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ClearMessagesPage;
