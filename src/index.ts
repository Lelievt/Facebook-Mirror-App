const elios_sdk = require('elios-sdk');
const sdk = new elios_sdk.default();

var Facebook = require('fb')

var credentials = require('./../resources/credentials.json')

var cheerio = require('cheerio'),
    html = require('./index.html')

const $ = cheerio.load(html);

export default class FacebookApp {
    name: string = 'FacebookApp';
    installId: string = '';

    requireVersion: string = '0.0.1';
    showOnStart: boolean = true;

    widget: any;
    token: any;
    client: any;


    constructor() {
        console.log('Construtor');
    }

    init() {
        console.log('MODULE DEV LOADED ' + this.name);
    }

    showPosts(posts: Array<any>) {
        console.log(posts[0]);
        for(let i = 0; i < posts.length; i++) {
            let elem = $('<li' + ((i == 0) ? ' class="firstPost"' : '>') + '</li>');

            let header = $('<div class=header></div>');
            $(header).append('<p class="user_name">' + posts[i].name + '</p>');

            $(elem).append(header);
            $(elem).append('<div><p class="tweet_content">' + posts[i].message + '</p></div>');


            $('#facebook').append(elem);
        }
        this.widget.html($('#facebook-container').html());
    }

    getUserNewsFeed() {
      this.client.api('/me/feed', {fields: ['from', 'message']}, (response: any) => {
        if (response && !response.error) {
          this.showPosts(response)
        } else {
          console.log(response)
        }
      });
    }

    start() {
        console.log('MODULE STARTED ' + this.name);
        this.widget = sdk.createWidget({
            id: this.installId
        });
        this.widget.html($('#facebook-container').html());

        this.client = new Facebook()
        this.client.setAccessToken(credentials.facebook.accessToken)
        this.getUserNewsFeed();
    }

    stop() {
        console.log('MODULE STOPED ' + this.name);
    }
}

const facebook = new FacebookApp();

facebook.start();
