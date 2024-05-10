import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { Navigate } from "react-router-dom";

function LandingPage() {

    const { currentUser } = useAuth();
    const navigate = useNavigate();


    const [pokeId, SetPokeId] = useState('9');

    const pokeimgurl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;
        fetch(pokeimgurl)
            .then( () => {
                 pokeimg.style.backgroundImage = `url(${pokeimgurl})`;
                })
            .catch(err => console.log(err));

    function HandleClick() {
        const pokeimg = document.querySelector('#pokeimg');
        const randPokeId = Math.floor(Math.random()*151) + 1;
        console.log(randPokeId);
        SetPokeId(randPokeId);
        console.log('clicked!');
        const pokeimgurl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;
        fetch(pokeimgurl)
            .then( () => {
                 pokeimg.style.backgroundImage = `url(${pokeimgurl})`;
                })
            .catch(err => console.log(err));

    }
    
    if(currentUser) {
        return <Navigate to="/Home"/>
    } else {
        return (
            <>
                <div className=" flex items-center justify-center gap-28 h-[625px] w-auto bg-[#FF9441] font-raleway">
                    <div className="flex flex-col w-[500px] line gap-8">
                        <h1 className="font-extrabold text-6xl">Think you know them all? Lets find out!</h1>
                        <p className=" font-normal text-lg">This Website will test how deep your knowledge goes and make sure you go down the path of becoming the 
                            best pokemon master to have ever lived!
                        </p>
                        <div className="flex justify-around">
                            <button onClick={() => navigate('/login')} className=" font-semibold ring-2 ring-black rounded-xl p-2 bg-black text-white hover:opacity-80 hover:cursor-pointer hover:text-[#FF9441] transition ease-in-out duration-300">Play Now!</button>
                            <button onClick={HandleClick} className=" font-semibold ring-2 ring-black rounded-xl p-2 bg-black text-white hover:opacity-80 hover:cursor-pointer hover:text-[#FF9441] transition ease-in-out duration-300">Randomise!</button>
                        </div>
                            
                    </div>
                    <div id="pokeimg" className=" w-[500px] h-[500px] bg-center bg-no-repeat" style={{backgroundImage: `url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png')`}}>
                    </div>
                </div>
                <div className="h-12 flex items-center justify-center bg-[#DE5239] font-raleway font-bold">Made by IEEE | GottaQuizEmAll</div>
            </>
        );
    }
    
}

export default LandingPage;