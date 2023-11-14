import React, {ChangeEvent, useState} from "react";
import {Button, Col, Container, FormLabel, InputGroup, Row} from "react-bootstrap";
import UserForm from "./UserForm";
import {Trans} from 'react-i18next';
import {UserDto} from "../generated/api/checkoutOrchestrationApi";

export interface UserAddressProps {

  billingUser: UserDto,
  shippingUser: UserDto,
  editShipmentAddress: boolean | undefined,
  toggleShipmentAddress: (e: ChangeEvent) => void,
  updateAddress: (address: UserDto, isBillingAddress: boolean) => void,
  buttonMessage: string,
  isUserCreated: boolean | undefined,

}

const UserAddress = ({
                       billingUser,
                       shippingUser,
                       isUserCreated,
                       buttonMessage,
                       editShipmentAddress,
                       toggleShipmentAddress,
                       updateAddress
                     }: UserAddressProps) => {

  const [editBillingUser, setEditBillingUser] = useState<boolean>(false);
  const [currentBillingUser, setCurrentBillingUser] = useState(billingUser);
  const [currentShippingUser, setCurrentShippingUser] = useState(shippingUser);

  const updateBillingUser = (user: UserDto) => {
    setCurrentBillingUser((prev) => ({...prev, user}));
  }

  const updateShippingUser = (user: UserDto) => {
    setCurrentShippingUser((prev) => ({...prev, user}));
  }

  const toggleBillingUser = () => {
    setEditBillingUser(!editBillingUser)
  }

  return (
      <Container fluid className="checkoutUi">

        <div className="userAddresses">
          <Row>
            <Col className="col-sm-2 col-8">
                <span className="billingAddressTitle"><Trans
                    i18nKey={'checkout.userAddress.userAddresses.billingAddressTitle'}/></span>
            </Col>


            <Col xs={2}>
              <div className={editBillingUser
              || !isUserCreated
                  ? "formEditButtonHide" : "formEditButton"}>
                <Button type="button" variant="primary"
                        onClick={toggleBillingUser}>
                  <Trans i18nKey={'checkout.userAddress.userAddresses.editButton.button'}/>
                </Button>
              </div>
            </Col>
          </Row>
          {editBillingUser || !isUserCreated
              ?
              <UserForm key="ui-form-1"
                        user={currentBillingUser}
                        updateUser={updateBillingUser}
              />

              :

              <Container fluid>
                <Row className="userInfoSaved">
                  <Col xs={{span: 12}}
                       className="userInfoSaved">{currentBillingUser.addressDto.company}</Col>
                </Row>
                <Row className="userInfoSaved">
                  <Col xs={{span: 5}}
                       className="userInfoSaved firstName">{currentBillingUser.addressDto.firstName}</Col>

                  <Col xs={{span: 7}}
                       className="userInfoSaved lastName">{currentBillingUser.addressDto.lastName}</Col>
                </Row>
                <Row className="userInfoSaved">
                  <Col xs={{span: 5}}
                       className="userInfoSaved">{currentBillingUser.addressDto.address}</Col>

                  <Col xs={{span: 7}}
                       className="userInfoSaved">{currentBillingUser.addressDto.zipCode}</Col>
                </Row>
                <Row className="userInfoSaved">
                  <Col xs={{span: 5}}
                       className="userInfoSaved">{currentBillingUser.addressDto.poBox}</Col>

                  <Col xs={{span: 7}}
                       className="userInfoSaved city">{currentBillingUser.addressDto.city}</Col>
                </Row>
                <Row className="userInfoSaved">
                  <Col xs={{span: 5}}
                       className="userInfoSaved country">{currentBillingUser.addressDto.country}</Col>
                </Row>
                <Row className="userInfoSaved">
                  <Col xs={{span: 12}}
                       className="userInfoSaved">{currentBillingUser.phone}</Col>
                </Row>
              </Container>
          }

          <div className={editBillingUser
          || !isUserCreated
              ? "saveUserButton" : "hidden"}>
            <Button variant="primary" onClick={() => {
              updateAddress(currentBillingUser, false);
            }}>{buttonMessage}
            </Button>
          </div>

          <div className="checkoutShipment">

            <div>
              <h1 className="shipmentAddressTitle"><Trans
                  i18nKey={'checkout.userAddress.userAddresses.shipmentAddressTitle'}/>
              </h1>
              <div className="shipmentAddress">
                <input
                    type="checkbox"
                    name="shipmentAddress"
                    className="shipmentLabel"
                    checked={!editShipmentAddress}
                    onChange={(e) => toggleShipmentAddress(e)}
                />
                <Trans
                    i18nKey={'checkout.userAddress.userAddresses.shipmentAddress'}/>
              </div>

              {editShipmentAddress
                  ? <UserForm key="ui-form-2"
                              user={currentShippingUser}
                              updateUser={updateShippingUser}
                  /> : ""}
            </div>
            <div className={editShipmentAddress
            || !isUserCreated
                ? "saveUserButton" : "hidden"}>
              <Button variant="primary"
                      onClick={() => {
                        updateAddress(currentShippingUser, false);
                      }}>{buttonMessage}
              </Button>
            </div>
          </div>
        </div>
        <div className="shipmentOption">
          <Col xs={2} className="label">
            <label><Trans
                i18nKey={'checkout.userAddress.shipmentOption.label'}/></label>
          </Col>
          <Row className="radioRow">
            <Col className="col-sm-4 col-3">
              <Row>
                <InputGroup>
                  <Col xs={2}>
                    <InputGroup.Radio
                        aria-label="Radio button for following text input"
                        className="form-check form-check-inline" type="radio"
                        name="inlineRadioOptions" id="inlineRadio1"
                        value="option1" defaultChecked/>
                  </Col>
                  <Col>

                    <FormLabel className="checkboxLabel"
                               htmlFor="inlineRadio1"><Trans
                        i18nKey={'checkout.userAddress.shipmentOption.radioLabel.standard.label'}/></FormLabel>
                  </Col>
                </InputGroup>
                <Col xs={{offset: 2}}>
                  <FormLabel className="checkboxLabel"><Trans
                      i18nKey={'checkout.userAddress.shipmentOption.radioLabel.standard.value'}/></FormLabel>
                </Col>
              </Row>
            </Col>

            <Col className="col-sm-4 col-3">
              <Row>
                <InputGroup>
                  <Col xs={2}>
                    <InputGroup.Radio
                        aria-label="Radio button for following text input"
                        className="form-check form-check-inline"
                        htmlFor="exampleRadios2" type="radio"
                        name="inlineRadioOptions"/>
                  </Col>
                  <Col>
                    <FormLabel className="checkboxLabel"><Trans
                        i18nKey={'checkout.userAddress.shipmentOption.radioLabel.express.label'}/></FormLabel>
                  </Col>
                </InputGroup>
                <Col xs={{offset: 2}}>
                  <FormLabel className="checkboxLabel"><Trans
                      i18nKey={'checkout.userAddress.shipmentOption.radioLabel.express.value'}/></FormLabel>
                </Col>
              </Row>
            </Col>

            <Col className="col-sm-4 col-3">
              <Row>
                <InputGroup>
                  <Col xs={2}>
                    <InputGroup.Radio
                        aria-label="Radio button for following text input"
                        className="form-check form-check-inline"
                        htmlFor="exampleRadios2"
                        type="radio"
                        name="inlineRadioOptions"/>
                  </Col>
                  <Col>
                    <FormLabel className="checkboxLabel"><Trans
                        i18nKey={'checkout.userAddress.shipmentOption.radioLabel.pickup.label'}/></FormLabel>
                  </Col>
                </InputGroup>
                <Col xs={{offset: 2}}>
                  <FormLabel className="checkboxLabel"><Trans
                      i18nKey={'checkout.userAddress.shipmentOption.radioLabel.pickup.value'}/></FormLabel>
                </Col>
              </Row>
            </Col>
          </Row>

        </div>
        <div className="paymentOption">
          <Col xs={2} className="label">
            <label><Trans
                i18nKey={'checkout.userAddress.paymentOption.label'}/></label>
          </Col>
          <Row className="radioRow">
            <Col className="col-sm-4 col-3">
              <Row>
                <InputGroup>
                  <Col xs={2}>
                    <InputGroup.Radio
                        aria-label="Radio button for following text input"
                        className="form-check form-check-inline" type="radio"
                        name="inlineRadioOption" defaultChecked/>
                  </Col>
                  <Col>
                    <FormLabel className="checkboxLabel"
                               htmlFor="inlineRadio1"><Trans
                        i18nKey={'checkout.userAddress.paymentOption.radioLabel.bankTransfer.label'}/></FormLabel>
                  </Col>
                </InputGroup>
                <Col xs={{offset: 2}}>
                  <FormLabel className="checkboxLabel"><Trans
                      i18nKey={'checkout.userAddress.paymentOption.radioLabel.bankTransfer.value'}/></FormLabel>
                </Col>
              </Row>
            </Col>

            <Col className="col-sm-4 col-3">
              <Row>
                <InputGroup>
                  <Col xs={2}>
                    <InputGroup.Radio
                        aria-label="Radio button for following text input"
                        className="form-check form-check-inline"
                        htmlFor="exampleRadios2" type="radio"
                        name="inlineRadioOption"/>
                  </Col>
                  <Col>
                    <FormLabel className="checkboxLabel"><Trans
                        i18nKey={'checkout.userAddress.paymentOption.radioLabel.creditCard.label'}/></FormLabel>
                  </Col>
                </InputGroup>
                <Col xs={{offset: 2}}>
                  <FormLabel className="checkboxLabel"><Trans
                      i18nKey={'checkout.userAddress.paymentOption.radioLabel.creditCard.value'}/></FormLabel>
                </Col>
              </Row>
            </Col>

            <Col className="col-sm-4 col-3">
              <Row>
                <InputGroup>
                  <Col xs={2}>
                    <InputGroup.Radio
                        aria-label="Radio button for following text input"
                        className="form-check form-check-inline"
                        htmlFor="exampleRadios2" type="radio"
                        name="inlineRadioOption"/>
                  </Col>
                  <Col>
                    <FormLabel className="checkboxLabel"><Trans
                        i18nKey={'checkout.userAddress.paymentOption.radioLabel.paypal.label'}/></FormLabel>
                  </Col>
                </InputGroup>
                <Col xs={{offset: 2}}>
                  <FormLabel className="checkboxLabel"><Trans
                      i18nKey={'checkout.userAddress.paymentOption.radioLabel.paypal.value'}/></FormLabel>
                </Col>
              </Row>
            </Col>
          </Row>

        </div>
      </Container>
  )
}

export default UserAddress;