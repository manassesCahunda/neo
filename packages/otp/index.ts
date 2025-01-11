import speakeasy from 'speakeasy';
import { app, getFirestore, setDoc, doc, getDoc, deleteDoc, Timestamp } from "@neo/firebase";
import { v4 as uuidv4 } from 'uuid'; 

const db = getFirestore(app);

interface GenerateOtpResult {
    otp: string;
    otpId: string;
}

const secret = "JBSWY3DPEHPK3PXP";

async function generateOtp(): Promise<GenerateOtpResult> {
    try {
        const otp = speakeasy.totp({
            secret: secret,
            encoding: 'base32',
            digits: 6,
            step: 180,
        });

        const otpId = uuidv4();

        const otpData = {
            otp: otp,
            secret: secret,
            status: "valid",
            createdAt: Timestamp.now(),
            expiresAt: Timestamp.fromDate(new Date(Date.now() + 15 * 60 * 1000)),
        };


        await setDoc(doc(db, "otpcode", otpId), otpData);

        console.log("OTP gerado e armazenado no Firestore:", otp);
        
        return { otp, otpId }; 

    } catch (error) {
        console.error("Erro ao gerar e armazenar OTP:", error);
        throw error; 
    }
}

async function validateOtp(otpId: string, otp: string): Promise<boolean> {
    try {
        const otpDocRef = doc(db, "otpcode", otpId);
        const otpDocSnap = await getDoc(otpDocRef);

        if (!otpDocSnap.exists()) {
            console.log("Código OTP não encontrado.");
            return false;
        }

        const otpData = otpDocSnap.data();
        const now = Timestamp.now();

      
        if (otpData.expiresAt.toMillis() < now.toMillis()) {
            console.log("OTP expirado.");
            await deleteDoc(otpDocRef);
            return false;
        }

        if (otpData.status === "used") {
            console.log("OTP já foi usado.");
            return false;
        }

        if (otpData.otp !== otp) {
            console.log("OTP inválido.");
            return false;
        }

 
        console.log("OTP válido.");
        await setDoc(otpDocRef, { status: "used" }, { merge: true });
        return true;

    } catch (error) {
        console.error("Erro ao validar OTP:", error);
        return false;
    }
}

export { generateOtp, validateOtp };
