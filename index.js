const Alexa = require('ask-sdk-core');
const AWS = require("aws-sdk");
const iotdata = new AWS.IotData({ endpoint: "a2uuhh18q27pfh-ats.iot.us-east-1.amazonaws.com"}); //process.env.IOT_ENDPOINT });
const lambda = new AWS.Lambda();





const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hola. Bienvenido a Brazo Escritor, ¿qué desea hacer?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



const WriteIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WriteIntent';
    },
    async handle(handlerInput) {
        var word=handlerInput.requestEnvelope.request.intent.slots.letra.value;
        word=word.toUpperCase();       
        await Escribirfuncion(word[0]);
        const speakOutput = ('Escribiendo '+word);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
        
    }
};
 function Escribirfuncion (word, Topic) {
    var payloadObj= word;
    payloadObj= payloadObj.replace(/^"(.+(?="$))"$/, '$1');
    return new Promise((resolve, reject) => {
      let params = {
        topic: "$aws/things/arm/shadow/update/delta",//process.env.IOT_TOPIC_PUB,
        payload: payloadObj,
        qos: 1,
      };
      iotdata.publish(params, function (err, data) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(params);
        }
      });
    });
}

const MoveBrazoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MoveBrazoIntent';
    },
    async handle(handlerInput) {
        const word=handlerInput.requestEnvelope.request.intent.slots.numero.value;
        const speakOutput = ('Moviendo a '+ word + " grados" );
        const Topic="$aws/things/arm/shadow/get";
        await Moverfuncion(word, Topic);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};
const MoveCodoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MoveCodoIntent';
    },
    async handle(handlerInput) {
        const word=handlerInput.requestEnvelope.request.intent.slots.number.value;
        const speakOutput = ('Moviendo a '+ word + " grados" );
        const Topic= "$aws/things/arm/shadow/update";
        await Moverfuncion(word, Topic);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const MoveMunecaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MoveMunecaIntent';
    },
    async handle(handlerInput) {
        const word=handlerInput.requestEnvelope.request.intent.slots.numero.value;
        const speakOutput = ('Moviendo a '+ word + " grados" );
        const Topic= "$aws/things/arm/shadow/name/arm_shadow/get";
        await Moverfuncion(word, Topic);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};


const OpenHandIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OpenHandIntent';
    },
    async handle(handlerInput) {
        const word=handlerInput.requestEnvelope.request.intent.slots.numero.value;
        const speakOutput =  ('Moviendo a '+ word + " grados" );
        const Topic="$aws/things/arm/shadow/update/documents";
        await Moverfuncion(word, Topic);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const TrayectoriasIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TrayectoriasIntent';
    },
    async handle(handlerInput) {
        const word=handlerInput.requestEnvelope.request.intent.slots.movimientos.value;
        const speakOutput =  (word + " en progreso" );
        const Topic="$aws/things/arm/shadow/name/arm_shadow/update";
        await Moverfuncion(word, Topic);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};

function Moverfuncion (word, Topic) {
    var payloadObj= word;
    payloadObj= payloadObj.replace(/^"(.+(?="$))"$/, '$1');
    return new Promise((resolve, reject) => {
      let params = {
        topic: Topic,//process.env.IOT_TOPIC_PUB,
        payload: payloadObj,
        qos: 1,
      };
      iotdata.publish(params, function (err, data) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(params);
        }
      });
    });
}


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Puedo decirle al brazo que escriba letras, intenta decir Escribe A';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Gracias por usar Brazo escritor. Hasta Luego';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Lo siento, aún no puedo hacerlo. Intente de nuevo';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `Has abierto ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Lo siento, hay un error. Inténtelo de nuevo';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        WriteIntentHandler,
        MoveBrazoIntentHandler,
        TrayectoriasIntentHandler,
        MoveCodoIntentHandler,
        MoveMunecaIntentHandler,
        OpenHandIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
