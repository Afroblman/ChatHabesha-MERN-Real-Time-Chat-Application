import assets from "../assets/assets";

const Welcome = () => {
  return (
    <section className="bg-[#111827] flex flex-col items-center justify-center  max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <h1 className="text-2xl font-bold text-white">Welcome to ChatHabesha</h1>
      <p className="text-lg font-medium text-white italic">
        Chat anytime, anywhere
      </p>
    </section>
  );
};

export default Welcome;
