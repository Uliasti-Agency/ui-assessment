import React from 'react';
import {Col, Row} from 'react-bootstrap';
import {Trans} from 'react-i18next';

export interface MessageProps {
  level: string,
  message: string
}

const Message = ({level, message}: MessageProps) => {

  return (
      <div className="messages">
        {level === "SUCCESS" ?
            <div>
              <Row className="content">
                <Col xs={2}>
                  <img src="/assets/messages/background-green.svg" alt='check-circle-fill'
                       className="background"/>
                  <img src="/assets/messages/check-circle-fill.svg" style={{width: 16, height: 16}}
                       alt='check-circle-fill' className="level-image"/>
                </Col>
                <Col xs={10}>
                  <span className="level"><Trans
                      i18nKey={'messages.messages.success'}/></span>: {message}
                </Col>
              </Row>
            </div>
            :
            level === "WARNING" ?
                <div>
                  <Row className="content">
                    <Col xs={2}>
                      <img src="/assets/messages/background-yellow.svg" alt='background-yellow'
                           className="background"/>
                      <img src="/assets/messages/circle-warning.svg" style={{width: 16, height: 16}}
                           alt='circle-warning' className="level-image"/>
                    </Col>
                    <Col xs={10}>
                      <span className="level"><Trans
                          i18nKey={'messages.messages.warning'}/></span>: {message}
                    </Col>
                  </Row>
                </div>
                :
                <div>
                  <Row className="content">
                    <Col xs={2}>
                      <img src="/assets/messages/background-red.svg" alt='background-red'
                           className="background"/>
                      <img src="/assets/messages/circle-remove.svg" style={{width: 16, height: 16}}
                           alt='circle-remove' className="level-image"/>
                    </Col>
                    <Col xs={10}>
                      <span className="level"><Trans
                          i18nKey={'messages.messages.error'}/></span>: {message}
                    </Col>
                  </Row>
                </div>
        }
      </div>
  );

};

export default Message;
