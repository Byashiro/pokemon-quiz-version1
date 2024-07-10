const getData = () => {
  const date = new Date();
  const hour = date.getHours();
  // const hour = 20;
  return hour;
}
  
const getCurrentTime = () => {
  // const time = getData();
  const time = 12;

  let pokeBgImg = '';

  if ( time >= 6 && time < 12 ) {
    pokeBgImg = 'url(' + require('@/assets/bg-poke-sunrise.jpg') + ')';
  }

  if ( time >= 12 && time < 18) {
    pokeBgImg = 'url(' + require('@/assets/bg-poke-day.png') + ')';
  }

  if ( time >= 18 && time < 20 ) {
    pokeBgImg = 'url(' + require('@/assets/bg-poke-sunset.png') + ')';
  }
  
  if ( time >= 20 ) {
    pokeBgImg = 'url(' + require('@/assets/bg-poke-night.png') + ')';
  }

  // console.log(pokeBgImg);

  return pokeBgImg;

}

export { getCurrentTime }

  