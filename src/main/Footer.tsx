import React from 'react';
import {Col, Navbar, Row} from "react-bootstrap";
import {useTranslation} from 'react-i18next';


const Footer = () => {
  const {t} = useTranslation();
  return (
      <Navbar fixed="bottom" className="footer">
        <Row>
          <Col md={{span: 6, order: 5}}>
            <div className="links">
              <a className="impressum" href="#impressum">
                <>{t('main.footer.footer.impressum.label')}</>
              </a>
              <> |</>
              <a className="privacyPolicy" href="#privacy_policy">
                <>{t('main.footer.footer.privacyPolicy.label')}</>
              </a>
              |
              <a className="termsOfService" href="#terms_of_service">
                <>{t('main.footer.footer.termsOfService.label')}</>
              </a>
            </div>
          </Col>
          <Col md={{span: 3, order: 1}}>
          </Col>
          <Col md={{span: 3, order: 0}}>
            <div className="tradeMark"> &copy;<> {t('main.footer.footer.tradeMark.label')} </>
            </div>
          </Col>
        </Row>
      </Navbar>
  )
}

export default Footer;

