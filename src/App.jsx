import { useState } from 'react'; 
const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY; 
import APIForm from './_components/APIForm';
import Gallary from './_components/Gallary';
import './App.css'; 

function App() {

  const [inputs, setInputs] = useState({
    url: "", 
    format: "",
    no_ads: "", 
    no_cookie_banners: "", 
    width: "", 
    height: "", 
    });

  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]); 
  const [quote, setQuote] = useState(null);




    const submitForm = (event) => {
      event.preventDefault();
      let defaultValues = {
        format: "jpeg",
        no_ads: "true",
        no_cookie_banners: "true",
        width: "1920",
        height: "1080",
      };
      
      if (inputs.url === "" || inputs.url === undefined) {
        alert("Please input a URL to take a screenshot of!");
        return;
      } else {
        for (const [key, value] of Object.entries(inputs)) {
          if (value === "") {
            inputs[key] = defaultValues[key];
          };
        };
      };
      makeQuery(); 

    };

    const makeQuery = () => {
      let wait_until = "network_idle"; 
      let response_type = "json"; 
      let fail_on_status = '400%2C404%2C500-511'; 
      let url_starter = 'https://'; 
      let full_url = `${url_starter}${inputs.url}`;

      let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${full_url}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;

      callAPI(query).catch((error) => {
        alert("There was an error with your request. Please try again later.");
      });
    };

    const callAPI = async (query) => {
      const response = await fetch(query); 
      const json = await response.json(); 

      if (json.url === null) {
        alert("There was an error with your request. Please try again later.");
      } else {
        setCurrentImage(json.url);
        setPrevImages((prevState) => [json.url, ...prevState]);
        reset(); 
        getQuote();
      };
    };

    const reset = () => {
      setInputs({
        url: "", 
        format: "",
        no_ads: "", 
        no_cookie_banners: "", 
        width: "", 
        height: "" 
      });
    };

    const getQuote = async () => {
      let query = `https://api.apiflash.com/v1/urltoimage/quota?access_key=${ACCESS_KEY}`; 
      const response = await fetch(query);
      const json = await response.json(); 

      setQuote(json);
    };

  return (
    <>
      <div className='whole-page'>
        <h1>Build Your Own Screenshot! 📸</h1>
        {quote ? (
          <p className='quota'>
            {" "} you have {quote.remaining} screenshots left for today.
          </p>
        ) : (
          <></>
        )
        }
        <APIForm 
          inputs={inputs}
          handleChange={(e) => 
            setInputs((prevState) => ({
              ...prevState,
              [e.target.name]: e.target.value.trim()
            }))
          }
          onSubmit={submitForm}
        />
        <br></br>

        {currentImage ? (
          <img 
            className='screenshot'
            src={currentImage}
            alt='Your screenshot'
          />
        ) : (
          <></>
        )
        }

        <div className='container'>
          <h3>Current Query Status:</h3>
          <p>
            <br></br>
            &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width}
          <br></br>
          &height={inputs.height}
          <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
          <br></br>
          &no_ads={inputs.no_ads}
          </p>
        </div>

        <div className="container">
          <Gallary images={prevImages} />
        </div>
      </div>
    </>
  )
}

export default App
