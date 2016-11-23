// Modules
const React = require('react');
const ReactDOM = require('react-dom');

// Checking for outdated browsers
(function() {
    const isIE = /MSIE (\d+)\./.test(navigator.userAgent);
    if (isIE) {
        const version = +isIE[1];
        if (version < 10) {
            alert('Unfortunately your browser, Internet Explorer ' + version + ', is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
        }
    }

    if (/Android 2\.3/.test(navigator.userAgent)) {
        alert('Unfortunately your browser, Android 2.3, is not supported.\nPlease visit the site with a modern browser like Firefox or Chrome.\nThanks!');
    }
})();

// Config
const config = {};
config.campaign = 'no-corporate-insiders';
config.link = 'https://nocorporateinsiders.com/';
config.prettyCampaignName = 'No Corporate Insiders';

// URLs
const urls = {};
urls.facebook = 'https://www.facebook.com/sharer.php?u=';
urls.feedback = 'https://dp-feedback-tool.herokuapp.com/api/v1/feedback?';
urls.twitter = 'https://twitter.com/intent/tweet?text=';

// State
const state = {};
state.isMobile = /mobile/i.test(navigator.userAgent);
state.isIE = /trident/i.test(navigator.userAgent);
state.query = getQueryVariables();

// Setup shortcuts for AJAX.
const ajax = {
    get: function(url, callback) {
        callback = callback || function() {};

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && callback) {
                callback(xhr.response);
            }
        };
        xhr.open('get', url, true);
        xhr.send();
    },

    post: function(url, formData, callback) {
        callback = callback || function() {};

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && callback) {
                callback(xhr.response);
            }
        };
        xhr.open('post', url, true);
        xhr.send(formData);
    },
};

const events = {
    list: {},
    on: function(event, callback) {
        if (!this.list[event]) {
            this.list[event] = [];
        }

        this.list[event].push(callback);
    },
    trigger: function(event, data) {
        if (!this.list[event]) {
            return;
        }

        for (let i = 0; i < this.list[event].length; i++) {
            this.list[event][i](data);
        }
    },
};

function getQueryVariables() {
    const variables = {};

    const queryString = location.search.substr(1);
    const pairs = queryString.split('&');

    for (let i = 0; i < pairs.length; i++) {
        const keyValue = pairs[i].split('=');
        variables[keyValue[0]] = keyValue[1];
    }

    return variables;
}

function getSource() {
    const source = state.query.source || 'website';
    return source.toLowerCase();
}

function findPos(obj) {
    let curTop = 0;
    if (obj.offsetParent) {
        do {
            curTop += obj.offsetTop;
        } while (obj = obj.offsetParent);

        return [curTop];
    }
}

function k() {}

const Header = React.createClass({
    render: function() {
        return (
            <header>
                <div className="title">
                    TELL HILLARY: DON'T APPOINT CORPORATE INSIDERS TO YOUR ADMINISTRATION
                </div>

                <div className="paragraph">
                    Hillary Clinton's team is <strong>already deciding</strong> who's likely to get key positions in her administration &mdash; like Chief of Staff, head of the Treasury Department, and more.
                    <div className="spacer" />

                    Too frequently, Wall Street executives and other corporate insiders get appointed to these positions &mdash; and then use the government to do the bidding of their friends and former employers.
                    <div className="spacer" />

                    This is how banks get bailed out and avoid strong penalties for bad behavior. It's why we have to fight tooth-and-nail to maintain an open Internet. It's why corporations are allowed to hide their political spending.
                    <div className="spacer" />

                    <strong>Getting the right people into the administration from the get-go is critical. You can use our call tool to tell the key people on Clinton's transition team to make sure that happens &mdash; making a few calls now will help us change the way the government runs for years to come.</strong>
                </div>
            </header>
        );
    },
});

const PhoneForm = React.createClass({
    render: function() {
        return (
            <div>
                <div className="phone-form">
                    <form onSubmit={ this.onSubmit }>
                        <input placeholder="Your Phone Number" id="field-phone" ref="field-phone" className="phone" name="phone" autoComplete="on" pattern="[\d\(\)\-\+ ]*" autoFocus />
                        <button>
                            CLICK HERE TO CALL CLINTON'S TRANSITION TEAM
                            <img src="images/phone.svg" />
                        </button>
                    </form>

                    <div className="privacy">
                        This tool uses <a href="https://www.twilio.com/legal/privacy" target="_blank">Twilio</a>’s APIs.
                        <br />
                        If you prefer not to use our call tool, <a href="#opt-out" onClick={ this.onClickOptOut }>click here</a>.
                    </div>
                </div>
            
                <div
                    className="paragraph"
                    style={{
                        maxWidth: '860px',
                    }}
                >
                    Please enter your number above and we will give you a script and connect you to key members of Clinton's transition team so you can tell them to make sure the administration doesn't hire corporate insiders.
                </div>
            </div>
        );
    },

    onSubmit: function(e) {
        e.preventDefault();

        const phoneField = this.refs['field-phone'];
        const number = phoneField.value.replace(/[^\d]/g, '');

        if (number.length !== 10) {
            phoneField.focus();
            return alert('Please enter your 10 digit phone number.');
        }

        const request = new XMLHttpRequest();
        const url = `https://dp-call-congress.herokuapp.com/create?campaignId=${config.campaign}&userPhone=${number}&source_id=${getSource()}`;
        request.open('GET', url, true);
        request.send();

        this.props.changeForm('script');
    },

    onClickOptOut: function(e) {
        e.preventDefault();

        this.props.changeForm('opt-out');
    },
});

const OptOutForm = React.createClass({
    numbers: {
        // 'The Office of the Treasury Secretary': '202-622-1100',
        // 'The Office of the White House Chief of Staff': '202-456-3737',
        // 'SEC Chair Mary Jo White': '202-551-2100',
        // 'SEC Commissioner Luis Aguilar': '202-551-2500',
        // 'SEC Commissioner Daniel Gallagher': '202-551-2600',
        // 'SEC Commissioner Kara Stein': '202-551-2800',
        // 'SEC Commissioner Michael Piwowar': '202-551-2700',
        // 'The Office of the SEC General Counsel': '202-551-5100',
        // 'The Domestic Policy Council': '202-456-5594',
        // 'The Office of Public Engagement': '202-456-1097',
        // 'The Office of the Press Secretary': '202-456-3282',
        // 'The White House General Counsel': '202-456-2632',
        // 'The Office of Management and Budget': '202-395-4840',
        // 'White House Operations': '202-456-2500',
        // 'The Domestic Policy Council': '202-456-6515',
        // 'The Office of Administration': '202-456-2861',
        // 'The Council of Economic Advisers': '202-395-5084',
        'Hillary Clinton\'s Campaign': '646-854-1432',
    },

    renderNumbers: function() {
        const numbers = [];

        for (let name in this.numbers) {
            let number = this.numbers[name];

            numbers.push(
                <div className="number">
                    <div className="name">
                        { name }
                    </div>

                    <div className="phone">
                        <a href={ 'tel:' + number }>{ number }</a>
                    </div>
                </div>
            );
        }

        return numbers;
    },

    render: function() {
        return (
            <div className="opt-out-form">
                <div className="script">
                    Tell them: <span className="suggestion">“I am calling because I want you to know how important it is that the people Hillary Clinton appoints to her administration care about the public interest &mdash; and are not just more Wall Street executives and other corporate insiders.”</span>
                </div>

                <div className="numbers">
                    { this.renderNumbers() }
                </div>
            </div>
        );
    },
});

const PhoneScript = React.createClass({
    onClickSendFeedback: function(e) {
        e.preventDefault();

        const data = {
            campaign: config.campaign,
            subject: 'Feedback from ' + (config.prettyCampaignName || config.campaign),
            text: '',
        };
        
        const fields = [
            document.querySelector('#who'),
            document.querySelector('#how'),
        ];

        fields.forEach(field => {
            data.text += `${field.name}:\n${field.value}\n\n`;
        });

        let url = urls.feedback;

        for (let key in data) {
            url += key;
            url += '=';
            url += encodeURIComponent(data[key]);
            url += '&';
        }

        ajax.get(url);

        this.setState({
            sent: true,
        });
    },

    getInitialState: function() {
        return {
            sent: false,
        };
    },

    render: function() {
        return (
            <div className="phone-script">
                <h2>Awesome. Making a few calls now will help us change the way the government runs for years to come.</h2>

                We are going to connect you to people have have power over who Clinton will appoint to her administration. Some of them might be surprised to hear from you: They're not all used to getting calls from the public &mdash; even as they are making decisions RIGHT NOW that will affect the lives of millions of people.
                <div className="spacer" />

                Please be polite and say:
                <div className="spacer" />

                <div className="suggestion">
                    “I am calling because I want you to know how important it is that the people Hillary Clinton appoints to her administration care about the public interest &mdash; and are not just more Wall Street executives and other corporate insiders.”
                </div>
                <div className="spacer" />

                If you reach an answering machine, please leave a message. After each call is over, please hit the * key, and we will connect you to somebody else.

                <div className="calling-wrapper">
                    <h3>After your call(s), use the form to let us know how it went!</h3>
                    <form action="#" method="get" className={this.state.sent ? 'sent' : false}>
                        <div className="wrapper">
                            <h4>Who did you speak with?</h4>
                            <input required="required" type="text" name="Who did you speak with?" id="who" />
                            <h4>How did it go?</h4>
                            <input required="required" type="text" name="How did it go?" id="how" />
                            <br />
                            <div id="thanks">Thank you!</div>
                            <button onClick={this.onClickSendFeedback} type="submit" name="submit">Send Feedback</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    },
});

const Thanks = React.createClass({
    render: function() {
        return (
            <div className="thanks">
                Thanks for making your voice heard!

                <div className="social">
                    <div className="facebook">
                    </div>

                    <div className="twitter">
                    </div>

                    <div className="email">
                    </div>
                </div>
            </div>
        );
    },
});

const Form = React.createClass({
    render: function() {
        let form;
        switch (this.state.form) {
            case 'phone':
            form = <PhoneForm changeForm={ this.changeForm } />;
            break;

            case 'script':
            form = <PhoneScript />;
            break;

            case 'thanks':
            form = <Thanks />;
            break;

            case 'opt-out':
            form = <OptOutForm />;
            break;
        }

        return (
            <div className="form">
                { form }
            </div>
        );
    },

    getInitialState: function () {
        let form = 'phone';

        if (state.query.call_tool) {
            form = 'phone';
        }

        if (state.query.debugState) {
            form = state.query.debugState;
        }

        return {
            form: form,
        };
    },

    changeForm: function(form) {
        this.setState({
            form: form,
        });

        const pos = findPos(this);
        scrollTo(0, pos - 16);
    },
});

const Organizations = React.createClass({
    render: function() {
        const organizations = [];
        for (let name in this.organizations) {
            organizations.push(
                <a
                    href={ this.organizations[name] }
                    target="_blank"
                    key={name}
                >
                    { name }
                </a>
            );
        }

        return (
            <div className="organizations">
                { organizations }
            </div>
        );
    },

    organizations: {
        'Demand Progress': 'https://demandprogress.org/',
        'Democracy For America': 'http://democracyforamerica.com/',
        'National People\'s Action': 'http://npa-us.org/',
        'Other 98': 'http://other98.com/',
        'RootsAction': 'http://www.rootsaction.org/',
        'Rootstrikers': 'http://www.rootstrikers.org/',
    },
});

const Contact = React.createClass({
    render: function() {
        return (
            <div className="contact">
                For press inquiries, please contact us at:
                <br />
                <a href="mailto:press@rootstrikers.org">press@rootstrikers.org</a>
            </div>
        );
    },
});

const CreativeCommons = React.createClass({
    render: function() {
        return (
            <div className="creative-commons">
                Social media photo via <a href="https://www.flickr.com/photos/132084522@N05/17086570218/in/photolist-s2T93f-aCsYXi-oPq1C2-aCtoP8-aCtq3g-aCtqM8-aCw4ZE-aCw5Ay-aCw5iu-aCtqjT-9xMgR-2ixJCg-4Hgjqa-iBNpq-5AJv1X-bxnPa3-4hMTnc-5ppxQp-5ppzf2-5ptSUW-7Msw4U-E5Z87-7onZXi-wsAoC-7881oQ-6yR8Ad-MKW8o-9McFm3-9McFaC-4hRZqU-5tw48Y-5tJZ6J-5tECet-7LmT9N-tV1WT-d5LKYs-eCnroP-rdRMnA-aCtqBx-aCvB1G-aCvAFq-aCsUAr-aCvBTd-aCsTw8-aCvAqd-aCvztu-aCvCBL-aCsV14-aCvEhU-aCvEMh" target="_blank">Sam Valadi</a> under a <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank">CC BY 2.0</a> license.
            </div>
        );
    },
});

const Social = React.createClass({
    render: function() {
        return (
            <div className="social">
                <h2>Share this page!</h2>
                <div className="copy">
                    After making a call, share this page with your friends. The more people that speak out, the better our chance of getting a tough ‘cop on the beat’ on Wall Street.
                </div>
                <div className="buttons">
                    <a onClick={this.onClickFacebook} target="_blank" href="#Share on Facebook" className="facebook">Facebook</a>
                    <a onClick={this.onClickTwitter} target="_blank" href="#Share on Twitter" className="twitter">Twitter</a>
                </div>
            </div>
        );
    },

    onClickTwitter: function(e) {
        e.preventDefault();

        let shareText = document.querySelector('[name="twitter:description"]').content;

        const source = getSource();

        if (source) {
            shareText += '/?source=' + source;
        }

        const url = urls.twitter +
                  encodeURIComponent(shareText) +
                  '&ref=demandprogress';

        window.open(url);
    },

    onClickFacebook: function(e) {
        e.preventDefault();

        let url = urls.facebook + encodeURIComponent(config.link);

        const source = getSource();

        if (source) {
            url += '%3Fsource%3D' + source;
        }

        window.open(url);
    },
});

const CallPages = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
                <Header />

                <Form />

                <Contact />
            </div>
        );
    },

    imagesToPreload: [
        'images/phone.svg',
    ],

    componentDidMount: function() {
        for (let i = 0; i < this.imagesToPreload.length; i++) {
            const image = new Image();
            image.src = this.imagesToPreload[i];
        }
    },
});

ReactDOM.render(
    <CallPages />,
    document.querySelector('#app')
);

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-74199344-7', 'auto');
ga('send', 'pageview');
