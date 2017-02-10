'use strict';
export default class GooglePlayGamesController extends HTMLElement {
   static get is() { return 'google-play-games-controller'; }
   // attributes to observe
 static get observedAttributes() { return []; }
   constructor() {
     super();
     this.root = this.attachShadow({mode: 'open'});
     this._handleClientLoad = this._handleClientLoad.bind(this);
     this.updateSigninStatus = this.updateSigninStatus.bind(this);
     this.initClient = this.initClient.bind(this);
     this._onGapiReady = this._onGapiReady.bind(this);
     // @template

   }
   connectedCallback() {
    //  this._importScript('https://apis.google.com/js/api.js');
     this._importScript('https://apis.google.com/js/client.js');
   }
   _importScript(src) {

     let script = document.createElement('script');
     script.setAttribute('defer', '');
     script.setAttribute('async', '');
     script.src = src;
     script.onload = this._handleClientLoad;
     script.onreadystatechange = this._onreadystatechange();
     document.head.appendChild(script);
   }
   _onreadystatechange() {
     if (this.readyState === 'complete') this.onload()
   }
   _handleClientLoad() {
      // Loads the client library and the auth2 library together for efficiency.
      // Loading the auth2 library is optional here since `gapi.client.init` function will load
      // it if not already loaded. Loading it upfront can save one network request.
      gapi.load('client:auth2', this.initClient);
    }

    initClient() {
      console.log('e');
      // Initialize the client with API key and People API, and initialize OAuth with an
      // OAuth 2.0 client ID and scopes (space delimited string) to request access.
      gapi.client.init({
          apiKey: firebase.apps[0].options.apiKey,
          clientId: '727370929717-6hgcj0bt3q52e5ssokfpqvlva4bnp0vi.apps.googleusercontent.com',
          scope: 'profile'
      }).then(this._onGapiReady);
    }

    _onGapiReady() {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }

    updateSigninStatus(isSignedIn) {
      // When signin status changes, this function is called.
      // If the signin status is changed to signedIn, we make an API call.
      if (isSignedIn) {
        this.makeApiCall();
      } else {
        PubSub.publish('google.play.games.user', null);
      }
    }

    handleSignInClick(event) {
      // Ideally the button should only show up after gapi.client.init finishes, so that this
      // handler won't be called before OAuth is initialized.
      gapi.auth2.getAuthInstance().signIn();
    }

    handleSignOutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
    }

    makeApiCall() {
      // Make an API call to the People API, and print the user's given name.
      gapi.client.people.people.get({
        resourceName: 'people/me'
      }).then(response => {
        PubSub.publish('google.play.games.user', response.result);
        console.log('Hello, ' + response.result.names[0].givenName);
      }, reason => {
        PubSub.publish('google.play.games.user', null);
        console.log('Error: ' + reason.result.error.message);
      });

      // gapi.client.load('games', 'v1', response => {
        var request = gapi.client.games.leaderboards.list(
          {maxResults: 5}
        );
        request.execute(function(response) {
          console.log(response);
          // Do something interesting with the response
        });
      // })
    }

    attributeChangedCallback(name, oldValue, newValue) {
     console.log(name, oldValue, newValue);
   }
}
 customElements.define(GooglePlayGamesController.is, GooglePlayGamesController);
