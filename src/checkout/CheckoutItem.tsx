import React from 'react';
import util from "../util";
import {Col, Container, Row} from "react-bootstrap";
import {Currency} from "../../types/currency";
import {useSelector} from "react-redux";
import {OrderEntryDtoExtended} from "./CheckoutBody";

export interface CheckoutItemProps {
  item: OrderEntryDtoExtended,
}

const CheckoutItem = ({item}: CheckoutItemProps) => {
  const currency: Currency = useSelector((state: any) => state.currency);
  return (
      <Container fluid>
        <Row className="checkoutItem">
          <Col xs={4} className="image">{item.imageURL ? <img
                  src={item.imageURL} alt={'product'}
                  className="itemInfo articleImage"/> :
              <img src={"/assets/VeloxLogo-Grey.png"} alt={'product'}
                   className="articlePlaceholder"/>}</Col>
          <Col className="col-sm-2 col-4 text-center">
            {item.quantity}
          </Col>

          <Col xs={2}
               className="availability text-center">
            {util.displayAvailability(
                item.availability)}
          </Col>
          <Col xs={2}
               className="unitPrice">
            {item.unitPrice ? util.formatPrice(
                    item.unitPrice, currency)
                : "On request"}
          </Col>
          <Col className="col-sm-2 col-4 text-right">
            {item.price ? util.formatPrice(item.price,
                currency) : "On request"}</Col>
        </Row>
      </Container>
  );
}
export default CheckoutItem
