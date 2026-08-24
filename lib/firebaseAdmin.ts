import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// SERVER ONLY — DO NOT IMPORT THIS FILE IN CLIENT COMPONENTS

const projectId = "restorehealthservices-967ba";

const clientEmail =
  "firebase-adminsdk-fbsvc@restorehealthservices-967ba.iam.gserviceaccount.com";

const privateKey = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDEFZn0AWya9wWG\nugKxwbtbgufn7NnnmZX9SEMnplq5++ghNyL5XVKwr9XR4eAcEgrnh53s0h5uAfzF\n6H/NfQAluFeAB/pWp9SwiFGyxdFyBxGHN3wZlwKE//77xbZQ5xEdNIgmUbVHQKYe\nrkBzI2x67Ma1rhfBL+I6VaDzjZalZjQ5bJyiJIo4MHjCG8vMg9M028OVncOaH/FM\nzN1+1SdZwOCL5pj1VaiNlKoO1B+VBa8hgJSxJUgGfcKCEaQI3jJeA70eQkuD1lPq\nzeEVpiixkIksNej1Lo+mcCpPStfr4EYXuFfWD7x7Oas9+Rrt/RtoX+xlXwTMR8qy\nCDVoSNUbAgMBAAECggEAGJhvDbTKBywaBNq7MMnQsvtaFHTYplzU/Aa+6a/LrI2F\nAfmVCPtkPmZn5yIyhsLanE0eCZEXoQvdxYNS2Jcn2BNl4ljd1VXK73PB768xhOCP\nGctjZSBUgBNOTA1yP3akZmnq9AeGug/JZorL6cVVO5wMlshmEWTstw17mWE2trtB\ncoqEDjRjQIfRahntzmecPnHaHdNx78cruo0LAITferCCtm7qVP2VMyRTpmc9J8/8\nBd1rhGipuX/JlnHUv8xQRQaItJoz4HShwTn0sY1JMcJQ6jc+ECUvM4qQAkoPIcvR\ngBtnL7omWSgb/WVYUnJkIg8pxMj7oDv796TxK+QztQKBgQDmKtwi7YlN4qkKs9Ax\ncsgYDcp+0Pm+WX4ot1pHhfB0HNw3vrfPb0ey0Ax4UEfbQ2wm8lyv3+7uuDLaJx+z\nMnRA/Uih57l42tKLlie1Ouv5x3Mm+/pRppjceMTLOpgPNGVHVnCLivTywyZgXbZX\nNPb3OWqnkP1epoO51ScxofIzPQKBgQDaF3jV/KeFvM7i2uqdeEkv+pQfvDMLxQr+\n011EiO1rfExFTj7RIAmAMG2nDDv3Xbmc7d57lE8mJo4zufX3s0S9984gbM0558vM\nghAKNKJGPPt++lZVQk6nrhrfX5+Cgyn8h9u2NbsiTrl1thGptdtBvQhdMxdJFuhq\n3689lDBPNwKBgFwosyYlGEIgTHElmGoEPIwtEXR/tk/6Q2KIL9TNk37ag26qpayg\nMQQu+588/diUgXyCtIwTTPc2t93TpoS44gWXpPp27zOt4nnTsKiHJC9KJhho8ky5\nOSGmFZ4OIw6LezX6LWwiQnvlmbsiKr12TqCk08iubFT2tW22JFBiOLk9AoGAeVH/\nVUKUSlBK4mWXh/vG8tq5FaJS3yRAxpr70kk9kcJ2h0NMrHbe8iF+jiO/JA9OVt74\nGdTZ5sYh6uJy0tU101uLnfwIekLY2y4rEBJRhzMbUHqgFhOpv5uZtVLzX93pOGK3\nNXhUXnRetP2Qe9D/ZGVsxrPKK02EAxfl2yKZcScCgYEAh8lI0yRLNXyvqQGe3Tg+\naI8CEzp8x/B8S6gzEMIqw/fN89mee40QpdMNoFKRJBFG4IKebDkOu6Os2eeVp+3E\nnDBLPlFYAuY7UEE6OE/KKArnYEb63BE4eTeBfUE9+Xah9AaiUXKxKhE7chMGuoTt\nyXtgHpKC4d6P+L/Txq6pMsw=\n-----END PRIVATE KEY-----\n`;

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminDb, adminAuth };
