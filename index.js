require("dotenv").config();

'use strict'

const getHTML = require('html-get');
const unfluff = require('unfluff');
const ComfyJS = require("comfy.js");

const zodiacSigns = {
  "aries": "Aries",
  "taurus": "Taurus",
  "gemini": "Gemini",
  "cancer": "Cancer",
  "leo": "Leo",
  "virgo": "Virgo",
  "libra": "Libra",
  "scorpio": "Scorpio",
  "sagittarius": "Sagittarius",
  "capricorn": "Capricorn",
  "aquarius": "Aquarius",
  "pisces": "Pisces"
}

ComfyJS.onCommand = ( user, command, message ) => {
  try {
    console.log( user, command, message );
    if( command === "fortunefuturehoroscope" ) {
      var sign = message.toLowerCase();
      console.log( sign );
      if( zodiacSigns[ sign ] ) {
        (async () => {
          const { url, html, stats } = await getHTML(`https://www.astrology.com/horoscope/daily/today/${sign}.html`)
          // console.log(url, stats, html.length)
          var data = unfluff(html);
          console.log( data.title );
          console.log( data.date );
          console.log( data.image );
          var horoscope = data.text.split("\n")[ 0 ];
          console.log( horoscope );
          ComfyJS.Say( `@${user} - ${zodiacSigns[ sign ]}: ${horoscope}` );
        })();
      }
    }
  }
  catch( ex ) {}
};
ComfyJS.Init( process.env.Username, process.env.Password, [ "instafluff" ] );
