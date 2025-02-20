import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { io } from "socket.io-client";
import axios from "axios";

const RealTimeMoodTracker = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [peopleData, setPeopleData] = useState(['asd'.toLowerCase,"dadad","fjkdssd","fhksdhfksdf"]);
  const [motivation, setMotivation] = useState("fsdfsd");
  const socket = useRef(null);
  const moodTimerRef = useRef(null);
  const lastMoodRef = useRef("");

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    loadModels();
    return () => {
      socket.current.disconnect();
      clearTimeout(moodTimerRef.current);
    };
  }, []);

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      await faceapi.nets.ageGenderNet.loadFromUri("/models");
      console.log("All models loaded successfully!");
      startVideo();
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => videoRef.current.play();
        }
      })
      .catch(console.error);
  };

  const analyzeData = async () => {
    setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions()
        .withAgeAndGender();

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (detections.length > 0) {
        faceapi.matchDimensions(canvasRef.current, videoRef.current);

        const updatedPeopleData = detections.map((detection) => {
          const { expressions, gender } = detection;
          const detectedEmotion = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );

          return {
            emotion: detectedEmotion,
            gender: gender,
            box: detection.detection.box,
          };
        });

        setPeopleData(updatedPeopleData);
        socket.current.emit("userData", updatedPeopleData);

        const currentMood = updatedPeopleData[0]?.emotion;
        if (currentMood !== lastMoodRef.current) {
          lastMoodRef.current = currentMood;
          clearTimeout(moodTimerRef.current);
          moodTimerRef.current = setTimeout(() => handleFetchMotivation(currentMood), 10000);
        }
        drawBoundingBoxes(updatedPeopleData, ctx);
      }
    }, 1000);
  };

  const handleFetchMotivation = async (mood) => {
    if (!mood) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/motivation/getMotivation/${mood}`);
      setMotivation(response.data.content);
    } catch (error) {
      console.error("Error fetching motivation:", error);
      setMotivation("Could not fetch motivation. Please try again later.");
    }
  };

  const drawBoundingBoxes = (updatedPeopleData, ctx) => {
    updatedPeopleData.forEach(({ box, emotion, gender }) => {
      if (ctx) {
        ctx.beginPath();
        ctx.rect(box.x, box.y, box.width, box.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#34D399";
        ctx.stroke();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 14px Arial";
        ctx.fillText(`Emotion: ${emotion}`, box.x, box.y - 10);
        ctx.fillText(`Gender: ${gender}`, box.x, box.y - 30);
      }
    });
  };

  return (
    <div className="relative w-full   flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-3xl h-[50vh] relative rounded-lg overflow-hidden shadow-lg border border-gray-700">
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" onPlay={analyzeData} />
        <canvas ref={canvasRef} width="500" height="500" className="absolute top-0 left-0" />
      </div>
      <div className="mt-4 flex justify-center text-white text-lg font-sans w-full max-w-3xl text-center">
        {peopleData.map((person, index) => (
          <div key={index} className="p-2 bg-gray-800 rounded-md shadow-md mb-2">
            <h4 className="text-green-400">Person {index + 1}:</h4>
            <h5 className="text-blue-400">Gender: {person.gender}</h5>
            <h5 className="text-yellow-400">Emotion: {person.emotion}</h5>
          </div>
        ))}
      </div>
      {motivation && (
        <div className="mt-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg text-center w-full max-w-3xl">
          <p className="text-lg font-semibold">{motivation}Motivation</p>
        </div>
      )}
    </div>
  );
};

export default RealTimeMoodTracker;
