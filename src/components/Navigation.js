import React from 'react'
import {Nav,Navbar,Container,NavDropdown, Button} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import logo from "../assets/logo.webp"
import { useSelector } from 'react-redux'
import { useLogoutUserMutation } from '../services/appApi'

function Navigation() {

  const user = useSelector((state)=>state.user)

  const [logoutUser,{isLoading,error}] = useLogoutUserMutation();

  async function handleLogout(e) {

    e.preventDefault();

    await logoutUser(user)

    window.location.replace("/")


  }



  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img src={logo} style={{ width: 100, height: 100 }} />
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
            <LinkContainer to="/chat">
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>
            {user && (
              <NavDropdown
                title={
                  <>
                    <img
                      src={user.picture}
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    {user.name}
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item>
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    style={{ width: 200 }}
                  >
                    Logout
                  </Button>
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation