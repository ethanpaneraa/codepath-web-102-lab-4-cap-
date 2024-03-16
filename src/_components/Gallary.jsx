import React from 'react'; 

export default function Gallary({ images }) {

    return (
        <div>
            <h3>Your Screenshot Gallary!</h3>
            <div className='image-container'>
                {images && images.map((image, index) => (
                    <img 
                        key={index}
                        className='screenshot'
                        src={image}
                        alt='Your screenshot'
                    />
                ))}
            </div>
        </div>
    );
};