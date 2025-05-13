const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose
	.connect('mongodb://localhost:27017/yelp-camp', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('MongoDB Connection Established');
	})
	.catch((err) => {
		console.log('MongoDB Connection Error');
		console.log(err);
	});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const randomCityIndex = Math.floor(Math.random() * cities.length);
		const price = Math.floor(Math.random() * 200) + 100;
		const camp = new Campground({
			author: '681e86b462d14f3a6b1c36ee',
			location: `${cities[randomCityIndex].city}, ${cities[randomCityIndex].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				'Nestled in the heart of the Blue Ridge Mountains, Whispering Pines Campground offers a peaceful retreat surrounded by towering pines and babbling brooks. Whether you are a tent camper, RV enthusiast, or looking for a cozy cabin, our campground provides the perfect base for outdoor adventures and family fun.',
			price,
			images: [
				{
					url: 'https://res.cloudinary.com/dstda8quw/image/upload/v1747160223/YelpCamp/yfmqwtvmizhflahb8mfx.png',
					filename: 'YelpCamp/yfmqwtvmizhflahb8mfx',
				},
				{
					url: 'https://res.cloudinary.com/dstda8quw/image/upload/v1747160224/YelpCamp/r3rxjxoinzzneebtkvrh.png',
					filename: 'YelpCamp/r3rxjxoinzzneebtkvrh',
				},
				{
					url: 'https://res.cloudinary.com/dstda8quw/image/upload/v1747160226/YelpCamp/qlcu58uberwej7cyllax.png',
					filename: 'YelpCamp/qlcu58uberwej7cyllax',
				},
				{
					url: 'https://res.cloudinary.com/dstda8quw/image/upload/v1747160226/YelpCamp/oeynq12pkotsow4dwmnq.png',
					filename: 'YelpCamp/oeynq12pkotsow4dwmnq',
				},
				{
					url: 'https://res.cloudinary.com/dstda8quw/image/upload/v1747160229/YelpCamp/zwhl6lalwh83xhv0atb7.png',
					filename: 'YelpCamp/zwhl6lalwh83xhv0atb7',
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
