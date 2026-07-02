import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "@/Userprovider";
import {  ArrowRight, Users, Zap, Shield } from "lucide-react";

const DashBoard = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4 py-12 sm:px-8">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded border-purple-600 border-2 bg-purple-100 text-purple-700 font-medium text-sm sm:text-base">
           
            Collaborative Whiteboard
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-6 leading-tight text-gray-900">
            Draw.
            <br />
            Collaborate.
            <br />
            Create.
          </h1>

          <p className="mt-6 text-gray-500 text-base sm:text-lg max-w-lg">
            Build ideas together in real-time. Sketch, brainstorm, and
            collaborate with your teammates from anywhere.
          </p>

        
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-purple-600" />
              <span>Real-time collaboration</span>
            </div>
           
            <div className="flex items-center gap-1.5">
              <Shield size={16} className="text-purple-600" />
              <span>Private boards</span>
            </div>
          </div>

          {user != null && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-10 w-full sm:w-auto text-lg">
              <Link
                to="/dash"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 px-6 rounded cursor-pointer font-medium w-full sm:w-auto text-center"
              >
                Continue
                <ArrowRight size={20} />
              </Link>
            </div>
          )}

          {user == null && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-10 w-full sm:w-auto text-lg">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 px-6 rounded cursor-pointer font-medium w-full sm:w-auto text-center"
              >
                Sign In
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center py-3 px-6 rounded font-medium bg-white hover:bg-gray-50 transition-colors border border-gray-300 cursor-pointer w-full sm:w-auto text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <div className="flex justify-center w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-[600px] h-auto p-4 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                <div className="w-3 h-3 rounded-full bg-violet-600"></div>
              </div>

              <span className="text-sm text-gray-400">Drawboard</span>
            </div>

            <div className="border w-full min-h-[250px] sm:min-h-[280px] object-cover flex items-center justify-center">
              <img className="w-full h-full" src="./Public/Home.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;