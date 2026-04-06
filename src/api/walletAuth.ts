import axios from "axios";

async function getAddress() {
    if (!window.ethereum) {
        alert("We Support Only MetaMask Wallet");
        return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
}

export async function register(): Promise<void> {
    const address = await getAddress();

    try {
        // 논스 값 받기
        const nonceRes = await axios.post("http://127.0.0.1:8081/api/auth/nonce", {
            address: address
        });

        let nonce = nonceRes.data.data.nonce;
        const message = "Welcome to Bridgenet !\n\nRegister With " + nonce;
        
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, address],
        });

        await axios.post("http://127.0.0.1:8081/api/auth/register", {
            username: address,
            address: address,
            signatureData: signature
        });
    } catch (err) {
        console.error("Wallet Auth Error", err);
        alert(err.response.data.message);
        throw err;
    }
}

export async function login() {
    const address = await getAddress();

    try {
        const nonceRes = await axios.post("http://127.0.0.1:8081/api/auth/nonce", {
            address: address
        });
    
        let nonce = nonceRes.data.data.nonce;
        const message = "Welcome to Bridgenet !\n\nLogin With " + nonce;
        
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, address],
        });
    
        const loginRes = await axios.post("http://127.0.0.1:8081/api/auth/login", {
            username: address,
            signatureData: signature
        }, {
            withCredentials: true
        });

        localStorage.setItem("accessToken", loginRes.data.data.accessToken);

    } catch (err) {
        console.error("Wallet Auth Error", err);
        alert(err.response.data.message);
        throw err;
    }
}