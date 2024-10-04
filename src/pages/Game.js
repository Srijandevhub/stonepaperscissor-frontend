import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrl, imageUrl } from "../util/api";
import { useParams } from "react-router-dom";
import PreLoader from "../components/PreLoader";
import avatar from '../assets/images/avatar.png';
import Stone from "../assets/images/stone.png";
import Paper from '../assets/images/paper.png';
import Scissors from '../assets/images/scissors.png';

const Game = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [seconds, setSeconds] = useState(10);
    const [timerActive, setTimerActive] = useState(true);
    const [clientPlayer, setClientPlayer] = useState(null);
    const [player1Move, setPlayer1Move] = useState("");
    const [player2Move, setPlayer2Move] = useState("");
    const handleMove = async (move, switcher) => {
        try {
            if (switcher === 1) {
                setPlayer1Move(move);
            }
            if (switcher === 2) {
                setPlayer2Move(move);
            }
            // await axios.post(`${apiUrl}/games/move/${id}`, {
            //     move: move
            // });
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await axios.get(`${apiUrl}/games/getgame/${id}`);
                if (res.data.status === 200) {
                    setGame(res.data.game);
                    if (res.data.game.player1join) {
                        setPlayer1(res.data.player1);
                    }
                    if (res.data.game.player2join) {
                        setPlayer2(res.data.player2);
                    }
                    setClientPlayer(res.data.clientplayer);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchGame();
        const gamefetchInterval = setInterval(() => {
            fetchGame();
        }, 1000);
        return () => {
            clearInterval(gamefetchInterval);
        }
    }, [id]);
    useEffect(() => {
        let timer;
        if (timerActive && seconds > 0) {
            timer = setInterval(() => {
                setSeconds(seconds - 1);
            }, 1000);
        } else if (seconds === 0) {
            setTimerActive(false);
            setSeconds(10);
        }
        return () => {
            clearInterval(timer);
        }
    }, [seconds, timerActive])
    if (!game || (!player1 || !player2)) {
        return <PreLoader />
    }
    return (
        <div className="game-wrapper vh-100 bg-info d-flex align-items-center justify-content-center">
            <div className="container w-100">
                <div className="card shadow">
                    <div className="card-header bg-white">
                        <div className="h6 mb-0">ID: {game._id}</div>
                        <div className="h6 mb-0">Rounds: {game.rounds}</div>
                        <div className="h6 mb-0">Round No.: {game.roundnumber}</div>
                    </div>
                    <div className="card-body p-0">
                        <div className="row m-0">
                            <div className="col-sm-6 p-0 border-right border-bottom">
                                <div className="p-4">
                                    <div className="d-flex align-items-center">
                                        <i className="profile-avatar">
                                            <img src={player1.image ? `${imageUrl}/uploads/users/${player1.image}` : avatar} alt="avatar"/>
                                        </i>
                                        <span className="pl-2 flex-grow-1 profile-name text-dark">{player1.name} (level: {player1.level})</span>
                                    </div>
                                    {
                                        clientPlayer === 1 &&
                                        <div className="mt-1 text-danger">Timer: 00:{seconds.toString().length > 1 ? seconds : `0${seconds}`}</div>
                                    }
                                    <div style={{ marginTop: clientPlayer === 1 ? 0 : "28px" }}>
                                        <div style={{ minHeight: "50px" }}>
                                            {
                                                player1Move !== "" && player2Move !== "" ?
                                                <div>{player1Move}</div>
                                                :
                                                <>
                                                {
                                                    player1Move !== "" && clientPlayer === 1 &&
                                                    <div>{player1Move}</div>
                                                }
                                                </>
                                            }
                                        </div>
                                        {
                                            clientPlayer === 1 &&
                                            <div className="d-flex gap-1 justify-content-center mt-3">
                                                <button className="move-btn" onClick={() => handleMove("stone", 1)}>
                                                    <img src={Stone} alt="stone"/>
                                                </button>
                                                <button className="move-btn" onClick={() => handleMove("paper", 1)}>
                                                    <img src={Paper} alt="paper"/>
                                                </button>
                                                <button className="move-btn">
                                                    <img src={Scissors} alt="scissors" onClick={() => handleMove("scissors", 1)}/>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 p-0 border-bottom">
                                <div className="p-4">
                                    <div className="d-flex align-items-center">
                                        <i className="profile-avatar">
                                            <img src={player2.image ? `${imageUrl}/uploads/users/${player2.image}` : avatar} alt="avatar"/>
                                        </i>
                                        <span className="pl-2 flex-grow-1 profile-name text-dark">{player2.name}  (level: {player2.level})</span>
                                    </div>
                                    {
                                        clientPlayer === 2 &&
                                        <div className="mt-1 text-danger">Timer: 00:{seconds.toString().length > 1 ? seconds : `0${seconds}`}</div>
                                    }
                                    <div style={{ marginTop: clientPlayer === 2 ? 0 : "28px" }}>
                                        <div style={{ minHeight: "50px" }}>
                                            
                                        </div>
                                        {
                                            clientPlayer === 2 &&
                                            <div className="d-flex gap-1 justify-content-center mt-3">
                                                <button className="move-btn" onClick={() => handleMove("stone", 2)}>
                                                    <img src={Stone} alt="stone"/>
                                                </button>
                                                <button className="move-btn" onClick={() => handleMove("paper", 2)}>
                                                    <img src={Paper} alt="paper"/>
                                                </button>
                                                <button className="move-btn">
                                                    <img src={Scissors} alt="scissors" onClick={() => handleMove("scissors", 2)}/>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 text-center">
                            {
                                game.isend ?
                                <p className="mb-0">Game Over!</p>
                                :
                                <p className="mb-0">Make you move!</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game;