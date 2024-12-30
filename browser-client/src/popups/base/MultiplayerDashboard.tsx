import { useState } from "react";

function MultiplayerDashboard() {

    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

    return (
        <div className="relative pt-3 p-1">
            <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>
            <div className="border-gray-400 border-2 border-solid p-1.5 m-3 bg-slate-100">
                <p className="font-medium text-xl text-center bg-sky-200 p-1 mb-1">
                    MULTIPLAYER
                </p>

                {
                    isLoggedIn ? (
                        <p className="text-center p-2">
                            Welcome,
                        </p>
                    ) : (
                        <p className="text-center p-2">
                            Play as a guest, or sign in!
                        </p>
                    )
                }

                {
                    !isLoggedIn && (
                        <div className="flex justify-center">
                            <button className="bg-purple-400 text-white text-2xl font-medium w-full h-14 m-1">
                                LOG IN
                            </button>
                        </div>
                    )
                }

                <div className="flex justify-center">
                    <button className="bg-green-400 text-white text-2xl font-medium w-full h-14 m-1">
                        JOIN
                    </button>
                </div>

                <div className="flex justify-center">
                    <button className="bg-sky-400 text-white text-2xl font-medium w-full h-14 m-1">
                        HOST
                    </button>
                </div>

                {
                    isLoggedIn && (
                        <div className="flex justify-center">
                            <button className="bg-red-400 text-white text-2xl font-medium w-full h-14 m-1">
                                LOG OUT
                            </button>
                        </div>
                    )
                }
            </div>

            <div className="flex justify-center">
                <button className="bg-slate-300 text-base font-medium p-2 rounded">Back</button>
            </div>
        </div>
    )
}

export default MultiplayerDashboard;