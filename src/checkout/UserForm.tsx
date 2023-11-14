import {Col, Form, Row} from "react-bootstrap";
import React, {ChangeEvent} from "react";
import {useTranslation} from 'react-i18next';
import {UserDto} from "../generated/api/checkoutOrchestrationApi";
import {AddressDto} from "../generated/api/userOrchestrationApi";

export interface UserFormProp {
  user: UserDto,
  updateUser: (user: UserDto) => void,
}

const UserForm = ({user, updateUser}: UserFormProp) => {

  const {t} = useTranslation();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (name !== 'phone') {
      user.addressDto[name as keyof AddressDto] = value as string;
    } else {
      user[name] = value as string;
    }
    updateUser(user)
  }

  return (

      <div className="userForm">
        <Form>
          <Row className="mb-2">
          </Row>
          <Row className="mb-2">
            <Form.Group as={Col} md="6">
              <Form.Label className='firstName'><>{t('checkout.userForm.userForm.firstName')}</>
              </Form.Label>
              <Form.Control
                  id={Math.random.toString()}
                  type="text"
                  className="checkoutInfo"
                  name="firstName"
                  value={user.addressDto["firstName"]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label><>{t('checkout.userForm.userForm.lastName')}</>
              </Form.Label>
              <Form.Control
                  id={Math.random.toString()}
                  type="text"
                  className="checkoutInfo"
                  name="lastName"
                  value={user.addressDto["lastName"]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              />
            </Form.Group>

          </Row>
          <Row className="mb-12">
            <Form.Group as={Col} md="12">
              <Form.Label><>{t('checkout.userForm.userForm.company')}</>
              </Form.Label>
              <Form.Control
                  id={Math.random.toString()}
                  type="text"
                  className="checkoutInfo"
                  name="company"
                  value={user.addressDto["company"]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
              />
            </Form.Group>
          </Row>
          <Row className="mb-12">
            <Form.Group as={Col} md="6">
              <Form.Label><>{t('checkout.userForm.userForm.street')}</>
              </Form.Label>
              <Form.Control
                  id={Math.random.toString()}
                  type="text"
                  className="checkoutInfo"
                  name="address"
                  value={user.addressDto["address"]}
                  onChange={handleInputChange}

              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label><>{t('checkout.userForm.userForm.number')}</>
              </Form.Label>
              <Form.Control
                  id={Math.random.toString()}
                  type="text"
                  className="checkoutInfo"
                  name="zipCode"
                  value={user.addressDto["zipCode"]}
                  onChange={handleInputChange}
              />
            </Form.Group>
          </Row>
          <Row className="mb-12">
            <Form.Group as={Col} md="4">
              <Form.Label><>{t('checkout.userForm.userForm.postcode')}</>
              </Form.Label>
              <Form.Control
                  id={Math.random.toString()}
                  type="text"
                  className="checkoutInfo"
                  name="poBox"
                  value={user.addressDto["poBox"]}
                  onChange={handleInputChange}

              />
            </Form.Group>
            <Form.Group as={Col} md="8">
              <Form.Label><>{t('checkout.userForm.userForm.city')}</>
              </Form.Label>
              <Form.Control
                  id={Math.random.toString()}
                  type="text"
                  className="checkoutInfo"
                  name="city"
                  value={user.addressDto["city"]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}

              />

            </Form.Group>
          </Row>
          <Row className="mb-12">
            <Form.Group as={Col} md="6">
              <Form.Label><>{t('checkout.userForm.userForm.country')}</>
              </Form.Label>
              <Form.Control
                  id={Math.random.toString()}
                  type="text"
                  className="checkoutInfo"
                  name="country"
                  value={user.addressDto["country"]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}

              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label><>{t('checkout.userForm.userForm.phone')}</>
              </Form.Label>
              <Form.Control
                  id={Math.random.toString()}
                  type="text"
                  className="checkoutInfo"
                  name="phone"
                  value={user.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}

              />
            </Form.Group>
          </Row>
        </Form>
      </div>

  )
}

export default UserForm