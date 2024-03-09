import { render, fireEvent, waitFor, screen} from '@testing-library/react';
import React from 'react';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


describe('test login', () => {
  test('displays error notice with invalid credentials', async () => {

    render(
        <Router>
            <Login/>
        </Router>
    );
    const errorMessage = screen.getByTestId("login-notice")
    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")
    const loginButton = screen.getByTestId("login-button")

    
    //Simulate user input
    fireEvent.change(emailInput, { target: { value: 'wrong@user.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Simulate form submission
    fireEvent.click(loginButton);
    
    await waitFor(() => {
        expect(errorMessage.textContent).toBe("Invalid Email or Password");
    })
  });
});

