const LastSeenAndOnline = ({ onCloseLastSeenAndOnline }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-[#1F2937] text-white flex flex-col rounded-lg w-[60%] max-w-sm p-4"
    >
      <p className="mb-4">Who can see my last seen time</p>

      <div className="flex flex-col gap-3 mb-4">
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="lastSeen"
            value="everyone"
            className="w-6 h-6"
          />
          Everybody
        </label>
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="lastSeen"
            value="myContacts"
            className="w-6 h-6"
          />
          My Contacts
        </label>
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="lastSeen"
            value="nobody"
            checked
            className="w-6 h-6"
          />
          Nobody
        </label>
      </div>

      <div className="flex justify-end gap-8">
        <button
          onClick={onCloseLastSeenAndOnline}
          className="cursor-pointer hover:bg-gray-100/20 p-1 rounded-lg w-20 text-center"
        >
          Cancel
        </button>
        <button className="cursor-pointer hover:bg-red-300/20 p-1 rounded-lg text-red-400 w-20 text-center">
          Save
        </button>
      </div>
    </div>
  );
};

export default LastSeenAndOnline;
