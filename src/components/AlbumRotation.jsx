import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AlbumRotation.css";

const initialList = ['A', 'B', 'C', 'D', 'E'];

const debounce = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const AlbumRotation = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [list, setList] = useState(initialList);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setList(prevList => {
                const prevListWithoutTheLastEl = prevList.slice(0, -1);
                if (prevListWithoutTheLastEl.length >= 5) {
                    prevListWithoutTheLastEl.splice(4, 1);
                }
                const last = prevList.slice(-1)[0];
                return [last, ...prevListWithoutTheLastEl];
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [searchTerm]);

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            if (searchTerm) {
                axios
                    .get(`https://itunes.apple.com/search?term=${searchTerm}&entity=album`,{
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                          }
                    })
                    .then(async (response) => {
                        const albumNames = await response.data.results
                            .map((result) => result.collectionName)
                            .sort((a, b) => a.localeCompare(b))
                            .slice(0, 5);
                        setList((prevAlbum) => {
                            const [one, two, three, four, five, ...rest] = prevAlbum;
                            const newAlbum = [one, two, three, four, five, ...albumNames];

                            console.log(albumNames, prevAlbum, newAlbum);

                            return newAlbum;
                        });
                    })
                    .catch((error) => console.error(error));
            }
        }, 1000);
        debouncedSearch();
    }, [searchTerm]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="search-container">
            <input type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch} />
            <ul>
                {list.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        <button
          type='button'
          onClick={() => { window.open('https://github.com/BlagovestGerov/React-Music-Album-Rotator') }}
          className='black_btn'>
          GitHub
        </button>
        </div>
    );
}

export default AlbumRotation;
