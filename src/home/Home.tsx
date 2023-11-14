import React, {useEffect} from 'react';
import {Container} from 'react-bootstrap';
import {Trans, useTranslation} from 'react-i18next';

let dataLayer = window.dataLayer = window.dataLayer || [];

const Home = () => {
  const {t} = useTranslation();
  document.title = t('home.home.homePageTitle');

  useEffect(() => {
    dataLayer.push({event: 'pageview'});
    dataLayer.push({event: 'gtm.dom'});
    dataLayer.push({event: 'gtm.load'});
  }, []);
  return (
      <Container>
        <div className="startPage">

          <div className="container heading">
            <h1><b><Trans i18nKey={'home.home.header.message'}/></b></h1>
            <div className="row padding">
              <div className="col-md-2">
              </div>
              <div className="col-md-10">
                <div className="row">
                  <div className="col-md-7">
                  </div>
                  <div className="col-md-5">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mainContent">
            <Trans i18nKey={'home.home.mainContent.message'}/>
          </div>

        </div>
      </Container>
  );
}
export default Home;