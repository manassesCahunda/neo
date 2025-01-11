import { GoogleGenerativeAI } from "@google/generative-ai";
import{ env } from "@neo/env";

export const googleAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY_AI);