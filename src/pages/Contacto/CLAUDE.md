# Contacto page

The form submits directly client-side to [Web3Forms](https://web3forms.com) (`fetch('https://api.web3forms.com/submit', ...)`) — there is no backend/API route in this project handling it. Web3Forms emails the submission to whatever inbox is tied to the access key.

`VITE_WEB3FORMS_ACCESS_KEY` (in `.env`, see `.env.example`) is meant to be public/client-side, not a secret — that's how Web3Forms' model works (the key just routes to a fixed destination inbox, it doesn't grant write access to anything sensitive). Don't try to move it server-side or treat a leaked key as an incident.
