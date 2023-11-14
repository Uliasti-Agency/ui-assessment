import React, {ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent,} from 'react';
import {Button, Col, Form, Row,} from 'react-bootstrap';
import util from '../util';
import {ItemDto} from "../generated/api/cartOrchestrationApi";
import {CurrencyDto} from "../generated/api/priceOrchestrationApi";
import {Trans} from 'react-i18next';

export interface CartItemProps {
  item: ItemDto,
  handleDelete: (e: MouseEvent) => void,
  handleDecrease: (e: MouseEvent) => void,
  handleEnterPressed: (e: KeyboardEvent) => void,
  handleBlur: (e: FocusEvent) => void,
  handleQuantity: (e: ChangeEvent<HTMLInputElement>) => void,
  handleIncrease: (e: MouseEvent) => void,
  currency: CurrencyDto,
}

const CartItem = ({
                    item,
                    currency,
                    handleDelete,
                    handleDecrease,
                    handleEnterPressed,
                    handleBlur,
                    handleQuantity,
                    handleIncrease
                  }: CartItemProps) => {

  return <Row className="item">
    <Col md={2} className="image">{item.product && item.product.images ? <img
            src={item.product.images[0].url} alt={'product'}
            className="articleImage"/> :
        <img src={"/assets/VeloxLogo-Grey.png"} alt={'product'}
             className="articlePlaceholder"/>}</Col>
    <Col md={3} className="product col-content">
      <Row className="name">
        <Col xs={12}
             className="label">{item.name ? item.name :
            <Trans i18nKey={'cart.cartItem.name.notSpecified.message'}/>}</Col>
        <Col>
          <Row className="closeButtonMobile">
            <Col xs={1} className="mobileAdjust"><Button className="delete"
                                                         onClick={(e) => handleDelete(e)}>x</Button></Col>
            <Col className="message">
              {item && item.messages ?
                  util.displayItemMessage(item.messages, "left")
                  :
                  ""
              }
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mobileImage">
        <Col>{item.product && item.product.images ? <img
                src={item.product.images[0].url} alt={'product'}
                className="articleImage"/> :
            <img src={"/assets/VeloxLogo-Grey.png"} alt={'product'}
                 className="articlePlaceholder"/>}</Col>
      </Row>
      <Row className="itemInfo mobileAvailability">
        <Col>{util.displayAvailability(
            item.availability)}</Col>
      </Row>
      <Row className="adjustment">
        <Col>
          <Button className="decrease"
                  onClick={(e) => handleDecrease(e)}>-</Button>
          <Form.Group className="form-group">
            <Form.Control className="input" type="text"
                          value={item.quantity}
                          onChange={handleQuantity}
                          onBlur={(e) => handleBlur(e)}
                          onKeyPress={(e) => handleEnterPressed(e)}
            />
          </Form.Group>
          <Button className="increase"
                  onClick={(e) => handleIncrease(e)}>+</Button>
        </Col>
      </Row>
    </Col>
    <Col md={2} className="articleNumber col-content">
      <Row>
        <Col className="mobileLabel"><Trans i18nKey={'cart.cart.cartList.tableHeader.articleNumber.label'}/></Col>
        <Col className="mobileValue">{item.articleId}</Col>
      </Row>
    </Col>
    <Col md={1}
         className="itemInfo availability col-content">{util.displayAvailability(
        item.availability)}</Col>
    <Col md={1} className="itemInfo price col-content">
      <Row>
        <Col className="mobileLabel">Price</Col>
        <Col className="mobileValue">{util.displayPrice(
            item.unitPrice, currency)}</Col>
      </Row>
    </Col>
    <Col md={2} className="itemInfo price col-content">
      <Row>
        <Col className="mobileLabel">Subtotal</Col>
        <Col className="mobileValue">{util.displayPrice(
            item.price, currency)}</Col>
      </Row>
    </Col>
    <Col xs={1} className="closeButton">
      <Row className="content">
        <Col xs={1} className="button">
          <Button variant="primary" type="button"
                  onClick={(e) => handleDelete(e)}>x</Button>
        </Col>
        <Col className="message">
          {item && item.messages ?
              util.displayItemMessage(item.messages)
              :
              ""
          }
        </Col>
      </Row>
    </Col>
  </Row>

}

export default CartItem;