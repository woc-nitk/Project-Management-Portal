import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/logo-min.png';

export default function Footer() {

    const Footer = styled.footer`
        margin-top: 50px;
        width: 100%;
        min-height: 300px;
        background-color: #242933;
        font-size: 20px;
        color: white;

        & a{
            text-decoration: none;
        }

        & .container{
            display: flex;
            flex-wrap: wrap;
        }
    `;

    const Title = styled.div`
        padding: 30px;
        width: calc(100% / 3);
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;

        & a{
            font-weight: 300;
            font-size: 16px;
        }

        & img{
            height: 200px;
        }

        @media (max-width: 760px) {
            width: 100%;
        }
    `;

    const Links = styled.div`
        padding: 30px;
        width: calc(100% / 3);
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        @media (max-width: 760px) {
            width: 100%;
            min-height: 250px; 
        }

        & div{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
        }

        & a{
            font-size: 16px;
            color: white;
            transition: all 0.2s ease-in-out;
        }

        & a:hover{
            color:#0088cc;
        }
    `;

    const Contact = styled.div`
        padding: 30px;
        width: calc(100% / 3);
        text-align: center;

        @media (max-width: 760px) {
            width: 100%;
        }

        & h3{
            margin-bottom: 30px;
        }

        & a{
            color: #0088cc;
        }
        

        & p{
            font-size: 16px;
        }
    `;

    return (
        <Footer>
            <div className="container">
                <Title>
                    <img src={logo}></img>
                </Title>
                <Links>
                    <h3>Links</h3>
                    <div>
                        <Link to="/">Home</Link>
                        <Link to="/about">About</Link>
                        <Link to="/organizations">Organizations</Link>
                        <Link to="/projects">Projects</Link>
                        <Link to="/profile">Profile</Link>
                    </div>
                </Links>
                <Contact>
                    <h3>Contact Us</h3>
                    <p>Email: <a href="mailto:winterofcode@nitk.edu.in">winterofcode@nitk.edu.in</a></p>
                </Contact>
            </div>
        </Footer>
    )
}
