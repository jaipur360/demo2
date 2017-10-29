// This loads the environment variables from the .env file
require('dotenv-extended').load();
var builder = require('botbuilder');
var restify = require('restify');
var locationDialog = require('botbuilder-location');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

// This bot ensures user's profile is up to date.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('beer_welcome');
    }
]);
var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1e911669-ab2d-4e0d-a651-a7fa88ae5912?subscription-key=3f5d2e492f4b44bda098ddbf4239d099&timezoneOffset=0&verbose=true&q=');
bot.recognizer(recognizer);

// Welcome Netcore
bot.dialog('beer_welcome', function (session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Welcome to BIRA BEER BOT")
            .subtitle("Conversational BOT Powered by Netcore")
			.text("Anytime type 'help' to find what you can do !")
			.buttons([
                builder.CardAction.imBack(session, "beer fest", "Know About Beer Fest!")
            ])
            .images([builder.CardImage.create(session, 'https://www.geminiwiz.com/beer_bira_logo.png')])
    ]);
    session.send(msg).endDialog();
}).triggerAction({
    matches: 'beer_welcome'
});

bot.dialog('beer_fest', 
[
function (session) {
    var msg = new builder.Message(session);
    msg.attachments([
        new builder.HeroCard(session)
            .title("FREE FLOW FEST")
            .subtitle("2 + 1 Offer")
			.text("Mumbai, Bengaluru & Pune 29th Sept – 18th Oct\n\nDelhi & Gurugram 12th – 31st Oct")
			.images([builder.CardImage.create(session, 'https://www.geminiwiz.com/beer_fest.png')])
    ]);
    session.send(msg);
	builder.Prompts.choice(session, "Remind you about incoming fest?", "Yes | No", { listStyle: builder.ListStyle.button });
},
function (session) {
	session.sendTyping();
	session.endDialog('Hi there ! Noted ');
}
]).triggerAction({
    matches: 'beer_fest'
});

bot.dialog('beer_about', function (session) {
    session.endDialog('Hi ! Try asking me things like :: \n\n beer list \n\n lager \n\n strong ale \n\n beer fest');
}).triggerAction({
    matches: 'beer_about'
});

// Add dialog to return list of shirts available
bot.dialog('beer_list', function (session) {
	session.sendTyping()
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Bira 91 White")
            .subtitle("Bira 91 White Ale is a deliciously different wheat beer. Low in bitterness with a hint of spicy citrus and a soft finish. A refreshing all day craft beer brewed with pure ingredients and mixed with barrels of passion.")
            .images([builder.CardImage.create(session, 'https://www.geminiwiz.com/white-center-image-no-padding.png')]),
		new builder.HeroCard(session)
            .title("Bira 91 Blonde")
            .subtitle("Bira 91 Blonde Lager is a refreshing contrast to insipid mass-market beers. Rich in color and made with the finest two-row barley. This flavorful lager is extra malty and high-hopped with a delicate aroma.")
            .images([builder.CardImage.create(session, 'https://www.geminiwiz.com/blonde-center-image-no-padding.png')]),
        // new builder.HeroCard(session)
            // .title("Bira 91 Light")
            // .subtitle("Bira 91 Light is one of the first low-calorie beers to be introduced in the Indian market. The beer is positioned as a “lunchtime lager” – a quick refreshment that you can have with a light meal any time of the day. A super light body, clean appearance, and crisp taste, Bira 91 Light is filled with exotic hops from Europe giving it a pleasant, natural finish making it eminently sessionable.")
            // .images([builder.CardImage.create(session, 'https://www.geminiwiz.com/bira-91-light-lager.jpg')])
			// ,
        new builder.HeroCard(session)
            .title("Bira 91 Strong")
            .subtitle("Bira 91 Strong is a “High-Intensity Wheat Beer”. This beer is a top fermented ale giving it a unique and rich taste that is low on bitterness, high on honey and caramel notes.\n\n\n\n")
            .images([builder.CardImage.create(session, 'https://www.geminiwiz.com/bira-91-strong-ale.jpg')])
			,
        new builder.HeroCard(session)
            .title("Bira 91 The IPA")
            .subtitle("Bira 91 “The Indian Pale Ale” is a hop mutiny in the glass. High in alcohol (7%), this beer is made with a mix of two row pilsner malts, pale malts and wheat malts. Brewed with the world’s most flavorful aroma and bitter hops.")
            .images([builder.CardImage.create(session, 'https://www.geminiwiz.com/bira91ipa.jpg')])
    ]);
    session.send(msg).endDialog();
}).triggerAction({
    matches: 'beer_list'
});

bot.dialog('beer_info', [
    // Step 1
    function (session) {
        builder.Prompts.choice(session, "Please Confirm ?", "Light Lager | Strong Ale | White Ale | Blonde Lager |Indian Pale Ale", { listStyle: builder.ListStyle.button });
    },
	// Step 2
    function (session, results) {
		 if (results.response) {
			var subChoice = session.message.text.toLowerCase().trim();
			if(subChoice=='light lager' || subChoice=='strong ale' || subChoice=='white ale'|| subChoice=='blonde lager'|| subChoice=='indian pale ale')
			{
				builder.Prompts.choice(session, "Would you like to share location ?", "YES | NO", { listStyle: builder.ListStyle.button });	
			}
			
		 }
    },
	function (session, results) {
		session.endDialog('Hi ! Nearest place is 2KM away :: \n\n Favorite Beer Shop \n\n\ Shop No 91 \n\n Greater Road\n\n\n\n * Drink Responsibly \n\n');
	}
]).triggerAction({
    matches: 'beer_info'
});






