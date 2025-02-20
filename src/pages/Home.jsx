import RealTimeMoodTracker from "../components/MoodTracker";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Real-Time Mood Tracker</h1>
      <p className="text-gray-300 text-lg text-center max-w-2xl mb-8">
        Experience real-time emotion detection and receive motivational quotes based on your mood!
      </p>
      <div className="w-full max-w-4xl  bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <RealTimeMoodTracker />
      </div>
    </div>
  );
};

export default Home;
