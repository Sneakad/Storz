import React, { useState } from 'react'
import './Peer.css'
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion'
import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import { sayHello, registerHelloPeer } from '../../_aqua/script.ts';

const relayNodes = [krasnodar[4], krasnodar[5], krasnodar[6]];

const Peer = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [helloMessage, setHelloMessage] = useState("");
    const [peerIdInput, setPeerIdInput] = useState("");
    const [relayPeerIdInput, setRelayPeerIdInput] = useState("");

    const connect = async (relayPeerId) => {
        try {
            await Fluence.start({ connectTo: relayPeerId });
            setIsConnected(true);
            // Register handler for this call in aqua:
            // HelloPeer.hello(%init_peer_id%)
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


    return (
        <motion.div className='Peer' initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}>
            <Toaster />
            <div className="file-header">
                <p>
                    P2P Sharing
                </p>
                <div className='file-desc'>Share files over IPFS via Fluence relay.</div>
            </div>

            {isConnected ?
                <>
                    <div className="glass-file-desc">
                        <button onClick={() => { setIsConnected(false) }}>revert</button>
                        <div className="glass-file-box">
                            <p >Network Information</p>
                            <div className="network-info">
                                <div className="id-bold">
                                    <p>Peer ID :</p>
                                    <p>Connected Relay ID :</p>
                                </div>
                                <div className="id-med">
                                    <p>sdfsadgfdsgdsgsdgdgdgsdfgsdfgsdfgdg</p>
                                    <p>sdfsadgfdsgdsgsdgdgdgsdfgsdfgsdfgdg</p>
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
                                <p className="keys">
                                    Target Peer ID
                                </p>
                                <p className="keys">
                                    Target Relay ID
                                </p>
                            </div>
                            <div className="outline-desc-desc">
                                <p className="key-desc">
                                    
                                </p>
                                <p className="key-desc">
                                </p>
                                <p className="key-desc">
                                
                                </p>
                                <p className="key-desc">
                                </p>
                                <p className="key-desc">
            
                                </p>
                            </div>
                        </div>
                    </div>
                </>
                :
                <div className="glass-file-desc">
                    <button onClick={() => { setIsConnected(true) }}>revert</button>
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
                                the file to a publicly accessible IPFS node. Yur devide will upload the file to the IPFS
                                node and then share its multiaddress with the request peer.
                            </p>
                        </div>
                    </div>
                </div>
            }
        </motion.div>
    )
}

export default Peer