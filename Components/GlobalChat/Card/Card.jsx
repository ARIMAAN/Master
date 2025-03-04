import Image from "next/image";
import React from "react";

//INTERNAL IMPORT
import images from "../../../assets";
import Style from "./Card.module.css";

const Card = ({ readMessage, el, i, readUser }) => {
  return (
    <div >
        <div className={Style.Card}>
          <div className={Style.Card_box}>
            <div className={Style.Card_box_left}>
              <Image
                src={images.accountName}
                alt="username"
                width={50}
                height={50}
                className={Style.Card_box_left_img}
              />
            </div>
            <div className={Style.Card_box_right}>
              <div className={Style.Card_box_right_middle}>
                <h4>{el.name}</h4>
                {/* <small>{el.pubkey}..</small> */}
              </div>
              <div className={Style.Card_box_right_end}>
                <small>{i + 1}</small>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Card;
