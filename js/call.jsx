// Config
const config = {};
config.akPage = 'block-trumps-cabinet-www';
config.callCampaign = 'block-trumps-cabinet';
config.link = 'https://BlockTrumpsCabinet.com/';
config.prettyCampaignName = 'Block Trump\'s Cabinet';


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

// URLs
const urls = {};
urls.actionkit = 'https://act.demandprogress.org/act/';
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

function sendFormToActionKit(fields) {
    // iFrame
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('name', 'actionkit-iframe');
    document.body.appendChild(iframe);

    // Form
    const form = document.createElement('form');
    form.style.display = 'none';
    form.setAttribute('action', urls.actionkit);
    form.setAttribute('method', 'post');
    form.setAttribute('target', 'actionkit-iframe');

    Object.keys(fields).forEach(function(key) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
    });

    form.submit();
}

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

const Header = () => (
    <header>
        <div className="title">
            <span>Tell the Senate:</span>
            <br/>
            Block Trump’s Cabinet of Hate and Wall Street Greed
        </div>
    </header>
);

const EmailForm = React.createClass({
    render: function() {
        return (
            <div className="email-form">
                <div className="petition" id="petition">
                    <h3>Petition to members of the U.S. Senate:</h3>

                    Donald Trump’s first appointments to cabinet-level roles in his administration are horrifying. Trump’s nominees and rumored picks have promoted white nationalism, attacked climate science and used their power as Wall Street insiders and corporate lobbyists to fleece working families.
                    <div className="spacer" />

                    As representatives of all Americans, you must stand up against hatred and greed. Fight to block and resist every Trump nominee who embraces racism, xenophobia, misogyny, homophobia, climate denial, and Wall Street greed.

                    <form onSubmit={ this.onSubmit } ref="form">
                        <input className="name" name="name" placeholder="Your name" autoFocus="autoFocus" />
                        <input className="email" name="email" placeholder="Email" type="email" />
                        <input className="zip" name="zip" placeholder="Zip code" type="tel" />
                        <button>
                            Sign the Petition
                        </button>
                    </form>

                    <div className="disclaimer">
                        We do not share your email address without your permission.
                        One or more partner groups
                        may send you updates on this and other important campaigns by email. If at any time you would like to unsubscribe from any of these email lists, you may do so.
                    </div>
                </div>

                <BodyCopy />

            </div>
        );
    },

    onSubmit: function(e) {
        e.preventDefault();

        const form = this.refs.form;

        const name = form.querySelector('[name="name"]');
        if (!name.value.trim()) {
            name.focus();
            alert('Please enter your name.');
            return;
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const email = form.querySelector('[name="email"]');
        if (!email.value.trim()) {
            email.focus();
            alert('Please enter your email.');
            return;
        } else if (!emailRegex.test(email.value.trim())) {
            email.focus();
            alert('Please enter a valid email.');
            return;
        }

        const zip = form.querySelector('[name="zip"]');
        if (!zip.value.trim()) {
            zip.focus();
            alert('Please enter your zip.');
            return;
        }

        try {
            sessionStorage.zip = zip.value.trim();
        } catch (err) {
            // Oh well
        }

        const fields = {
            'action_user_agent': navigator.userAgent,
            'country': 'United States',
            'email': email.value.trim(),
            'form_name': 'act-petition',
            'js': 1,
            'name': name.value.trim(),
            'opt_in': 1,
            'page': config.akPage,
            'source': getSource(),
            'want_progress': 1,
            'zip': zip.value.trim(),
        };

        sendFormToActionKit(fields);

        this.props.changeForm('phone');
    },
});

const PhoneForm = React.createClass({
    render: function() {
        return (
            <div className="phone-form-wrapper">
                <h2>Thanks for signing. <br/> Now, could you make a call?</h2>
                <div className="paragraph">
                    It’s the single most effective thing you can do.
                </div>

                <div className="phone-form">
                    <form onSubmit={ this.onSubmit }>
                        <input placeholder="Your Phone Number" id="field-phone" ref="field-phone" className="phone" name="phone" autoComplete="on" pattern="[\d\(\)\-\+ ]*" autoFocus />
                        <button>
                            CALL THE SENATE
                            <img src="images/phone.svg" />
                        </button>
                    </form>

                    <div className="privacy">
                        This tool uses <a href="https://www.twilio.com/legal/privacy" target="_blank">Twilio</a>’s APIs.
                        <br />
                        <div className="hide-temporarily">
                        If you prefer not to use our call tool, <a href="#opt-out" onClick={ this.onClickOptOut }>click here</a>.
                        </div>
                    </div>
                </div>

                <div className="paragraph">
                    Just enter your number and click “call”
                    <br/>
                    <br/>
                    We’ll connect you with your senators and key party leaders, and give you a script of what you can say.
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
        let url = `https://dp-call-congress.herokuapp.com/create?db=cwd&campaignId=${config.callCampaign}&userPhone=${number}&source_id=${getSource()}`;

        try {
            if ('zip' in sessionStorage) {
                url += `&zipcode=${sessionStorage.zip}`;
            }
        } catch (err) {
            // Oh well
        }

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
                    Tell them: <span className="suggestion">“I am calling because I want you to know how important it is that the people Donald Trump appoints to his administration care about the public interest &mdash; and are not just more Wall Street executives and other corporate insiders.”</span>
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
            callCampaign: config.callCampaign,
            subject: 'Feedback from ' + (config.prettyCampaignName || config.callCampaign),
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
                <em>We’re calling you now. <br /> After the conversation, you can <strong>press *</strong> and we’ll connect you to the next office.</em>
                <div className="spacer" />

                <em>Here’s what you can say:</em>
                <div className="spacer" />

                <div className="suggestion">
                    “With his cabinet nominations, Donald Trump is breaking his promises to be a president for all Americans and to make the economy work for ordinary people, not just wealthy elites.
                    <div className="spacer" />
                    Please fight to block and resist every Trump nominee who embraces hatred and Wall Street greed.
                    <div className="spacer" />
                    In particular, please vote AGAINST enemy of civil rights <strong>Jeff Sessions</strong> for Attorney General, foreclosure king <strong>Steve Mnuchin</strong> (mi-NOO-chin) for Treasury Secretary, and Wall Street billionaire <strong>Wilbur Ross</strong> for Commerce Secretary. Thank you."
                </div>
                <div className="spacer" />

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
            </div>
        );
    },
});

const Form = React.createClass({
    render: function() {
        let form;
        switch (this.state.form) {
            case 'email':
            form = <EmailForm changeForm={ this.changeForm } />;
            break;

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
        let form = 'email';

        if (state.query.call_tool) {
            form = 'phone';
        }

        if (getSource() === 'mpower') {
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

const Organizations = () => (
    <div className="organizations">
        <div className="clamp">
            <h4>Site created by</h4>
            <div className="larger">
                <a title="Demand Progress" href="https://demandprogress.org" target="_blank"><img src="images/logos/demandprogress-logo-new-stacked.png" /></a>
            </div>

            <h4>In partnership with</h4>
            <div className="smaller">
                <a title="American Family Voices" href="http://www.americanfamilyvoices.org" target="_blank"><img src="images/logos/afv.jpg" /></a>
                <a title="Catholics in Alliance" href="http://www.catholicsinalliance.org/" target="_blank"><img src="images/logos/CatholicsInAlliance.jpg" /></a>
                <a title="Courage Campaign" href="https://couragecampaign.org/" target="_blank"><img src="images/logos/Courage-Logo-Color-High-Rez.jpg" /></a>
                <a title="CPD Action" href="https://cpdaction.org/" target="_blank"><img src="images/logos/cpd-action-logo.png" /></a>
                <a title="Daily Kos" href="http://www.dailykos.com/" target="_blank"><img src="images/logos/dk_logo_400dpi_1024.jpg" /></a>
                <a title="Rootstrikers" href="http://www.rootstrikers.org/#!/" target="_blank"><img src="images/logos/logo-rootstrikers-blacktext_900px.png" /></a>
                <a title="Democracy for America" href="https://www.democracyforamerica.com/" target="_blank"><img src="images/logos/DFA_logo_bottom_200.png" /></a>
                <a title="Friends of the Earth" href="http://www.foe.org/" target="_blank"><img src="images/logos/FOE_logo_color.jpg" /></a>
                <a title="HedgeClippers" href="http://hedgeclippers.org/" target="_blank"><img src="images/logos/HedgeClippers.jpg" /></a>
                <a title="League of Conservation Votes" href="http://www.lcv.org/" target="_blank"><img src="images/logos/lcv_horizontal_url_large.jpg" /></a>
                <a title="NY Communities for Change" href="http://nycommunities.org/" target="_blank"><img src="images/logos/ny-communities-for-change.png" /></a>
                <a title="People for the American Way" href="http://www.pfaw.org/" target="_blank"><img src="images/logos/pfaw-logo.jpg" /></a>
                <a title="Presente Action" href="http://www.presente.org/" target="_blank"><img src="images/logos/PresenteActionLogo.jpeg" /></a>
                <a title="Public Citizen" href="http://www.citizen.org/Page.aspx?pid=183" target="_blank"><img src="images/logos/publiccitizen.jpg" /></a>
                <a title="RootsAction" href="http://rootsaction.org/" target="_blank"><img src="images/logos/RootsAction_transparent300.png" /></a>
                <a title="SumOfUs" href="https://www.sumofus.org/" target="_blank"><img src="images/logos/SumOfUs_horiz-logo-color.jpg" /></a>
                <a title="The Nation" href="https://www.thenation.com/" target="_blank"><img src="images/logos/THENATION_150_LOGO_RegularTAGLINE-Pantone.jpg" /></a>
                <a title="Working Families Party" href="http://workingfamilies.org/" target="_blank"><img src="images/logos/wfp.jpg" /></a>
            </div>
        </div>
    </div>
);


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
                Trump photo (edited) via <a href="https://commons.wikimedia.org/wiki/File%3ADonald_Trump_(16493063167).jpg" target="_blank">Michael Vadon</a> under a <a href="http://creativecommons.org/licenses/by-sa/2.0" target="_blank">CC BY-SA 2.0</a> license.
                <br />
                Sessions photo (cropped) via <a href="https://commons.wikimedia.org/wiki/File%3AJeff_Sessions_by_Gage_Skidmore.jpg" target="_blank">Gage Skidmore</a> under a <a href="http://creativecommons.org/licenses/by-sa/3.0" target="_blank">CC BY-SA 3.0</a> license.
                <br />
                Ross photo (edited) via Cyprus Business Press under a <a href="https://creativecommons.org/licenses/by-nc-nd/3.0/" target="_blank">CC BY-NC-ND 3.0</a> license.
            </div>
        );
    },
});

const Social = React.createClass({
    render: function() {
        return (
            <div className="midnight-share-train">
                <div className="share">
                    <a onClick={this.onClickTwitter} target="_blank" href="#Share on Twitter" className="twitter">Tweet</a>
                    <a onClick={this.onClickFacebook} target="_blank" href="#Share on Facebook" className="facebook">Share</a>
                    <a target="_blank" href="#Share via Email" className="email">Email</a>
                </div>
            </div>
        );
    },

    onClickTwitter: function(e) {
        e.preventDefault();

        let shareText = document.querySelector('[name="twitter:description"]').content;

        // const source = getSource();
        //
        // if (source) {
        //     shareText += '/?source=' + source;
        // }

        const url = urls.twitter +
                  encodeURIComponent(shareText) +
                  '&ref=demandprogress';

        window.open(url);
    },

    onClickFacebook: function(e) {
        e.preventDefault();

        let url = urls.facebook + encodeURIComponent(config.link + '/?source=fb-share');

        // const source = getSource();
        //
        // if (source) {
        //     url += '%3Fsource%3D' + source;
        // }

        window.open(url);
    },
});

const BodyCopy = () => (
    <div className="paragraph">
        <hr />
        Trump rose to power with a divisive campaign that showed he was willing to embrace every fringe ideology from xenophobia to sexism to flat-out racism in order to gain power.

        <h3>Trump’s Broken Promises:</h3>
        Despite his campaign, Trump promised in election night to be “a president for all Americans.” But the parade of horribles that Trump has nominated to his administration show he is welcoming hate right into the White House.
        <div className="spacer" />
        And his pledge to “drain the swamp” and make Washington work for ordinary Americans instead of powerful elites? Forget about it. Trump’s cabinet is so pro-corporate it’s called “an investment banker’s dream.”
        <div className="spacer" />

        <h3>Who the Trump Cabinet Really Works For:</h3>
        Wall Street bankers and Trump’s corporate cronies are cheering the Trump agenda. It’s a corporate wish list that would eliminate protections for working people and our environment, and eviscerate strong rules reining in Wall Street.
        <div className="spacer" />
        The Trump administration is shaping up to benefit Donald Trump and his family’s business empire in a big way, with massive conflicts of interest posed by Trump’s continued stake in the Trump Organization.
        <div className="spacer" />

        <h3>The Senate Must Block and Resist Trump's Cabinet</h3>
        The U.S. Senate has confirmation power over most of Trump's cabinet. Senators must use this power to block and resist Trump’s cabinet of hate and greed. Consider who we’re talking about:
        <div className="spacer" />

        <div className="profiles">
            <div className="profile">
                <img src="images/profiles/Jeff_Sessions.jpg" alt="Jeff Sessions photo" />
                <strong>Enemy of civil rights and women's rights Jeff Sessions (Attorney General)</strong> &mdash; The same Jeff Sessions who was deemed too racist to confirm to a federal judgeship by a Republican Judiciary Committee in 1986 would be in charge of the Department of Justice. If confirmed, he would be responsible for enforcing the country’s civil rights laws, despite a history of calling a black subordinate "boy," "joking" about supporting the Ku Klux Klan, <a href="http://www.cnn.com/2016/11/17/politics/jeff-sessions-racism-allegations/index.html" target="_blank">and calling the ACLU and NAACP "un-American."</a> His anti-woman record speaks for itself: He said <a href="http://www.weeklystandard.com/jeff-sessions-behavior-described-by-trump-in-grab-them-by-the-p-y-tape-isnt-sexual-assault/article/2004799?custom_click=rss" target="_blank"> "I don't characterize" grabbing women by the genitals "as sexual assault,"</a> voted <a href="https://www.govtrack.us/congress/votes/113-2013/s19" target="_blank">against reauthorizing the Violence Against Women Act</a> and <a href="http://www.senate.gov/legislative/LIS/roll_call_lists/roll_call_vote_cfm.cfm?congress=113&session=2&vote=00059" target="_blank">against bipartisan legislation to curb sexual assault</a> in the military <a href="http://www.senate.gov/legislative/LIS/roll_call_lists/roll_call_vote_cfm.cfm?congress=114&session=1&vote=00211">&ndash; twice.</a>
            </div>
            <div className="spacer clear" />

            <div className="profile">
                <img src="images/profiles/Mnuchin.jpg" alt="Steve Mnuchin photo" />
                <strong>Foreclosure king Steve Mnuchin (Treasury Secretary)</strong> &mdash; Steve Mnuchin is an ultra-wealthy former Goldman Sachs executive who got rich at the expense of working Americans. He ran a bank called a "foreclosure machine" that kicked people out of their houses, <a href="http://prospect.org/article/steve-mnuchin-evictor-forecloser-and-our-new-treasury-secretary" target="_blank">using techniques so coldblooded</a> a federal judge called them “harsh, repugnant, shocking and repulsive,” <a href="http://www.bloomberg.com/politics/articles/2016-11-22/trump-treasury-contender-mnuchin-found-profits-in-mortgage-mess" target="_blank">foreclosing on more than 36,000 homes.</a> He and his family pocketed $3.2 million in <a href="http://www.bloomberg.com/politics/articles/2016-05-06/trump-s-new-finance-chairman-was-sued-over-madoff-fraud-profit" target="_blank">fake profits from notorious Ponzi scheme fraudster Bernie Madoff.</a> Mnuchin will run the Treasury Department to benefit Wall Street, saying his <a href="http://www.politico.com/blogs/donald-trump-administration/2016/11/dodd-frank-targeted-mnuchin-231994" target="_blank">“number one priority on the regulatory side" is attacking Dodd-Frank Wall Street reforms reining in big banks.</a>
            </div>
            <div className="spacer clear" />

            <div className="profile">
                <img src="images/profiles/WilburRoss.jpg" alt="Wilbur Ross photo" />
                <strong>Wall Street billionaire Wilbur Ross (Secretary of Commerce)</strong> &mdash; Trump's pick for Secretary of Commerce, Wilbur Ross, is a Wall Street billionaire who made his money as a notorious "vulture investor." The so-called "king of bankruptcy," <a href="http://www.thedailybeast.com/articles/2016/11/17/could-this-man-be-donald-trump-s-future-secretary-of-outsourcing.html" target="_blank">he offshored American textile jobs to China and Mexico</a> and <a href="http://www.huffingtonpost.com/entry/trump-wilbur-ross_us_582b4c04e4b01d8a014abacb" target="_blank">12 coal workers died at his mine in West Virginia.</a> But he complains that <a href="http://www.huffingtonpost.com/entry/trump-wilbur-ross_us_582b4c04e4b01d8a014abacb" target="_blank">“the 1 percent is being picked on for political reasons.”</a> Ross bailed out Donald Trump's failing casinos in Atlantic City, <a href="http://www.nytimes.com/2016/11/25/business/dealbook/wilbur-ross-commerce-secretary-donald-trump.html?ref=business&_r=0" target="_blank">buying himself a seat in Trump's crony cabinet.</a>
            </div>
            <div className="spacer clear" />

            <div className="profile">
                <img src="images/profiles/MyronEbell_smaller.jpg" alt="Myron Ebell photo" />
                <strong>A climate science denier for EPA Administrator</strong> &mdash; Trump has picked Myron Ebell to oversee the EPA’s transition to the Trump administration, <a href="http://www.nytimes.com/2016/11/12/science/myron-ebell-trump-epa.html" target="_blank">who directed environmental and energy policy for an organization funded by the coal industry</a> and who extensively questions climate science. For his EPA Administrator, Trump is reportedly picking between Ebell, <a href="http://www.nytimes.com/2014/12/07/us/politics/energy-firms-in-secretive-alliance-with-attorneys-general.html?_r=1" target="_blank"> Scott Pruitt, a shill for the oil and gas industry,</a> and <a href="https://www.desmogblog.com/kathleen-hartnett-white" target="_blank"> Kathleen Hartnett White, a climate denier who has taken radical positions including arguing that CO2 is not a pollutant.</a>
            </div>
            <div className="spacer clear" />
        </div>

        The Senate will be narrowly divided 52-48 between Republicans and Democrats in 2017 and many key Senate committees will be split 10-9 or 11-10. <strong>If Democrats stick together it could only take one or two principled Republican votes to block many of Trump’s nominees.</strong>
        <div className="spacer" />

        Donald Trump may have won the Electoral College, but members of the U.S. Senate should not give any support to Trump appointees espousing racism, xenophobia, misogyny, homophobia, climate denial, and corporate greed.
        <div className="spacer" />

        <a href="#petition" className="sign-the-petition">Sign the petition if you agree.</a>

    </div>
);

const CallPages = React.createClass({
    render: function() {
        return (
            <div className="wrapper">
                <Header />

                <Form />

                <Social />

                <Organizations />

                <Contact />

                <CreativeCommons />
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

ga('create', 'UA-74199344-9', 'auto');
ga('send', 'pageview');
