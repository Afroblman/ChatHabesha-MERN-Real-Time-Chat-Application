import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { IoClose } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";

const EditProfile = ({ onCloseProfile }) => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [img, setImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!img) {
      await updateProfile({ fullName: name, bio });
      onCloseProfile();
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = async () => {
      const base64Img = reader.result;
      await updateProfile({ profilePic: base64Img, fullName: name, bio });
      onCloseProfile();
      navigate("/");
    };
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-[#1F2937] text-white flex rounded-lg w-[90%] max-w-md"
    >
      <button
        onClick={onCloseProfile}
        className="absolute top-3 right-3 cursor-pointer"
      >
        <IoClose className="text-white text-2xl font-bold" />
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
        <h3 className="text-lg">Edit your profile</h3>
        <label
          htmlFor="avatar"
          className="flex items-center gap-3 cursor-pointer"
        >
          <input
            onChange={(e) => setImg(e.target.files[0])}
            type="file"
            id="avatar"
            accept=".png, .jpg, .jpeg"
            hidden
          />
          <img
            src={
              img
                ? URL.createObjectURL(img)
                : authUser.profilePicture || assets.avatar_icon
            }
            alt="profile image"
            className="w-12 h-12 rounded-full"
          />
          Upload Profile Image
        </label>

        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          required
          placeholder="Your Name"
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus-indigo-100"
        />

        <textarea
          onChange={(e) => setBio(e.target.value)}
          value={bio}
          name=""
          id=""
          placeholder="Write prifle bio"
          required
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus-indigo-100"
          rows={4}
        ></textarea>
        <button
          type="submit"
          className="bg-gray-100/12 text-white p-2 rounded-full text-lg cursor-pointer hover:bg-gray-100/20"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
