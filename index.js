require("dotenv").config();

'use strict'

const fetch = require( "node-fetch" );
const unfluff = require('unfluff');
const ComfyJS = require("comfy.js");
const ComfyWeb = require( "webwebweb" );
ComfyWeb.APIs[ "/horoscope" ] = async ( qs ) => {
  let horoscope = await getHoroscope( qs.sign );
  setTimeout( () => {
    ComfyJS.Say( `@${qs.user} - ${zodiacSigns[ qs.sign ]}: ${horoscope.text}` );
  }, 5000 );
  return horoscope;
};
ComfyWeb.APIs[ "/zodiac" ] = ( qs ) => {
  let sign = findZodiacSign( parseInt( qs.month ), parseInt( qs.date ) );
  return {
    sign,
    zodiac: zodiacSigns[ sign ]
  };
}
ComfyWeb.Run( 1111 );

async function getHoroscope( sign ) {
  sign = sign.toLowerCase();
  if( zodiacSigns[ sign ] ) {
    let html = await fetch( `https://www.astrology.com/horoscope/daily/today/${sign}.html` )
      .then( r => r.text() );
    var data = unfluff( html );
    return {
      title: data.title,
      softTitle: data.softTitle,
      date: data.date,
      text: data.text.split("\n")[ 0 ]
    };
  }
  return {};
}

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

function findZodiacSign( month, date ) {
  console.log( month, date );
  const zodiacDates = {
    "aries": {
      startMonth: 3,
      startDate: 21,
      endMonth: 4,
      endDate: 19
    },
    "taurus": {
      startMonth: 4,
      startDate: 20,
      endMonth: 5,
      endDate: 20
    },
    "gemini": {
      startMonth: 5,
      startDate: 21,
      endMonth: 6,
      endDate: 20
    },
    "cancer": {
      startMonth: 6,
      startDate: 21,
      endMonth: 7,
      endDate: 22
    },
    "leo": {
      startMonth: 7,
      startDate: 23,
      endMonth: 8,
      endDate: 22
    },
    "virgo": {
      startMonth: 8,
      startDate: 23,
      endMonth: 9,
      endDate: 22
    },
    "libra": {
      startMonth: 9,
      startDate: 23,
      endMonth: 10,
      endDate: 22
    },
    "scorpio": {
      startMonth: 10,
      startDate: 23,
      endMonth: 11,
      endDate: 21
    },
    "sagittarius": {
      startMonth: 11,
      startDate: 22,
      endMonth: 12,
      endDate: 21
    },
    "capricorn": {
      startMonth: 12,
      startDate: 22,
      endMonth: 1,
      endDate: 19
    },
    "aquarius": {
      startMonth: 1,
      startDate: 20,
      endMonth: 2,
      endDate: 18
    },
    "pisces": {
      startMonth: 2,
      startDate: 19,
      endMonth: 3,
      endDate: 20
    },
  };

  let signs = Object.keys( zodiacDates ).filter( x => {
    return ( month === zodiacDates[ x ].startMonth &&
        date >= zodiacDates[ x ].startDate ) || ( month === zodiacDates[ x ].endMonth &&
        date <= zodiacDates[ x ].endDate );
  });
  return signs[ 0 ] || "Unknown";
}

const monthToNumber = {
  "jan": 1,
  "january": 1,
  "feb": 2,
  "february": 2,
  "mar": 3,
  "march": 3,
  "apr": 4,
  "april": 4,
  "may": 5,
  "jun": 6,
  "june": 6,
  "jul": 7,
  "july": 7,
  "aug": 8,
  "august": 8,
  "sep": 9,
  "september": 9,
  "oct": 10,
  "october": 10,
  "nov": 11,
  "november": 11,
  "dec": 12,
  "december": 12
};

ComfyJS.onCommand = async ( user, command, message ) => {
  try {
    console.log( user, command, message );
    if( command === "fortunefuturehoroscope" ) {
      var sign = message.toLowerCase();
      // console.log( sign );
      let data = await getHoroscope( sign );
      var horoscope = data.text;
      ComfyJS.Say( `@${user} - ${zodiacSigns[ sign ]}: ${horoscope}` );
    }
    if( command === "z" ) {
      let parts = message.split( " " );
      let sign = findZodiacSign( monthToNumber[ parts[ 0 ] ], parseInt( parts[ 1 ] ) );
      ComfyJS.Say( `@${user} - ${zodiacSigns[ sign ]}` );
    }
  }
  catch( ex ) {}
};
ComfyJS.Init( process.env.Username, process.env.Password, [ "instafluff" ] );
