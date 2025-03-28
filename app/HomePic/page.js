import Image from "next/image";
import foodPic from "../../app/images/foods.png";
import style from "./HomePic.module.css";
const HomePic = () => {
  return (
    <div className={style.picContainer}>
      <section className={style.fade}></section>
      <Image
        src={foodPic}
        alt="Delicious Foods"
        width={700}
        height={600}
        className={style.picture}
      />
    </div>
  );
};

export default HomePic;
