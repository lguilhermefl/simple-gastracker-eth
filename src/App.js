import { useState, useEffect } from 'react';
import styled from 'styled-components';

import sgMail from '@sendgrid/mail';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export default function App() {

    const [gastPrice, setGasPrice] = useState({
        low: "00",
        average: "00",
        fast: "00"
    });

    useEffect(() => {
        setInterval(() => {
            axios
                .get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETH_API_KEY}`)
                .then(({ data }) => {
                    console.log(data.result);
                    setGasPrice({
                        low: data.result.SafeGasPrice,
                        average: data.result.ProposeGasPrice,
                        fast: data.result.FastGasPrice
                    })

                    if (data.result.FastGasPrice <= 8) {
                        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                        const msg = {
                            to: 'luizguilherme77@gmail.com',
                            from: 'luizguilherme77@gmail.com',
                            subject: 'Gas is low!!!',
                            text: 'Gas is low!!!',
                            html: `<strong>Low: ${data.result.SafeGasPrice}</strong><br>
                                    <strong>Propose: ${data.result.ProposeGasPrice}</strong><br>
                                    <strong>Fast: ${data.result.FastGasPrice}</strong><br>
                                    `
                        };
                        sgMail
                            .send(msg)
                            .then(() => { }, error => {
                                console.error(error);

                                if (error.response) {
                                    console.error(error.response.body);
                                };
                            });
                    }
                })
        }, 10000);
    }, []);

    return (
        <Container>
            <Card>
                <GasPrices>
                    <BoxPrice color='#00c9a7'>
                        <h4>SLOW</h4>
                        <span>{gastPrice.low} Gwei</span>
                    </BoxPrice>
                    <BoxPrice color='#3498db'>
                        <h4>AVERAGE</h4>
                        <span>{gastPrice.average} Gwei</span>
                    </BoxPrice>
                    <BoxPrice color='rgb(165, 42, 42)'>
                        <h4>FAST</h4>
                        <span>{gastPrice.fast} Gwei</span>
                    </BoxPrice>
                </GasPrices>
            </Card>
        </Container>
    );
}

const Container = styled.div`
    padding: 15px;
    margin: auto;
    box-sizing: border-box;
    width: 100%;
    @media (min-width: 500px) {
        width: 50%;
    }
`

const Card = styled.div`
    box-shadow: 0 0.5rem 1.2rem rgb(189 197 209 / 20%);
    padding: 1.25rem;
    box-sizing: border-box;
`

const GasPrices = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    box-sizing: border-box;
    @media (min-width: 500px) {
        flex-direction: row;
    }
`

const BoxPrice = styled.div`
    border: 1px solid #e7eaf3;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    box-sizing: border-box;
    @media (min-width: 500px) {
        width: 33%;
    }
    h4 {
        font-weight: 700;
        font-size: .875rem;
        color: #4a4f55;
        margin-bottom: 10px;
        margin-top: 5px;
    }

    span {
        font-size: 1.3125rem;
        color: ${props => props.color};
    }
`