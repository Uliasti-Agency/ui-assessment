import React, {useEffect} from 'react';
import {Button, Container} from 'react-bootstrap';
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import conf from "../config";
import {Token} from "../../types/token";
import {Trans} from 'react-i18next';
import {setCurrentLanguage} from "../redux/actions/language";
import {Language} from "../../types/language";


export interface ConfirmationProps {
  orderNum: string,
}

const Confirmation = ({orderNum}: ConfirmationProps) => {
  const history = useHistory();
  const token: Token = useSelector((state: any) => state.addAuthData);
  const language: Language = useSelector((state: any) => state.language);
  useEffect(() => {
    setCurrentLanguage(language);
  });
  orderNum = useSelector((state: any) => state.getOrderNumber.orderNumber);
  const redirectHandler = () => {
    history.push(conf.urls.product_list)
  }
  return (
      <Container>
        <div className="startPage">

          <div className="container heading">
            <div className="confirmOrderText">
              <p><Trans i18nKey={'confirmation.confirmation.thanks.title'}/></p>
            </div>
            <div className="confirmOrderNum">
              #{orderNum ? orderNum : ""}
            </div>
            <div className="confirmOrderEmail">
              <h3>

            <Trans i18nKey={'confirmation.confirmation.email.sent.title'}
                                values={{ email: token.userInfo ? token.userInfo.email : ""}}/>

              </h3>
            </div>

            <div className="col-md-12 text-center">
              <Button variant="primary" type="button"
                      onClick={redirectHandler}>
                <Trans i18nKey={'confirmation.confirmation.continue.shopping.title'}/>
              </Button>
            </div>
          </div>
        </div>
      </Container>
  );
}

export default Confirmation;

