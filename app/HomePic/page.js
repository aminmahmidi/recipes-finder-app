import Image from 'next/image';
import foodPic from '../../app/images/foods.png';
import style from "./HomePic.module.css"
const HomePic = () => {
  return (
    <Image 
      src={foodPic} 
      alt="Delicious Foods" 
      width={700} 
      height={500} 
     className={style.picture}
    />
  );
};

export default HomePic;