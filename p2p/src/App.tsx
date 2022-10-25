import React, { useState } from 'react';
import './Peer.css';
import fluence_logo from './assets/images/fluence.png'
import app_logo from "./assets/icons/app-logo.png";

import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import { sayHello, registerHelloPeer } from './_aqua/getting-started';

const relayNodes = [krasnodar[4], krasnodar[5], krasnodar[6]];

function App() {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [helloMessage, setHelloMessage] = useState<string | null>(null);

    const [peerIdInput, setPeerIdInput] = useState<string>('');
    const [relayPeerIdInput, setRelayPeerIdInput] = useState<string>('');

    const connect = async (relayPeerId: string) => {
        try {
            await Fluence.start({ connectTo: relayPeerId });
            setIsConnected(true);
            registerHelloPeer({
                hello: (from) => {
                    setHelloMessage('Hello from: \n' + from);
                    return 'Hello back to you, \n' + from;
                },
            });
        } catch (err) {
            console.log('Peer initialization failed', err);
        }
    };

    const helloBtnOnClick = async () => {
        if (!Fluence.getStatus().isConnected) {
            return;
        }

        const res = await sayHello(peerIdInput, relayPeerIdInput);
        setHelloMessage(res);
    };

    return (
        <div className='Peer'>
            <img src={fluence_logo} alt="Fluence" className='lefty' />
            <img src={fluence_logo} alt="Fluence" className='righty' />
            <nav className="navbar">
                <div className="logo-box"  onClick={()=>{window.location.href = "https://storz-test.pages.dev/"}}>
                    <img src={app_logo} alt="" />
                    <p>Storz</p>
                </div>
                <a href="https://storz-test.pages.dev/app" className='connect-btn'>
                    Go Back
                </a>
            </nav>
            <div className="file-header">
                <p>
                    P2P Sharing
                </p>
                <div className='file-desc'>Share files over IPFS via Fluence relay.</div>
            </div>

            {isConnected ?
                <>
                    <div className="glass-file-desc">
                        <div className="glass-file-box">
                            <p >Network Information</p>
                            <div className="network-info">
                                <div className="id-bold">
                                    <p>Peer ID :</p>
                                    <p>Connected Relay ID :</p>
                                </div>
                                <div className="id-med">
                                    <p>{Fluence.getStatus().peerId!}</p>
                                    <p>{Fluence.getStatus().relayPeerId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="outline-con">
                        <div className="outline-head">
                            <div>Say Hello!</div>

                        </div>
                        <div className="outline-desc">
                            <div className="outline-desc-key">
                                <div className="keys">
                                    Target Peer ID :
                                </div>
                                <div className="keys">
                                    Target Relay ID :
                                </div>
                            </div>
                            <div className="outline-desc-desc">
                                <div className="key-desc">
                                    <input className="relay-inp" type="text"
                                        onChange={(e) => setPeerIdInput(e.target.value)}
                                        value={peerIdInput} />
                                </div>
                                <div className="key-desc">
                                    <input className="relay-inp" type="text"
                                        onChange={(e) => setRelayPeerIdInput(e.target.value)}
                                        value={relayPeerIdInput} />
                                </div>
                            </div>
                        </div>
                        <div className="hello-btn">
                            <button className='connect-btn' id='connect-btn' onClick={helloBtnOnClick}>
                                Send
                            </button>
                        </div>
                        
                    </div>
                    {helloMessage && (
                            <div className='msg-box'>
                                <p>Message</p>
                                <div className='message'> {helloMessage} </div>
                            </div>
                        )}
                </>
                :
                <div className="glass-file-desc">         
                    <div className="glass-file-box">
                        <p>Pick a Relay</p>
                        <div className="relay-con">
                            {relayNodes.map((x) => (
                                <div className="relay-box" key={x.peerId}>
                                    <input readOnly className="link" value={x.peerId} />
                                    <button className='connect-btn' onClick={() => connect(x.multiaddr)}>Connect</button>
                                </div>
                            ))}
                        </div>
                        <div className="fluence-desc">
                            <p>This is a peer-to-peer file sharing demo , that uses Fluence protocol to advertize and discover files.
                                <br />
                                First, choose your local file and make it discoverable via Fluence network.
                                Other peers may discover your device as a holder of the file and ask it to provide
                                the file to a publicly accessible IPFS node. Your device will upload the file to the IPFS
                                node and then share its multiaddress with the request peer.
                            </p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}


export default App;
