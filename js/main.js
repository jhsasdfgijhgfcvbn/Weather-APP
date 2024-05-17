"use strict";

const API="7e3682cbe886245f2144aa59194caf6e";

const dayEL=document.querySelector(".default_day");
const dateEL=document.querySelector(".default_date");
const btnEL=document.querySelector(".btn_search");
const inputEL=document.querySelector(".input_field");

const iconsContainer=document.querySelector(".icons");
const dayInfoEL=document.querySelector(".day-info");
const listContentEL=document.querySelector(".list_content ul");

const days=[
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

//getting current day
const day=new Date();
const dayName=days[day.getDay()];
dayEL.textContent=dayName;

//getting current date
let month=day.toLocaleString("default",{month:"long"});
let date=day.getDate();
let year=day.getFullYear();
dateEL.textContent=`${date} ${month} ${year}`;


//add event
btnEL.addEventListener("click",(e)=>{
    e.preventDefault();


    //check if input field is empty
    if(inputEL.value!==""){
        const search=inputEL.value;
        inputEL.value="";

        findLocation(search);
    }else{
        console.log("Please enter a location");
    }

})

async function findLocation(name){
    iconsContainer.innerHTML="";
    dayInfoEL.innerHTML="";
    listContentEL.innerHTML="";
    try{
        const API_URL=`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const data=await fetch(API_URL);
        const result=await data.json();
        console.log(result);

        if(result.cod==="404"){
           const message=`<h2 class="weather_temp">${result.cod}</h2>
           <h3 class="cloudtxt">${result.message}</h3>`;
           iconsContainer.insertAdjacentHTML("afterbegin",message);
        }
        else{
            //display img content and temp
            const ImageContent=displayImgContent(result);


            //display the right side content
            const content=rightSideContent(result);

            //forecast function
            displayForeCast(result.coord.lat,result.coord.lon);

            setTimeout(()=>{
            iconsContainer.insertAdjacentHTML("afterbegin",ImageContent);
            iconsContainer.classList.add("fadeIn");
            dayInfoEL.insertAdjacentHTML("afterbegin",content)
            },1000);
        }
        

        
    }catch(error){}
    
}

//display img content and temp
function displayImgContent(result){
    return `<img src="https://openweathermap.org/img/wn/${result.weather[0].icon}@4x.png" alt="">
    <h2 class="weather_temp">${Math.round(result.main.temp-273.15)}°C</h2>
    <h3 class="cloudtxt">${result.weather[0].description}</h3>`;
}


//display the right side content
function rightSideContent(result){
    return `<div class="content">
    <p class="title">NAME</p>
    <span class="value">${result.name}</span>
</div>
<div class="content">
    <p class="title">TEMP</p>
    <span class="value">${Math.round(result.main.temp-273.15)}°C</span>
</div>
<div class="content">
    <p class="title">HUMIDITY</p>
    <span class="value">${result.main.humidity}%</span>
</div>
<div class="content">
    <p class="title">WIND SPEED</p>
    <span class="value">${result.wind.speed}km/h</span>
</div>`;
}


async function displayForeCast(lat,long){
    const foreCast_API=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`; 
    const data=await fetch(foreCast_API);
    const result=await data.json();
    //filter the forecast data
    const uniqeForecastDays=[];
    const daysForecast=result.list.filter((forecast)=>{
        const forecastDate=new Date(forecast.dt_txt).getDate();
        if(!uniqeForecastDays.includes(forecastDate)){
            return uniqeForecastDays.push(forecastDate);
        }
    });
    console.log(daysForecast);
    

    daysForecast.forEach((content,indx) => {
        if(indx<=3){
            listContentEL.insertAdjacentHTML("afterbegin",foreCast(content));
        }
    })

}



//forecast html content
function foreCast(content){

    const day=new Date(content.dt_txt);
    const dayName=days[day.getDay()];

    return `<li>
    <img src="https://openweathermap.org/img/wn/${content.weather[0].icon}@2x.png"  />
    <span>${dayName.slice(0,3)}</span>
    <span class="day_temp">${Math.round(content.main.temp-273.15)}°C</span>
</li>`;
}